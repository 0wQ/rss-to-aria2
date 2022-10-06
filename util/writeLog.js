import config from '../config.js'
import { appendFileSync } from 'fs'

const { log, debug = false } = config

export default async (msg, e) => {
  log && appendFileSync(log, `${new Date().toISOString()} ${msg} ${e.message}`.replace(/\n/g, ' ').trim() + '\n')
  if (debug) {
    console.error(`\x1B[31m${msg}\x1B[0m`)
    console.error(e)
  }
}
