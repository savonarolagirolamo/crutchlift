import { type Giver } from './giver'

export interface VendeeConfig {
  networks: Record<string, NetworkConfig>
  se: SEConfig
  paths: PathsConfig
}

export interface NetworkConfig {
  endpoints?: string[]
  giver?: Giver
}

export interface SEConfig {
  version: string | 'latest'
  image?: string
  container?: string
  port?: number
  dbPort?: number | 'none'
  instance: string | 'default' | '*'
}

export interface PathsConfig {
  build: string
  cache: string
  contracts: string
  keys: string
  tests: string
}

export interface Config extends Partial<VendeeConfig> {}
