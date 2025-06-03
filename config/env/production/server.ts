export default ({ env }) => ({
  host: env('HOST', '::'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: env('URL', 'https://cms.jaripmi.info'),
  proxy: true
});