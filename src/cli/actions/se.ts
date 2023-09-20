import { consoleTerminal, runCommand } from 'everdev'
import { type SEConfig } from '../config'

async function run (command: string, args: any = {}): Promise<void> {
  await runCommand(consoleTerminal, `se ${command}`, args)
}

export async function seInfo (): Promise<void> {
  await run('info')
}

export async function seVersion (): Promise<void> {
  await run('version')
}

export async function seStart (config: SEConfig): Promise<void> {
  await run('set', config)
  await run('start')
}

export async function seStop (): Promise<void> {
  await run('stop')
}

export async function seReset (): Promise<void> {
  await run('reset')
}
