import { Config } from 'vendee'
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
     * @default 'latest'
     */
    include: ['**'],

    /**
     * List of source files excluded from compilation in contracts directory in **glob** format
     * @see https://github.com/isaacs/node-glob
     * @default ['']
     */
    exclude: []
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
      giver: process.env.VENOM_TESTNET_GIVER ?? 'v3',

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
    'venom': {
      endpoints: process.env.VENOM_ENDPOINTS ? process.env.VENOM_ENDPOINTS.split(',') : [''],
      giver: process.env.VENOM_GIVER ?? 'v3',
      keys: {
        name: process.env.VENOM_KEYS_NAME,
        file: process.env.VENOM_KEYS_FILE
      }
    },
    'ever fld': {
      endpoints: process.env.EVER_FLD_ENDPOINTS ? process.env.EVER_FLD_ENDPOINTS.split(',') : [''],
      giver: process.env.EVER_FLD_GIVER ?? 'v3',
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
     * Custom SE docker image name
     * @default ''
     */
    image: undefined,

    /**
     * Custom SE docker container name
     * @default ''
     */
    container: undefined,

    /**
     * Port on localhost used to expose GraphQL API
     * @default 80
     */
    port: 80,

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
