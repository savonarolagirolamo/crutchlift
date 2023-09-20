import path from 'path'
import fs from 'fs-extra'
import { execSync } from 'child_process'

const PATH = '../../../../init'
const COMMAND = 'yarn install'

export function init (target: string = process.cwd()): void {
  copyInitFiles(target)
  installPackages()
}

function copyInitFiles (target: string): void {
  const source = path.resolve(__dirname, PATH)
  fs.readdirSync(source).forEach((value: string): void => {
    fs.copySync(path.resolve(source, value), path.resolve(target, value), { overwrite: true })
  })
}

function installPackages (): void {
  try {
    execSync(COMMAND, { stdio: 'inherit' })
  } catch (error: any) {
    console.error(error)
  }
}
