// @ts-expect-error Cannot find module or its corresponding type declarations.
import { VendeeConfig } from 'vendee'

const config: VendeeConfig = {
    /**
     * Node Simple Emulator settings
     * @see https://github.com/tonlabs/everdev/blob/main/docs/command-line-interface/evernode-platform-startup-edition-se.md
     */
    se: {
        /**
         * SE version
         * @type string | 'latest'
         * @default 'latest'
         */
        version: 'latest',

        /**
         * Custom SE docker image name
         * @default ''
         */
        // image: '',

        /**
         * Custom SE docker container name
         * @default ''
         */
        // container: '',

        /**
         * Port on localhost used to expose GraphQL API
         * @default 80
         */
        // port: 80,

        /**
         * Port on localhost used to expose ArangoDB API
         * @type number | 'none'
         * @default 'none'
         */
        // dbPort: 'none',

        /**
         * Local node instance name. If you not up instance before use `default` or `*`.
         * @type string | 'default' | '*'
         * @default 'default'
         */
        // instance: 'default'
    }
}
export default config
