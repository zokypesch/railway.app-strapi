export default (config, { strapi })=> {
    return async (ctx, next) => {
        console.log("cache middleware");
        const start = Date.now();

        await next();

        const delta = Math.ceil(Date.now() - start);
        ctx.set('X-Response-Time', delta + 'ms');
    };
};