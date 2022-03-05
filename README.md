# JP-nuxt

![](https://img.shields.io/github/license/Tch1b0/JP-nuxt) ![](https://img.shields.io/github/workflow/status/Tch1b0/JP-nuxt/ci?label=ci)

My personal website

You can read more about it [here](https://johannespour.de/projects/451393301)

## Built with

-   [TypeScript](https://www.typescriptlang.org/)
-   [Vue.js v3](https://v3.vuejs.org/)
-   [Nuxt 3](http://v3.nuxtjs.org/)
-   [tailwindcss](https://tailwindcss.com/)
-   [docker](https://www.docker.com/)
-   Libraries:
    -   [vue-chart-3](https://github.com/victorgarciaesgi/vue-chart-3)
    -   [remarkable](https://www.npmjs.com/package/remarkable)
    -   [highlight.js](https://www.npmjs.com/package/highlight.js)
    -   [dracula theme](https://github.com/dracula/highlightjs)
    -   [jstoxml](https://github.com/davidcalhoun/jstoxml)
    -   [nanoid](https://github.com/ai/nanoid)

## Env variables

Declare these variables in the `.env` file

```bash
# the port the server should run on
SERVER_PORT

# the admin username for the site
JP_USERNAME

# the admin password for the site
JP_PASSWORD

# your GitHub username
GH_USERNAME
```

## Requirements

-   [docker](https://docker.com)

## Setting up

### From [docker-hub](https://hub.docker.com/)

Create the file `docker-compose.yml`

```yaml
version: "3.8"

services:
    server:
        image: tch1b0/jp-nuxt:latest
        environment:
            - JP_USERNAME=<YOUR USERNAME>
            - JP_PASSWORD=<YOUR PASSWORD>
            - GH_USERNAME=<YOUR GITHUB USERNAME>
        ports:
            - "<YOUR PORT>:3000"

        # optionally:
        volumes:
            - "./data:/app/data"
```

```bash
$ docker-compose up -d
```

### From source

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
