export type GiverSendOptions = {
  to?: string
  value?: string
  bounce?: string
}

export function giverInfo (): void {
  console.log('TODO giver info')
}

export function giverSend (options: GiverSendOptions): void {
  console.log('TODO giver send')
  console.log(options)
}

export function giverDeploy (): void {
  console.log('TODO giver deploy')
}
