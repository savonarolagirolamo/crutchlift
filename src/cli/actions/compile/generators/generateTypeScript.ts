import path from 'path'
import fs from 'fs-extra'
import { type PathsConfig } from '../../../config/types'
import { ABI_JSON, TS } from '../artifacts'
import { type AbiContract } from '@eversdk/core'
import { generateType } from './generateType'

/**
 * Generate TypeScript contract class
 * @param config
 * @param directory
 *   'x'
 * @param nameWithExtension
 *   'C.tsol'
 */
export function generateTypeScript (config: PathsConfig, directory: string, nameWithExtension: string): void {
  const name = path.parse(nameWithExtension).name
  const absoluteDirectory = path.resolve(process.cwd(), config.build, directory)
  const abiFile = path.resolve(absoluteDirectory, `${name}${ABI_JSON}`)
  const file = path.resolve(absoluteDirectory, `${name}${TS}`)
  const abi: AbiContract = JSON.parse(fs.readFileSync(abiFile, { encoding: 'utf8' }))
  const imports = getImports(name)
  const types = getTypes(abi)
  const mainClass = getContractClass(name, abi)
  const callClass = getCallClass(name, abi)
  const runClass = getRunClass(name, abi)
  const payloadClass = getPayloadClass(name, abi)
  const code = `${imports}
${types}
${mainClass}
${callClass}
${runClass}
${payloadClass}
`
  fs.writeFileSync(file, code)
}

function getImports (name: string): string {
  return `import { type CompiledContractConfig, Contract, type ContractOptions, type ResultOfCall } from 'vendee'
import { type KeyPair, type ResultOfProcessMessage } from '@eversdk/core'
import ${name}Content from './${name}Content'`
}

function getTypes (abi: AbiContract): string {
  return (abi.functions != null)
    ? abi.functions?.reduce((result, value): string => {
      if (value.inputs.length > 0)
        result += `type ${value.name}In = ${generateType(value.inputs, true)}\n`
      if (value.outputs.length > 0)
        result += `type ${value.name}Out = ${generateType(value.outputs, false)}\n`
      return result
    }, '')
    : ''
}

function getContractClass (name: string, abi: AbiContract): string {
  const deploy = constructorHasInputs(abi)
    ? `async deploy (
    value: string | number | bigint,
    input: constructorIn,
    useGiver: boolean = true,
    timeout: number = 60000
  ): Promise<ResultOfProcessMessage> {
    return await this._deploy(value, input, useGiver, timeout)
  }`
    : `async deploy (
    value: string | number | bigint,
    useGiver: boolean = true,
    timeout: number = 60000
  ): Promise<ResultOfProcessMessage> {
    return await this._deploy(value, {}, useGiver, timeout)
  }`
  return `export class ${name} extends Contract {
  private readonly _call: ${name}Calls
  private readonly _run: ${name}Runs
  private readonly _payload: ${name}Payload
  constructor (config: CompiledContractConfig = {}, options: ContractOptions = {}) {
    if (config.address === undefined)
      super({
        abi: ${name}Content.abi,
        initial: config.initial ?? {},
        keys: config.keys,
        tvc: ${name}Content.tvc
      }, options)
    else
      super({
        address: config.address,
        abi: ${name}Content.abi
      }, options)
    this._call = new ${name}Calls(this)
    this._run = new ${name}Runs(this)
    this._payload = new ${name}Payload(this)
  }
  ${deploy}
  get call (): ${name}Calls {
    return this._call
  }
  get run (): ${name}Runs {
    return this._run
  }
  get payload (): ${name}Payload {
    return this._payload
  }
}`
}

function constructorHasInputs (abi: AbiContract): boolean {
  if (abi.functions === undefined)
    return false

  for (let i = 0; abi.functions.length > 0; ++i)
    if (abi.functions[i].name === 'constructor')
      return abi.functions[i].inputs.length > 0
  return false
}

function getCallClass (name: string, abi: AbiContract): string {
  return `class ${name}Calls {
  constructor (private readonly contract: Contract) {}
${getCalls(abi)}}`
}

function getCalls (abi: AbiContract): string {
  return (abi.functions != null)
    ? abi.functions?.reduce((result, value): string => {
      if (value.name === 'constructor')
        return result

      const inputIn = value.inputs.length > 0 ? `input: ${value.name}In, ` : ''
      const inputParam = value.inputs.length > 0 ? 'input' : '{}'
      const promiseType = value.outputs.length > 0 ? `ResultOfCall & { out: ${value.name}Out }` : 'ResultOfCall'
      return result + `  async ${value.name} (${inputIn}keys?: KeyPair): Promise<${promiseType}> {
    return await this.contract.callMethod('${value.name}', ${inputParam}, keys)
  }
`
    }, '')
    : ''
}

function getRunClass (name: string, abi: AbiContract): string {
  return `class ${name}Runs {
  constructor (private readonly contract: Contract) {}
${getRuns(abi)}}`
}

function getRuns (abi: AbiContract): string {
  return (abi.functions != null)
    ? abi.functions?.reduce((result, value): string => {
      if (value.name === 'constructor')
        return result

      if (value.outputs.length === 0)
        return result

      const inputIn = value.inputs.length > 0 ? `input: ${value.name}In` : ''
      const inputParam = value.inputs.length > 0 ? ', input' : ''
      return result + `  async ${value.name} (${inputIn}): Promise<${value.name}Out> {
    return (await this.contract.runMethod('${value.name}'${inputParam})).value
  }
`
    }, '')
    : ''
}

function getPayloadClass (name: string, abi: AbiContract): string {
  return `class ${name}Payload {
  constructor (private readonly contract: Contract) {}
${getPayloads(abi)}}`
}

function getPayloads (abi: AbiContract): string {
  return (abi.functions != null)
    ? abi.functions?.reduce((result, value): string => {
      if (value.name === 'constructor')
        return result

      const inputIn = value.inputs.length > 0 ? `input: ${value.name}In` : ''
      const inputParam = value.inputs.length > 0 ? ', input' : ''
      return result + `  async ${value.name} (${inputIn}): Promise<string> {
    return await this.contract.createPayload('${value.name}'${inputParam})
  }
`
    }, '')
    : ''
}
