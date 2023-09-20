import { type VendeeConfig } from '../../config/types'
import { createGlobal } from '../../global/createGlobal'
import { printContract, printEmptyLine, printError, printMessage } from './printContract'
import { AccountType, Contract } from '../../../contract'
import { type SendOptions, validate } from './validate'

export async function giverInfo (config: VendeeConfig, network: string): Promise<void> {
  const global = await createGlobal(config, network)
  try {
    await printContract(global.giver.contract)
  } catch (e: any) {
    await printError(e)
  }
  global.client.close()
}

export async function giverSend (config: VendeeConfig, network: string, options: SendOptions): Promise<void> {
  const sendParameters = validate(options)
  const global = await createGlobal(config, network)
  const giver = global.giver
  const target = new Contract({ address: options.to }, {
    client: global.client
  })

  ////////////////////////
  // Check giver active //
  ////////////////////////
  const giverAccountType = (await giver.contract.accountType()).toString()
  if (giverAccountType !== AccountType.active) {
    global.client.close()
    await printError('Giver is not active')
    await printContract(giver.contract)
    return
  }

  /////////////////////////
  // Check giver balance //
  /////////////////////////
  const balance = await giver.contract.balance()
  if (balance <= sendParameters.value) {
    global.client.close()
    await printError('Not enough balance on giver')
    await printContract(giver.contract)
    return
  }

  /////////////
  // Execute //
  /////////////
  try {
    await printContract(giver.contract)
    await printEmptyLine()
    await printContract(target)
    await printMessage('send')
    await giver.send(sendParameters)
    await printContract(giver.contract)
    await printEmptyLine()
    await printContract(target)
  } catch (e: any) {
    await printError(e)
  }
  global.client.close()
}

export async function giverDeploy (config: VendeeConfig, network: string): Promise<void> {
  console.log('TODO giver deploy')
  console.log(config)
  console.log(network)
}
