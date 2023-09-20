export interface VendeeConfig {
  se: SEConfig
  paths: PathsConfig
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
  contracts: string
  cache: string
  build: string
  tests: string
}

export interface Config extends Partial<VendeeConfig> {}
