import sendToAria2 from './sendToAria2.js'
import sendMessage from './sendMessage.js'
import * as counter from './counter.js'
import writeLog from './writeLog.js'

export const downloadedHistory = new Set()

export class Downloader {
  #feedName = ''
  #needToDownload = new Map()

  constructor(feedName) {
    this.#feedName = feedName
  }

  add(url, title, folder) {
    this.#needToDownload.set(url, [title, folder])
  }

  async download() {
    if (this.#needToDownload.size === 0) return

    const msgArray = [
      `<pre>Aria2 - ${this.#feedName}</pre>`,
      '='.repeat(20)
    ]

    for (const [url, [title, folder]] of this.#needToDownload) {
      let logo = `✅`
      try {
        await sendToAria2(url, folder)
      } catch (e) {
        logo = `⚠️`
        counter.add(this.#feedName, 'send_to_aria2_fail')
        writeLog(`${this.#feedName} send_to_aria2_fail ${url}`, e)
      }
      logo === `✅` && counter.add(this.#feedName, 'download')
      msgArray.push(`${logo} <a href="${url}">${title}</a>`)
    }

    try {
      await sendMessage(msgArray.join('\n'))
    } catch (e) {
      counter.add(this.#feedName, 'send_message_fail')
      writeLog(`${this.#feedName} send_message_fail`, e)
    }
  }
}
