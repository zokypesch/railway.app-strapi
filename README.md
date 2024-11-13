# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>

# spesific version 20
link: https://askubuntu.com/questions/426750/how-can-i-update-my-nodejs-to-the-latest-version

sudo npm cache clean -f
sudo npm install -g n
<!-- sudo n stable -->
sudo n v20.9.0

# create postgre docker
https://github.com/sameersbn/docker-postgresql

docker run --name postgresql -itd --restart always \
  --publish 5432:5432 \
  --volume postgresql:/mnt/c/Users/Maulana/strapi/railway.app-strapi/postgres \
  --env 'PG_PASSWORD=Pmi2024!' \
  sameersbn/postgresql:15-20230628

# windows issues
https://www.youtube.com/watch?v=gwhG7rar2gU

# flush dns
ipconfig /flushdns
ipconfig /registerdns
# type in chrome
chrome://net-internals/#hsts

delete domain security policies
entry: localhost
entry: 127.0.0.1

netsh http add iplisten 127.0.0.1
add in C:\Windows\System32\drivers\etc\hosts
127.0.0.1 localhost

https://stackoverflow.com/questions/34543443/cant-access-127-0-0-1

node:internal/process/promises:289

            triggerUncaughtException(err, true /* fromPromise */);

            ^

[UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "Must supply api_key".] {

  code: 'ERR_UNHANDLED_REJECTION'

}

 