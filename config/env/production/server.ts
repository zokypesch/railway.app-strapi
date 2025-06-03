export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 8080),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: env('URL', 'https://cms.jaripmi.info'),
  proxy: true
});