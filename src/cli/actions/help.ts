import { program } from 'commander'

export function help (): void {
  process.argv.push('-h')
  program.parse()
}
