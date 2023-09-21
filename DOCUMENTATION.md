# Documentation

## Table of content

* [Initialization](#initialization)
* [Compilation](#compilation)
  * [Compilation configuration](#compilation-configuration)
  * [Compilation artifacts](#compilation-artifacts)
  * [Recompilation](#recompilation)
* [Clean](#clean)
* [SE](#se)
  * [info](#se-info)
  * [version](#se-version)
  * [start](#se-start)
  * [stop](#se-stop)
  * [reset](#se-reset)
* [Network](#network)
  * [Where to get endpoints](#where-to-get-endpoints)
  * [Configuration](#configuration)
    * [vasku.config.ts](#vaskuconfigts)
    * [env](#env)
    * [se-network](#se-network)
* [Giver](#giver)
  * [View](#view)
  * [Send](#send)
  * [Deploy](#deploy)
  * [Configuration](#configuration-2)
    * [vasku.config.ts](#vaskuconfigts-2)
    * [SE givers](#se-givers)
    * [keys](#keys)
* [Tests](#tests)
  * [Out of the box](#out-of-the-box)
* [Scripts](#scripts)
  * [Out of the box](#out-of-the-box-2)
* [Configuration](#configuration-3)
  * [Minimum](#minimum)
  * [Full](#full)
* [Examples](#examples)
  * [Deploy](#deploy)
  * [Run method](#run-method)
  * [Call method](#call-method)
  * [Call method from wallet](#call-method-from-wallet)

## Initialization

```shell
npx vasku
```

## Compilation

```shell
npx vasku compile [options...]
```

* `-a, --all` - compile all contracts
* `-h, --help` - display help for command

### Compilation configuration

You can set up compilation in `vasku.config.ts`

**Example**

```typescript
const config = {
  compile: {
    compiler: 'latest',
    linker: 'latest',
    include: ['**/*.tsol', '**/*.sol'],
    exclude: ['**/interface/*', '**/interfaces/*']
  }
}
```

* `compiler` - [TON-Solidity-Compiler](https://github.com/tonlabs/TON-Solidity-Compiler) version. To view all available
  versions run in terminal: `npx everdev sol version`. It is recommended to specify the version. Default is `latest`.
* `linker` - [TVM-linker](https://github.com/tonlabs/TVM-linker) version. Default is `latest`. To view all available
  versions run in terminal: `npx everdev sol version`. It is recommended to specify the version. Default is `latest`.
* `include` - list of source files for compilation in contract directory in [glob](https://github.com/isaacs/node-glob)
  format e.g. `['*.tsol']`. Default is `['**/*.tsol', '**/*.sol']`.
* `exclude` - list of source files excluded from compilation in [glob](https://github.com/isaacs/node-glob) format
  e.g. `['**/abstract/*']`. Default is `['**/interface/*', '**/interfaces/*']`.

### Compilation artifacts

* `*.tvc` - assembler code. You can use it with [tonos-cli](https://github.com/tonlabs/tonos-cli)
* `*.abi.json` - contract ABI. You can use it with [Ever SDK](https://github.com/tonlabs/ever-sdk-js)
  and [tonos-cli](https://github.com/tonlabs/tonos-cli)
* `*Contract.ts` - contract abi and code in one TypeScript constant. You can use it
  with [Ever SDK](https://github.com/tonlabs/ever-sdk-js)
* `*.ts` - Contract class. You can use it with [Vasku](https://github.com/savonarolagirolamo/vasku) on server
  side or web side

Compilation create `index.ts` in build directory. This file using to publish npm package

### Recompilation

Recompile only changed files. If you change one file, then only that file, or those that import it, will be recompiled

## Clean

```shell
npx vasku clean
```

Remove compilation artifacts and cache directory

## SE

Wrapper for [Simple Emulator](https://github.com/tonlabs/everdev/blob/main/docs/command-line-interface/evernode-platform-startup-edition-se.md)

### SE info

```shell
npx vasku se info
```

### SE version

```shell
npx vasku se version
```

### SE start

```shell
npx vasku se start
```

### SE stop

```shell
npx vasku se stop
```

### SE reset

```shell
npx vasku se reset
```


## Network

[Vasku](https://github.com/savonarolagirolamo/vasku) using [DApp GraphQL](https://github.com/tonlabs/evernode-ds) endpoints

### Where to get endpoints

* Copy from [evercloud docs](https://docs.evercloud.dev/products/evercloud/networks-endpoints)
* Use [evercloud.dev](https://www.evercloud.dev)
* Up own server
  * [evernode-ds](https://github.com/tonlabs/evernode-ds)
  * [everscale-dapp-server](https://github.com/itgoldio/everscale-dapp-server)

### Configuration

#### vasku.config.ts

```typescript
const config = {
  networks: {
    'se': {
      endpoints: [process.env.SE_ENDPOINT ?? ''],
    },
    'venom testnet': {
      endpoints: process.env.VENOM_TESTNET_ENDPOINTS ? process.env.VENOM_TESTNET_ENDPOINTS.split(',') : ['']
    }
  }
}
```

#### .env

You can store your endpoints if `.env` file under `.gitignone`

```env
SE_ENDPOINT="http://localhost:8080"
VENOM_TESTNET_ENDPOINTS="https://gql-testnet.venom.foundation"
```

#### SE network

In `vasku.config.ts` you can find `se` network.
This network is used for local testing.
[SE](https://github.com/tonlabs/evernode-se) run and used automatically if you don't set up a network in tests and scripts

## Giver

### View

```shell
npx vasku giver <network> info
```

* `network` - network from `vasku.config.ts` e.g `venom testnet`

### Send

```shell
vasku giver -t <to> -v <value> <network> send
```

* `network` - network from `vasku.config.ts` e.g `venom testnet`
* `-t, --to <to>` - address to send coins e.g. `0:0000000000000000000000000000000000000000000000000000000000000000`
* `-v, --value <value>` - coins value e.g. `0.1`

### Deploy

```shell
vasku giver <network> deploy
```

* `network` - network from `vasku.config.ts` e.g `venom testnet`

### Configuration

#### vasku.config.ts

```typescript
const config = {
  networks: {
    'venom testnet': {
      endpoints: process.env.VENOM_TESTNET_ENDPOINTS ? process.env.VENOM_TESTNET_ENDPOINTS.split(',') : [''],
      giver: 'safeMultiSigWallet',
      keys: {
        name: 'myGiver',
        file: ''
      }
    }
  }
}
```

* `giver` - Optional. Type of giver e.g. `safeMultiSigWallet`. Available
  values: `v2.se`, `v3.se`, `safeMultiSigWallet.se`, `v2`, `v3`, `safeMultiSigWallet`.
  It is recommended to use `safeMultiSigWallet` for all networks except `se`. Default is `v3.se`
* `keys.name` - Optional. Generate `<keys directory>/<name>.json` if file doesn't exist and is used for the
  giver e.g. `myGiver`. Default is `''`
* `keys.file` - Optional. Read key pair from file e.g. `/home/user/keys/giver.json`. Default is `''`

#### SE givers

`v2.se`, `v3.se`, `safeMultiSigWallet.se` don't require `keys`. It
used [hardcoded keys](https://github.com/tonlabs/evernode-se/tree/master/contracts)

#### Keys

* Set `keys.name` if you want to generate and read key pair from `<keys directory>/<name>.json`
* Set `keys.file` if you want to read key pair by absolute path
* Make `keys.name` and `keys.file` empty if you want to generate and read key pair
  from `<keys directory>/<network name>.giver.json`


## Tests

```shell
npx vasku test -n <network> [-c] [patterns...]
```

* `patterns` - Optional. Relative paths from tests directory in [glob](https://github.com/isaacs/node-glob) format
  e.g. `**/*deploy.test.ts`
* `-n, --network [network]` - Optional. Network from `vasku.config.ts` e.g `venom testnet`
* `-c, --no-compile` - Optional. Don't compile

### Out of the box

* Use `se` if no network is specified
* Starts [SE](https://github.com/tonlabs/evernode-se) if network `se` is used
* Compile all contracts if `-c` or `--no-compile` is not set

## Scripts

```shell
npx vasku run -n <network> [-c] <script>
```

* `script` - Optional. Relative paths from scripts directory e.g. `deploy/wallet.ts`
* `-n, --network [network]` - Optional. Network from `vasku.config.ts` e.g `venom testnet`
* `-c, --no-compile` - Optional. Don't compile

### Out of the box

* You can run `npx vasku run deploy` instead `npx vasku run ./deploy.ts`
* Use `se` if no network is specified
* Starts [SE](https://github.com/tonlabs/evernode-se) if network `se` is used
* Compile all contracts if `-c` or `--no-compile` is not set

## Configuration

After project initializing in the directory you can find the file `vasku.config.ts`.
`type Сonfig` in `vasku.config.ts` describes the structure of the config and does not allow to break it.
Most of the parameters in the config are optional and have a default value.
Therefore, there is a minimum and full version of the config

### Minimum

```typescript
import { Config } from 'vasku'
import * as dotenv from 'dotenv'

dotenv.config()

const config: Config = {
  networks: {
    'se': {
      endpoints: [process.env.SE_ENDPOINT ?? ''],
    },
    'venom testnet': {
      endpoints: process.env.VENOM_TESTNET_ENDPOINTS ? process.env.VENOM_TESTNET_ENDPOINTS.split(',') : [''],
      giver: process.env.VENOM_TESTNET_GIVER ?? 'safeMultiSigWallet',
    }
  }
}
export default config
```

### Full

```typescript
import { Config } from 'vasku'
import * as dotenv from 'dotenv'

dotenv.config()

const config: Config = {
  /**
   * Compilation
   * Use `npx everdev sol version` to view tools version
   */
  compile: {
    /**
     * TVM compiler version
     * @see https://github.com/tonlabs/TON-Solidity-Compiler
     * @default 'latest'
     */
    compiler: 'latest',

    /**
     * TVM linker
     * @see https://github.com/tonlabs/TVM-linker
     * @default 'latest'
     */
    linker: 'latest',

    /**
     * List of source files for compilation in contract directory in **glob** format
     * @see https://github.com/isaacs/node-glob
     * @default ['**\/*.tsol', '**\/*.sol']
     */
    include: ['**/*.tsol', '**/*.sol'],

    /**
     * List of source files excluded from compilation in contracts directory in **glob** format
     * @see https://github.com/isaacs/node-glob
     * @default ['**\/interface/*', '**\/interfaces/*']
     */
    exclude: ['**/interface/*', '**/interfaces/*']
  },

  /**
   * Network and givers settings
   */
  networks: {
    'se': {
      /**
       * Query server GraphQL endpoints
       * URL without `/graphql` at end
       *
       * You can use public endpoints
       * @see https://evercloud.dev
       *
       * You can up own endpoint
       * @see https://github.com/tonlabs/evernode-ds
       * @see https://github.com/treeton-org/application-server
       * @default ['http://localhost']
       */
      endpoints: [process.env.SE_ENDPOINT ?? ''],

      /**
       * Giver label
       * SE givers don't need keys
       * Any user can get coins from `v2` and `v3` givers without keys. Don't use them in production
       * @type {'v2.se' | 'v3.se' | 'safeMultiSigWallet.se' | 'v2', 'v3', 'safeMultiSigWallet'}
       * @default 'v3.se'
       */
      giver: 'v3.se'
    },
    'venom testnet': {
      /**
       * Query server GraphQL endpoints
       * URL without `/graphql` at end
       *
       * You can use public endpoints
       * @see https://evercloud.dev
       *
       * You can up own endpoint
       * @see https://github.com/tonlabs/evernode-ds
       * @see https://github.com/treeton-org/application-server
       * @default ['http://localhost']
       */
      endpoints: process.env.VENOM_TESTNET_ENDPOINTS ? process.env.VENOM_TESTNET_ENDPOINTS.split(',') : [''],

      /**
       * Giver label
       * Not SE giver need keys
       */
      giver: process.env.VENOM_TESTNET_GIVER ?? 'safeMultiSigWallet',

      /**
       * Giver keys
       *
       * Options:
       * 1. Set `name` if you want to generate and read keys from `<keys directory>/<name>.json`
       * 2. Set `file` if you want to read keys by absolute path
       * 3. Make `name` and `file` empty if you want to generate and read keys from
       *   `<keys directory>/<network name>.giver.json`
       */
      keys: {
        /**
         * Setup it if you want to use one key pair for different networks
         *
         * Actions:
         * 1. Generate `<keys directory>/<name>.json` if file doesn't exist
         * 2. Read keys from file
         * @example
         *   'giver'
         */
        name: process.env.VENOM_TESTNET_KEYS_NAME,

        /**
         * Read keys by absolute path
         * @example
         *   '/home/user/keys/giver.keys.json'
         */
        file: process.env.VENOM_TESTNET_KEYS_FILE,
      }
    },
    'venom devnet': {
      endpoints: process.env.VENOM_DEVNET_ENDPOINTS ? process.env.VENOM_DEVNET_ENDPOINTS.split(',') : [''],
      giver: process.env.VENOM_DEVNET_GIVER ?? 'safeMultiSigWallet',
      keys: {
        name: process.env.VENOM_DEVNET_KEYS_NAME,
        file: process.env.VENOM_DEVNET_KEYS_FILE
      }
    },
    'ever fld': {
      endpoints: process.env.EVER_FLD_ENDPOINTS ? process.env.EVER_FLD_ENDPOINTS.split(',') : [''],
      giver: process.env.EVER_FLD_GIVER ?? 'safeMultiSigWallet',
      keys: {
        name: process.env.EVER_FLD_KEYS_NAME,
        file: process.env.EVER_FLD_KEYS_FILE
      }
    }
  },

  /**
   * Node Simple Emulator
   * @see https://github.com/tonlabs/everdev/blob/main/docs/command-line-interface/evernode-platform-startup-edition-se.md
   */
  se: {
    /**
     * SE version
     * @default 'latest'
     */
    version: 'latest',

    /**
     * Port on localhost used to expose GraphQL API
     * @default 8080
     */
    port: 8080,

    /**
     * Port on localhost used to expose ArangoDB API
     * @default 'none'
     */
    dbPort: 'none',

    /**
     * Local node instance name. If you not up instance before use `default` or `*`.
     * @default 'default'
     */
    instance: 'default'
  },

  /**
   * Relative paths
   */
  paths: {
    /**
     * Path to contracts directory
     * @default 'contracts'
     */
    contracts: 'contracts',

    /**
     * Path to compilation cache directory
     * @default 'cache'
     */
    cache: 'cache',

    /**
     * Path to compiled contracts directory
     * @default 'build'
     */
    build: 'build',

    /**
     * Path to contract keys directory
     * @default 'keys'
     */
    keys: 'keys',

    /**
     * Path to tests directory
     * @default 'tests'
     */
    tests: 'tests'
  }
}
export default config
```

## Examples

* [vasku-example](https://github.com/savonarolagirolamo/vasku-example) - simple example of using Vasku for contract compilation, testing and deployment published as [npm package](https://www.npmjs.com/package/vasku-example)

### Deploy

```typescript
await (new Counter())
  .deploy(0.1 * B, { number: INITIAL_VALUE })
```

### Run method

```typescript
// Contract initialization and deploy
const counter = new Counter()
await counter.deploy(0.1 * B, { number: INITIAL_VALUE })

// Run
const getCountOut = await counter.run.getCount()
```

### Call method

```typescript
// Contract initialization and deploy
const counter = new Counter()
await counter.deploy(0.1 * B, { number: INITIAL_VALUE })

// Call
await counter.call.selfAdd({ number: 1 })
```

### Call method from wallet

```typescript
// Contract initialization and deploy
const counter = new Counter()
await counter.deploy(B, { number: INITIAL_VALUE })
const wallet = new SafeMultisigWallet()
const keys = await generateRandomKeyPair()
await wallet.deploy(0.2 * B, { owners: [x0(keys.public)], reqConfirms: 1 })

// Call
await wallet.call.sendTransaction({
  dest: await counter.address(),
  value: 0.1 * B,
  bounce: true,
  flags: 0,
  payload: await counter.payload.add({
    number: INITIAL_VALUE
  })
}, keys)
await counter.wait()
```
