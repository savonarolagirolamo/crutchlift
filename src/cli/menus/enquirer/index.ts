// @ts-expect-error Module 'enquirer' has no exported member ('Select' | 'Form')
import { Select, Form } from 'enquirer'
import { gray, red } from 'colors'
export { Select }
export { Form }

export const HELP = gray('?')
export const BACK = red('←')
export const QUIT = red('✖')
export const ELLIPSIS = ` ${gray('…')}`
