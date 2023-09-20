import { type PathsConfig } from '../config/types'
import path from 'path'
import * as fse from 'fs-extra'
import { blue, green } from 'colors'

export function clean (paths: PathsConfig, root: string = process.cwd()): void {
  remove(root, paths.build)
  remove(root, paths.cache)
}

function remove (root: string, relativePath: string): void {
  const absolutePath: string = path.resolve(root, relativePath)
  fse.removeSync(absolutePath)
  console.log(`${green('✔')} ${blue(relativePath)} removed`)
}
