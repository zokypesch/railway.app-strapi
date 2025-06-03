const isBuild = process.argv.includes('build');

const config = ({ env }) => {
  const base = {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: {
      keys: env.array('APP_KEYS'),
    },
    proxy: true,
  };

  if (!isBuild) {
    return {
      ...base,
      url: env('URL', 'https://cms.jaripmi.info'),
    };
  }

  return base;
};

export default config;
