export default [
  {
    name: "Next.js",
    slug: "nextjs",
    bg1: "#B4CBE5",
    solution: "Deploy on the platform made for Next.js.",
    demo: "https://nextjs.examples.4everland.org",
    logo: "img/logos/next.svg",
    tagline:
      "Next.js makes you productive with React instantly — whether you want to build static or dynamic sites.",
    description: "A Next.js app and a Serverless Function API.",
    website: "https://nextjs.org",
    envPrefix: "NEXT_PUBLIC_",
    useRuntime: {
      src: "package.json",
      use: "@vercel/next",
    },
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        value: "next build",
        placeholder: "`npm run build` or `next build`",
      },
      devCommand: {
        value: "next dev --port $PORT",
        placeholder: "next",
      },
      outputDirectory: {
        value: "out",
      },
    },
    recommendedIntegrations: [
      {
        id: "oac_5lUsiANun1DEzgLg0NZx5Es3",
        dependencies: ["next-plugin-sentry", "next-sentry-source-maps"],
      },
    ],
    cachePattern: ".next/cache/**",
  },
  {
    name: "Svelte",
    slug: "svelte",
    demo: "https://svelte.examples.4everland.org",
    logo: "img/logos/svelte.svg",
    tagline:
      "Svelte lets you write high performance reactive apps with significantly less boilerplate. ",
    description:
      "A Svelte app, using the Svelte template, and a Serverless Function API.",
    website: "https://svelte.dev",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `rollup -c`",
      },
      devCommand: {
        value: "rollup -c -w",
      },
      outputDirectory: {
        value: "public",
      },
    },
  },
  {
    name: "Nuxt.js",
    slug: "nuxtjs",
    bg1: "#ADD5DA",
    solution: "Deploying a Static Nuxt.js App with 4everland",
    demo: "https://nuxtjs.examples.4everland.org",
    logo: "img/logos/nuxt.svg",
    tagline:
      "Nuxt.js is the web comprehensive framework that lets you dream big with Vue.js.",
    description: "A Nuxt.js app, bootstrapped with create-nuxt-app.",
    website: "https://nuxtjs.org",
    envPrefix: "NUXT_ENV_",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `nuxt generate`",
      },
      devCommand: {
        value: "nuxt",
      },
      outputDirectory: {
        value: "dist",
      },
    },
    cachePattern: ".nuxt/**",
  },
  {
    name: "Vue.js",
    slug: "vue",
    bg1: "#C3DBD5",
    solution:
      "The Progressive JavaScript Framework. Approachable. Versatile. Performant.",
    demo: "https://vue.examples.4everland.org",
    logo: "img/logos/vue.svg",
    tagline:
      "Vue.js is a versatile JavaScript framework that is as approachable as it is performant.",
    description: "A Vue.js app, created with the Vue CLI.",
    website: "https://vuejs.org",
    envPrefix: "VUE_APP_",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `vue-cli-service build`",
      },
      devCommand: {
        value: "vue-cli-service serve --port $PORT",
        placeholder: "vue-cli-service serve",
      },
      outputDirectory: {
        value: "dist",
      },
    },
  },
  {
    name: "Vite",
    slug: "vite",
    logo: "img/logos/vite.svg",
    settings: {
      installCommand: {
        placeholder: "npm install",
      },
      buildCommand: {
        placeholder: "npm run build",
      },
      outputDirectory: {
        value: "dist",
      },
    },
  },
  {
    name: "Gatsby.js",
    slug: "gatsby",
    bg1: "#D7D3E8",
    solution: "Deploy Gatsby to be fast in every way that matters.",
    demo: "https://gatsby.examples.4everland.org",
    logo: "img/logos/gatsby.svg",
    tagline:
      "Gatsby helps developers build blazing fast websites and apps with React.",
    description:
      "A Gatsby app, using the default starter theme and a Serverless Function API.",
    website: "https://gatsbyjs.org",
    envPrefix: "GATSBY_",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `gatsby build`",
      },
      devCommand: {
        value: "gatsby develop --port $PORT",
        placeholder: "gatsby develop",
      },
      outputDirectory: {
        value: "public",
      },
    },
    cachePattern: "{.cache,public}/**",
  },
  {
    name: "Angular",
    slug: "angular",
    bg1: "#ffd5df",
    solution:
      "Deploy an enterprise-class application on a world-class platform.",
    demo: "https://angular.examples.4everland.org",
    logo: "img/logos/angular.svg",
    tagline:
      "Angular is a TypeScript-based cross-platform framework from Google.",
    description: "An Angular app, created with the Angular CLI.",
    website: "https://angular.io",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `ng build`",
      },
      devCommand: {
        value: "ng serve --port $PORT",
        placeholder: "ng serve",
      },
      outputDirectory: {
        value: "dist",
      },
    },
  },
  {
    name: "Ember.js",
    slug: "ember",
    demo: "https://ember.examples.4everland.org",
    logo: "img/logos/ember.svg",
    tagline:
      "Ember.js helps webapp developers be more productive out of the box.",
    description: "An Ember app, created with the Ember CLI.",
    website: "https://emberjs.com/",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `ember build`",
      },
      devCommand: {
        value: "ember serve --port $PORT",
        placeholder: "ember serve",
      },
      outputDirectory: {
        value: "dist",
      },
    },
  },
  {
    name: "Hexo",
    slug: "hexo",
    demo: "https://hexo.examples.4everland.org",
    logo: "img/logos/hexo.svg",
    tagline:
      "Hexo is a fast, simple \u0026 powerful blog framework powered by Node.js.",
    description: "A Hexo site, created with the Hexo CLI.",
    website: "https://hexo.io",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `hexo generate`",
      },
      devCommand: {
        value: "hexo server --port $PORT",
        placeholder: "hexo server",
      },
      outputDirectory: {
        value: "public",
      },
    },
  },
  {
    name: "Eleventy",
    slug: "eleventy",
    demo: "https://eleventy.examples.4everland.org",
    logo: "img/logos/eleventy.svg",
    tagline:
      "11ty is a simpler static site generator written in JavaScript, created to be an alternative to Jekyll.",
    description: "An Eleventy site, created with npm init.",
    website: "https://www.11ty.dev",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `npx @11ty/eleventy`",
      },
      devCommand: {
        value: "npx @11ty/eleventy --serve --watch --port $PORT",
        placeholder: "npx @11ty/eleventy --serve",
      },
      outputDirectory: {
        value: "_site",
      },
    },
    cachePattern: ".cache/**",
  },
  {
    name: "Hugo",
    slug: "hugo",
    demo: "https://hugo.examples.4everland.org",
    logo: "img/logos/hugo.svg",
    tagline:
      "Hugo is the world’s fastest framework for building websites, written in Go.",
    description: "A Hugo site, created with the Hugo CLI.",
    website: "https://gohugo.io",
    settings: {
      installCommand: {
        placeholder: "None",
      },
      buildCommand: {
        placeholder: "`npm run build` or `hugo -D --gc`",
      },
      devCommand: {
        value: "hugo server -D -w -p $PORT",
        placeholder: "hugo server -D",
      },
      outputDirectory: {
        placeholder: "`public` or `publishDir` from the `config` file",
      },
    },
    defaultVersion: "0.58.2",
  },
  {
    name: "Blitz.js",
    slug: "blitzjs",
    demo: "https://blitzjs.examples.4everland.org",
    logo: "img/logos/blitz.svg",
    tagline: "Blitz.js: The Fullstack React Framework",
    description:
      "A brand new Blitz.js app - the result of running `npx blitz new`.",
    website: "https://blitzjs.com",
    envPrefix: "NEXT_PUBLIC_",
    useRuntime: {
      src: "package.json",
      use: "@vercel/next",
    },
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `blitz build`",
      },
      devCommand: {
        value: "blitz start",
      },
      outputDirectory: {
        placeholder: "Next.js default",
      },
    },
  },
  {
    name: "Docusaurus 2",
    slug: "docusaurus-2",
    demo: "https://docusaurus-2.examples.4everland.org",
    logo: "img/logos/docusaurus.svg",
    tagline:
      "Docusaurus makes it easy to maintain Open Source documentation websites.",
    description:
      "A static Docusaurus site that makes it easy to maintain OSS documentation.",
    website: "https://v2.docusaurus.io",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `docusaurus build`",
      },
      devCommand: {
        value: "docusaurus start --port $PORT",
        placeholder: "docusaurus start",
      },
      outputDirectory: {
        value: "build",
      },
    },
  },
  {
    name: "Docusaurus 1",
    slug: "docusaurus",
    demo: "https://docusaurus.examples.4everland.org",
    logo: "img/logos/docusaurus.svg",
    tagline:
      "Docusaurus makes it easy to maintain Open Source documentation websites.",
    description:
      "A static Docusaurus site that makes it easy to maintain OSS documentation.",
    website: "https://docusaurus.io/",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `docusaurus-build`",
      },
      devCommand: {
        value: "docusaurus-start --port $PORT",
        placeholder: "docusaurus-start",
      },
      outputDirectory: {
        value: "build",
      },
    },
  },
  {
    name: "Preact",
    slug: "preact",
    demo: "https://preact.examples.4everland.org",
    logo: "img/logos/preact.svg",
    tagline:
      "Preact is a fast 3kB alternative to React with the same modern API.",
    description: "A Preact app, created with the Preact CLI.",
    website: "https://preactjs.com",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `preact build`",
      },
      devCommand: {
        value: "preact watch --port $PORT",
        placeholder: "preact watch",
      },
      outputDirectory: {
        value: "build",
      },
    },
  },
  {
    name: "Dojo",
    slug: "dojo",
    demo: "https://dojo.examples.4everland.org",
    logo: "img/logos/dojo.png",
    tagline: "Dojo is a modern progressive, TypeScript first framework.",
    description:
      "A Dojo app, created with the Dojo CLI's cli-create-app command.",
    website: "https://dojo.io",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `dojo build`",
      },
      devCommand: {
        value: "dojo build -m dev -w -s -p $PORT",
        placeholder: "dojo build -m dev -w -s",
      },
      outputDirectory: {
        value: "output/dist",
      },
    },
  },
  {
    name: "Scully",
    slug: "scully",
    demo: "https://scully.examples.4everland.org",
    logo: "img/logos/scullyio-logo.png",
    tagline: "Scully is a static site generator for Angular.",
    description: "The Static Site Generator for Angular apps.",
    website: "https://github.com/scullyio/scully",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `ng build \u0026\u0026 scully`",
      },
      devCommand: {
        value: "ng serve --port $PORT",
        placeholder: "ng serve",
      },
      outputDirectory: {
        value: "dist",
      },
    },
  },
  {
    name: "Ionic Angular",
    slug: "ionic-angular",
    demo: "https://ionic-angular.examples.4everland.org",
    logo: "img/logos/ionic.svg",
    tagline:
      "Ionic Angular allows you to build mobile PWAs with Angular and the Ionic Framework.",
    description: "An Ionic Angular site, created with the Ionic CLI.",
    website: "https://ionicframework.com",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `ng build`",
      },
      devCommand: {
        value: "ng serve",
      },
      outputDirectory: {
        value: "www",
      },
    },
  },
  {
    name: "Polymer",
    slug: "polymer",
    demo: "https://polymer.examples.4everland.org",
    logo: "img/logos/polymer.svg",
    tagline:
      "Polymer is an open-source webapps library from Google, for building using Web Components.",
    description: "A Polymer app, created with the Polymer CLI.",
    website: "https://www.polymer-project.org/",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `polymer build`",
      },
      devCommand: {
        value: "polymer serve --port $PORT",
        placeholder: "polymer serve",
      },
      outputDirectory: {
        value: "build",
      },
    },
  },
  {
    name: "Ionic React",
    slug: "ionic-react",
    demo: "https://ionic-react.examples.4everland.org",
    logo: "img/logos/ionic.svg",
    tagline:
      "Ionic React allows you to build mobile PWAs with React and the Ionic Framework.",
    description: "An Ionic React site, created with the Ionic CLI.",
    website: "https://ionicframework.com",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `react-scripts build`",
      },
      devCommand: {
        value: "react-scripts start",
      },
      outputDirectory: {
        value: "build",
      },
    },
  },
  {
    name: "Create React App",
    slug: "create-react-app",
    bg1: "#c6f3ff",
    solution: "Deploy React apps on the platform its community loves.",
    demo: "https://react-functions.examples.4everland.org",
    logo: "img/logos/react.svg",
    tagline: "Create React App allows you to get going with React in no time.",
    description:
      "A React app, bootstrapped with create-react-app, and a Serverless Function API.",
    website: "https://create-react-app.dev",
    envPrefix: "REACT_APP_",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `react-scripts build`",
      },
      devCommand: {
        value: "react-scripts start",
      },
      outputDirectory: {
        value: "build",
      },
    },
  },
  {
    name: "Gridsome",
    slug: "gridsome",
    demo: "https://gridsome.examples.4everland.org",
    logo: "img/logos/gridsome.svg",
    tagline:
      "Gridsome is a Vue.js-powered framework for building websites \u0026 apps that are fast by default.",
    description: "A Gridsome app, created with the Gridsome CLI.",
    website: "https://gridsome.org/",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `gridsome build`",
      },
      devCommand: {
        value: "gridsome develop -p $PORT",
        placeholder: "gridsome develop",
      },
      outputDirectory: {
        value: "dist",
      },
    },
  },
  {
    name: "UmiJS",
    slug: "umijs",
    demo: "https://umijs.examples.4everland.org",
    logo: "img/logos/umi.svg",
    tagline:
      "UmiJS is an extensible enterprise-level React application framework.",
    description: "An UmiJS app, created using the Umi CLI.",
    website: "https://umijs.org",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `umi build`",
      },
      devCommand: {
        value: "umi dev --port $PORT",
        placeholder: "umi dev",
      },
      outputDirectory: {
        value: "dist",
      },
    },
  },
  {
    name: "Sapper",
    slug: "sapper",
    demo: "https://sapper.examples.4everland.org",
    logo: "img/logos/svelte.svg",
    tagline:
      "Sapper is a framework for building high-performance universal web apps with Svelte.",
    description: "A Sapper app, using the Sapper template.",
    website: "https://sapper.svelte.dev",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `sapper export`",
      },
      devCommand: {
        value: "sapper dev --port $PORT",
        placeholder: "sapper dev",
      },
      outputDirectory: {
        value: "__sapper__/export",
      },
    },
  },
  {
    name: "Saber",
    slug: "saber",
    demo: "https://saber.examples.4everland.org",
    logo: "img/logos/saber.svg",
    tagline:
      "Saber is a framework for building static sites in Vue.js that supports data from any source.",
    description: "A Saber site, created with npm init.",
    website: "https://saber.land/",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `saber build`",
      },
      devCommand: {
        value: "saber --port $PORT",
        placeholder: "saber",
      },
      outputDirectory: {
        value: "public",
      },
    },
  },
  {
    name: "Stencil",
    slug: "stencil",
    demo: "https://stencil.examples.4everland.org",
    logo: "img/logos/stencil.svg",
    tagline:
      "Stencil is a powerful toolchain for building Progressive Web Apps and Design Systems.",
    description: "A Stencil site, created with the Stencil CLI.",
    website: "https://stenciljs.com/",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `stencil build`",
      },
      devCommand: {
        value: "stencil build --dev --watch --serve --port $PORT",
        placeholder: "stencil build --dev --watch --serve",
      },
      outputDirectory: {
        value: "www",
      },
    },
  },
  {
    name: "RedwoodJS",
    slug: "redwoodjs",
    demo: "https://redwoodjs.examples.4everland.org",
    logo: "img/logos/redwoodjs.svg",
    tagline: "RedwoodJS is a full-stack framework for the Jamstack.",
    description: "A RedwoodJS app, bootstraped with create-redwood-app.",
    website: "https://redwoodjs.com",
    envPrefix: "REDWOOD_ENV_",
    useRuntime: {
      src: "package.json",
      use: "@vercel/redwood",
    },
    ignoreRuntimes: ["@vercel/node"],
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        value: "yarn rw deploy vercel",
      },
      devCommand: {
        value: 'yarn rw dev --fwd="--port=$PORT --open=false"',
        placeholder: "yarn rw dev",
      },
      outputDirectory: {
        placeholder: "RedwoodJS default",
      },
    },
  },
  {
    name: "Jekyll",
    slug: "jekyll",
    demo: "https://jekyll.examples.4everland.org",
    logo: "img/logos/jekyll.svg",
    tagline:
      "Jekyll makes it super easy to transform your plain text into static websites and blogs.",
    description: "A Jekyll site, created with the Jekyll CLI.",
    website: "https://jekyllrb.com/",
    settings: {
      installCommand: {
        value: "bundle install",
      },
      buildCommand: {
        placeholder: "`npm run build` or `jekyll build`",
      },
      devCommand: {
        value: "bundle exec jekyll serve --watch --port $PORT",
        placeholder: "bundle exec jekyll serve",
      },
      outputDirectory: {
        placeholder: "`_site` or `destination` from `_config.yml`",
      },
    },
    cachePattern: "{vendor/bin,vendor/cache,vendor/bundle}/**",
  },
  {
    name: "Brunch",
    slug: "brunch",
    demo: "https://brunch.examples.4everland.org",
    logo: "img/logos/brunch.svg",
    tagline:
      "Brunch is a fast and simple webapp build tool with seamless incremental compilation for rapid development.",
    description: "A Brunch app, created with the Brunch CLI.",
    website: "https://brunch.io/",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {
        placeholder: "`npm run build` or `brunch build --production`",
      },
      devCommand: {
        value: "brunch watch --server --port $PORT",
        placeholder: "brunch watch --server",
      },
      outputDirectory: {
        value: "public",
      },
    },
  },
  {
    name: "Middleman",
    slug: "middleman",
    demo: "https://middleman.examples.4everland.org",
    logo: "img/logos/middleman.svg",
    tagline:
      "Middleman is a static site generator that uses all the shortcuts and tools in modern web development.",
    description: "A Middleman app, created with the Middleman CLI.",
    website: "https://middlemanapp.com/",
    settings: {
      installCommand: {
        value: "bundle install",
      },
      buildCommand: {
        placeholder: "`npm run build` or `bundle exec middleman build`",
      },
      devCommand: {
        value: "bundle exec middleman server -p $PORT",
        placeholder: "bundle exec middleman server",
      },
      outputDirectory: {
        value: "build",
      },
    },
    cachePattern: "{vendor/bin,vendor/cache,vendor/bundle}/**",
  },
  {
    name: "Zola",
    slug: "zola",
    demo: "https://zola.examples.4everland.org",
    logo: "img/logos/zola.png",
    tagline: "Everything you need to make a static site engine in one binary.",
    description: 'A Zola app, created with the "Getting Started" tutorial.',
    website: "https://www.getzola.org",
    settings: {
      installCommand: {
        placeholder: "None",
      },
      buildCommand: {
        value: "zola build",
      },
      devCommand: {
        value: "zola serve --port $PORT",
        placeholder: "zola serve",
      },
      outputDirectory: {
        value: "public",
      },
    },
    defaultVersion: "0.13.0",
  },
  {
    name: "Other",
    slug: null,
    logo: "img/logos/github.png",
    description: "No framework or a unoptimized framework.",
    settings: {
      installCommand: {
        placeholder: "`yarn install` or `npm install`",
      },
      buildCommand: {},
      devCommand: {
        placeholder: "None",
      },
      outputDirectory: {
        placeholder: "`public` if it exists, or `.`",
      },
    },
  },
].map((it) => {
  it.logo = "/" + it.logo;
  return it;
});
