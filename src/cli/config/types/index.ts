import { type GiverLabels, type SEGiverLabel } from './giverLabels'

export type VascooConfig = {
  compile: CompileConfig
  networks: Record<string, NetworkConfig>
  se: SEConfig
  paths: PathsConfig
  timeout: number
}

export type CompileConfig = {
  compiler: string | 'latest'
  linker: string | 'latest'
  include: string[]
  exclude: string[]
}

export type NetworkConfig = {
  endpoints: string[]
} & ({
  giver: SEGiverLabel
  keys: undefined
} | {
  giver: GiverLabels
  keys?: KeysConfig
})

export type KeysConfig = {
  name?: string
  file?: string
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
  scripts: string
}

export type Config = {
  compile?: Partial<CompileConfig>
  networks?: Record<string, NetworkConfig>
  se?: Partial<SEConfig>
  paths?: Partial<PathsConfig>
  timeout?: number
}
