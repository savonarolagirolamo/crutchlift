import fs from 'fs-extra'
import path from 'path'

export function backup (target: string = process.cwd(), subDirectory: string): void {
  const temporary: string = path.resolve(target, 'tmp')
  const backup: string = path.resolve(target, subDirectory)
  fs.readdirSync(target).forEach((value: string): void => {
    fs.moveSync(path.resolve(target, value), path.resolve(temporary, value), { overwrite: true })
  })
  fs.moveSync(temporary, backup, { overwrite: true })
}
