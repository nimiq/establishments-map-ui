<br />
<p align="center">
  <a href="https://github.com/nimiq/crypto-map">
    <img src="./public/logo.svg" alt="Logo" width="130" />
  </a>

<h1 align="center">
Nimiq's Crypto Map
</h1>
<p align="center">
The Crypto Map by Nimiq.<br>
Explore the world and find places to spend your crypto.
<p>

<p align="center">
<a href="https://map.nimiq.com/" target="__blank"><img src="https://img.shields.io/badge/Locations-2000-blue?style=flat&colorA=002438&colorB=41c399" alt="Locations"></a>
<a href="https://map.nimiq.com/" target="__blank"><img src="https://img.shields.io/badge/Cryptos-12-blue?style=flat&colorA=002438&colorB=41c399" alt="Cryptos"></a>
<a href="https://map.nimiq.com/" target="__blank"><img src="https://img.shields.io/badge/Providers-6-blue?style=flat&colorA=002438&colorB=41c399" alt="Providers"></a>
</p>

<p align="center">
<a href="https://t.me/joinchat/AAAAAEJW-ozFwo7Er9jpHw"><b>Get involved!</b></a>
</p>
<p align="center">
 <a href="https://map.nimiq.com/">Crypto Map</a> | <a href="https://wallet.nimiq.com">Wallet</a> | <a href="https://cpl.com">Cryptopayment Link</a> 
</p>


## Contributing

All PRs all welcome! Join our [Telegram](https://t.me/joinchat/AAAAAEJW-ozFwo7Er9jpHw) and we will get you up and running!

## Dev Setup

> [!IMPORTANT]  
> You need to have a valid `.env` file in the root of the project.

1. Clone the repo
2. Run `pnpm i`
3. Run `pnpm dev` to run the app or run `pnpm story:dev` to run histoire

## Project structure

The project is structured in a monorepo:

- [`./src`](`./src`): The vue app.
- [`./types`](`./types`): Shared types across the project.
- [`./shared`](`./shared`): Shared functions across the project.
- [`./database`](`./database`): Functions to interact with the database.
- [`./bot`](`./bot`): A slack bot to manage the database.
- [`./supbase`](`./supabase`): Edge Functions in Supabase.

### Database

The `app` only can make read operations to the database, all read operations can be found in [`./database/getters.ts`](`./database/getters.ts`).
The `bot` and `supabase` can make write operations to the database, [`./database/functions.ts`](`./database/functions.ts`). Write operations require authentication.

### Bot

The bot has been developed with the [Deno Slack SDK](https://github.com/slackapi/deno-slack-sdk), which requires `Deno`.

### Supabase Functions

Since we are deploying the Edge Function in Supabase, we need to use `Deno` and `TypeScript` to develop the functions. Read more about how we use [`Supabase Functions`](#data-flow).

## Data flow

This section explains how we load the data from Supabase and how we use it in the application.

Firstly, we run the [Generate Locations Clusters Set](./supabase/functions/generate-locations_clusters-set.ts) function every time we update our main `locations` table, which contains all the data from all the `locations` we store.

This function will populate the `locations_clusters_set` table. This is a table that contains all the clusters from zoom level 3 (minimum zoom level in the application) to level 14. When the user explores the map at a zoom level between 3 and 14, we will load the clusters from this table.

When fetching data for the clusters, there may be locations that are not in the cluster set, so the request for the clusters will return an object like `{ singles: Location[], clusters: Cluster[] }`.

This solution works well when the zoom level is between 3 and 14. However, the higher the zoom level, the more clusters we will have but the less computation is required to generate the clusters as there are fewer locations in the view. Therefore, from level 15 onwards, we will load the locations directly from the `locations` table and cluster them in the client.

Each time we load a cluster or location, we will store it in memory, and before making any HTTP request or computation, we will check that we have the data in memory. See [`./src/stores/locations.ts`](`./src/stores/locations.ts`) and [`./src/stores/cluster.ts`](`./src/stores/cluster.ts`) for more details.

The code for the clustering can be found in [`./shared/compute-cluster.ts`](`./shared/compute-cluster.ts`). This function is used in the [`./src/stores/cluster.ts`](`./src/stores/cluster.ts`) store and in the [`./supabase/functions/generate-locations_clusters-set.ts`](`./supabase/functions/generate-locations_clusters-set.ts`) function.


## 🏗️ Stack

For the app:

- [TypeScript](https://www.typescriptlang.org/) TypeScript extends JavaScript by adding types.
- [Vue](https://vuejs.org/) An approachable, performant and versatile framework for building web user interfaces.
- [VueUse](https://vueuse.org/) Collection of Essential Vue Composition Utilities
- [Radix UI](https://radix-vue.com) for porting Radix UI to Vue
- [GMaps](https://developers.google.com/maps) Build awesome apps with Google’s knowledge of the real world
- [Tailwind](https://tailwindcss.com/) A utility-first CSS framework for rapid UI development.
- [Deno Slack SDK](https://github.com/slackapi/deno-slack-sdk) A Deno SDK for Slack's APIs.
