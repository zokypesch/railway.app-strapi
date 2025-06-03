const isBuild = process.argv.includes('build');

const config = ({ env }) => {
  const base = {
    host: '0.0.0.0',
    port: 1337,
    app: {
      keys: 'tj8ewf0h9w8zeadcbw726nl6k9xblr3v',
    },
    proxy: true,
  };

  if (!isBuild) {
    return {
      ...base,
      url: 'https://cms.jaripmi.info',
    };
  }

  return base;
};

export default config;
