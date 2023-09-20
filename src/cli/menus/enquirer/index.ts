// @ts-expect-error Module 'enquirer' has no exported member ('Select' | 'Form')
import { Select, Form } from 'enquirer'
import {gray, red } from 'colors'
export { Select }
export { Form }

export const HELP: string = gray('?')
export const BACK: string = red('←')
export const QUIT: string = red('✖')
