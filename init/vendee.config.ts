// @ts-ignore
import { Config } from 'vendee'
import * as dotenv from 'dotenv'

dotenv.config()

const config: Config = {
  /**
   * Query server and giver
   * @see https://github.com/tonlabs/ton-q-server
   */
  networks: {
    se: {
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
      endpoints: ['http://localhost'],

      /**
       * Giver
       * @default 'se'
       */
      giver: 'se'
    },
    fld: {
      endpoints: ['https://n01.fld.dapp.tonlabs.io'],
      giver: 'GiverV3'
    },
    main: {
      endpoints: [process.env.MAIN_ENDPOINT ?? ''],
      giver: 'GiverV3'
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
     * Path to tests directory
     * @default 'tests'
     */
    tests: 'tests'
  }
}
export default config
