// @ts-ignore
import { Config } from 'vendee'

const config: Config = {
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
