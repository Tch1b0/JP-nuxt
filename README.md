# JP-nuxt

My personal website

## Built with

-   [TypeScript](https://www.typescriptlang.org/)
-   [Vue.js v3](https://v3.vuejs.org/)
-   [Nuxt 3](http://v3.nuxtjs.org/)
-   [tailwindcss](https://tailwindcss.com/)
-   [docker](https://www.docker.com/)
-   Smaller libraries:
    -   [remarkable](https://www.npmjs.com/package/remarkable)
    -   [highlight.js](https://www.npmjs.com/package/highlight.js)
    -   [dracula theme](https://github.com/dracula/highlightjs)
    -   [jstoxml](https://github.com/davidcalhoun/jstoxml)

## Env variables

Declare these in the `.env` file

```bash
PORT
JP_USERNAME
JP_PASSWORD
GH_USERNAME
```

## Requirements

-   [docker](https://docker.com)

## Setting up

```bash
git clone https://github.com/Tch1b0/JP-nuxt
```

```bash
cd ./JP-nuxt
```

```bash
touch ./.env
```

Now add your [environmental variables](#env-variables) in the `.env` file

```bash
docker-compose build
```

```bash
docker-compose up -d
```
