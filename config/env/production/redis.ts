export default ({ env }) => ({
    url: env('REDIS_URL') || 'redis://default:QARjCCHRJwjDkncizeBreMkcoLXkAPvq@autorack.proxy.rlwy.net:27780?family=0', // REDIS_URL=redis://username:password@host:port
    timeout: env.int('REDIS_TIMEOUT') || 1000,
    cache_ttl: env.int('CACHE_EXPIRATION') || 3600,
});
