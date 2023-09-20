import { type VascooConfig } from '../../config/types'
import { createGlobal } from '../../global/createGlobal'
import { printContract, printEmptyLine, printError, printMessage } from './printContract'
import { AccountType, Contract } from '../../../contract'
import { type SendOptions, validate } from './validate'
import { B } from '../../../utils/suffixes'

const DEPLOY_VALUE = 0.1

export async function giverInfo (config: VascooConfig, network: string): Promise<void> {
  const global = await createGlobal(config, network)
  try {
    await printContract(global.giver.contract)
  } catch (e: any) {
    await printError(e)
  }
  global.client.close()
}

export async function giverSend (config: VascooConfig, network: string, options: SendOptions): Promise<void> {
  const sendParameters = validate(options)
  const global = await createGlobal(config, network)
  const giver = global.giver
  const target = new Contract({ address: options.to }, {
    client: global.client
  })

  ////////////////////////
  // Check giver active //
  ////////////////////////
  const giverAccountType = await giver.contract.accountType()
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
    await target.wait()
    await printContract(giver.contract)
    await printEmptyLine()
    await printContract(target)
  } catch (e: any) {
    await printError(e)
  }
  global.client.close()
}

export async function giverDeploy (config: VascooConfig, network: string): Promise<void> {
  const global = await createGlobal(config, network)
  const giver = global.giver

  ////////////////////////
  // Check giver active //
  ////////////////////////
  const giverAccountType = await giver.contract.accountType()
  if (giverAccountType === AccountType.active) {
    global.client.close()
    await printError('Giver is already deployed')
    await printContract(giver.contract)
    return
  }

  /////////////////////////
  // Check giver balance //
  /////////////////////////
  const balance = await giver.contract.balance()
  if (balance <= BigInt(DEPLOY_VALUE * parseFloat(B.toString()))) {
    global.client.close()
    await printError(`Not enough balance to deploy. ${DEPLOY_VALUE} coins is required`)
    await printContract(giver.contract)
    return
  }

  /////////////
  // Execute //
  /////////////
  try {
    await printContract(giver.contract)
    await printMessage('deploy')
    await giver.deploy(DEPLOY_VALUE)
    await printContract(giver.contract)
  } catch (e: any) {
    await printError(e)
  }
  global.client.close()
}
