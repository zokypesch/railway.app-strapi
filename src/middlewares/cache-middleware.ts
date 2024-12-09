import Redis from 'ioredis';

const CACHE_EXPIRATION = process.env.CACHE_EXPIRATION || 3600; // 1 hour in seconds

export default (config, { strapi }) => {
    // REDIS_URL=redis://username:password@host:port
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        connectTimeout: 1000, // 1 second
        commandTimeout: 1000,
        retryStrategy: (times) => {
            if (times <= 1) {
                return 1000; // retry after 1 second
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