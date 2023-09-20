import { type Giver } from './giver'

export type VendeeConfig = {
  networks: Record<string, NetworkConfig>
  se: SEConfig
  paths: PathsConfig
}

export type NetworkConfig = {
  endpoints?: string[]
  giver?: Giver
}

export type SEConfig = {
  version: string | 'latest'
  image?: string
  container?: string
  port?: number
  dbPort?: number | 'none'
  instance: string | 'default' | '*'
}

export type PathsConfig = {
  build: string
  cache: string
  contracts: string
  keys: string
  tests: string
}

export type Config = Partial<VendeeConfig>
