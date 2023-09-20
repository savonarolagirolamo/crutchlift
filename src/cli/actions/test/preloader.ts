import { clearInterval } from 'timers'
import { green } from 'colors'

const SYMBOLS = '⢿⣻⣽⣾⣷⣯⣟⡿'
const DELAY = 100

let text: string
let timer: NodeJS.Timer

export function startPreloader (message: string): void {
  clear()
  text = message
  let counter = 0
  timer = setInterval((): void => {
    print(SYMBOLS.charAt(counter++))
    counter &= SYMBOLS.length - 1
  }, DELAY)
}

export function stopPreloader (): void {
  clear()
  print(green('✔'))
  console.log()
}

function clear (): void {
  if (timer !== undefined)
    clearInterval(timer)
}

function print (symbol: string): void {
  process.stdout.write(`\r${text}... ${symbol}`)
}
