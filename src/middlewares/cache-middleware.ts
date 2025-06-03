import Redis from 'ioredis';

export default (config, { strapi }) => {
    const CACHE_TIMEOUT = 1000;
    const CACHE_EXPIRATION = process.env.REDIS_CACHE_EXPIRATION || 3600;

    const redis = new Redis(process.env.REDIS_URL || 'redis://default:QARjCCHRJwjDkncizeBreMkcoLXkAPvq@autorack.proxy.rlwy.net:27780?family=0', {
        connectTimeout: CACHE_TIMEOUT,
        commandTimeout: CACHE_TIMEOUT,
        retryStrategy: (times) => {
            if (times <= 1) {
                return CACHE_TIMEOUT; // retry after 1 second
            }
            return null; // stop retrying after 1 attempt
        }
    });

    redis.on('error', (error) => {
        strapi.log.error('Redis connection error:', error);
    });

    return async (ctx, next) => {
        const start = Date.now();
        
        const matches = ctx.path.match(/^\/?api(\/.+)$/);

        // Skip caching for non-GET requests
        if (ctx.method !== 'GET') {
            await next();
            return;
        }
        // skip caching for non-API requests
        if (!matches) {
            await next();
            return;
        }
        if (matches.length !== 2) {
            await next();
            return;
        }

        // Parse query parameters
        const queryParams = new URLSearchParams(ctx.querystring);
        const shouldClearCache = queryParams.get('clear_cache') === '1';
        
        // Remove clear_cache from query params for cache key
        queryParams.delete('clear_cache');
        const cleanQueryString = queryParams.toString();
        const queryStringForKey = cleanQueryString ? `?${decodeURIComponent(cleanQueryString)}` : '';
        const cacheKey = `strapi:cache:${ctx.path}${queryStringForKey}`;

        const tryRedisOperation = async (operation: () => Promise<any>, retryCount = 1): Promise<any> => {
            try {
                return await operation();
            } catch (error) {
                if (retryCount > 0) {
                    strapi.log.warn('Redis operation failed, retrying once...');
                    return tryRedisOperation(operation, retryCount - 1);
                }
                throw error;
            }
        };

        try {
            // Clear cache if requested
            if (shouldClearCache) {
                await tryRedisOperation(() => redis.del(cacheKey));
                strapi.log.info(`Cache cleared for key: ${cacheKey}`);
                ctx.set('X-Cache', 'CLEARED');
            }

            // Try to get cached response (will be null if just cleared)
            const cachedResponse = await tryRedisOperation(() => redis.get(cacheKey));
            
            if (cachedResponse && !shouldClearCache) {
                // If cache hit, return cached response
                const { body, headers, status } = JSON.parse(cachedResponse);
                ctx.body = body;
                ctx.status = status;
                Object.entries(headers).forEach(([key, value]) => {
                    ctx.set(key, value as string);
                });
                ctx.set('X-Cache', 'HIT');
            } else {
                // If cache miss, process request
                await next();
                
                // Only cache 200 OK responses
                if (ctx.status === 200) {
                    const responseToCache = {
                        body: ctx.body,
                        headers: ctx.response.headers,
                        status: ctx.status
                    };
                    
                    await tryRedisOperation(() => 
                        redis.setex(
                            cacheKey,
                            CACHE_EXPIRATION,
                            JSON.stringify(responseToCache)
                        )
                    );
                    ctx.set('X-Cache', shouldClearCache ? 'CLEARED+MISS' : 'MISS');
                } else {
                    ctx.set('X-Cache', 'SKIP');
                }
            }
        } catch (error) {
            ctx.set('X-Cache', 'ERROR');
            strapi.log.error('Cache middleware error:', error);
            await next();
        }

        const delta = Math.ceil(Date.now() - start);
        ctx.set('X-Response-Time', delta + 'ms');
    };
};