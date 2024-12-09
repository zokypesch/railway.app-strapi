import Redis from 'ioredis';


export default (config, { strapi }) => {
    const REDIS_URL = strapi.config.redis.url;
    const CACHE_TIMEOUT = strapi.config.redis.timeout;
    const CACHE_EXPIRATION = strapi.config.redis.cache_ttl;


    const redis = new Redis(REDIS_URL, {
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


        // Generate cache key from request path
        const queryString = ctx.querystring ? `?${decodeURIComponent(ctx.querystring)}` : '';
        const cacheKey = `strapi:cache:${ctx.path}${queryString}`;

        try {
            // Try to get cached response
            const cachedResponse = await redis.get(cacheKey);
            
            if (cachedResponse) {
                // If cache hit, return cached response
                const { body, headers } = JSON.parse(cachedResponse);
                ctx.body = body;
                Object.entries(headers).forEach(([key, value]) => {
                    ctx.set(key, value as string);
                });
                ctx.set('X-Cache', 'HIT');
            } else {
                // If cache miss, process request and cache response
                await next();
                
                if (ctx.status === 200) {
                    const responseToCache = {
                        body: ctx.body,
                        headers: ctx.response.headers
                    };
                    
                    await redis.setex(
                        cacheKey,
                        CACHE_EXPIRATION,
                        JSON.stringify(responseToCache)
                    );
                }
                ctx.set('X-Cache', 'MISS');
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