export default ({ env }) => ({
    url: env('REDIS_URL') || 'redis://127.0.0.1:6379', // REDIS_URL=redis://username:password@host:port
    timeout: env.int('REDIS_TIMEOUT') || 1000,
    cache_ttl: env.int('CACHE_EXPIRATION') || 3600,
});
