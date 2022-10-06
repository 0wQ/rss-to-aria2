import config from '../config.js'
import sendToAria2 from './sendToAria2.js'
import sendMessage from './sendMessage.js'
import * as counter from './counter.js'
import writeLog from './writeLog.js'
import { appendFileSync } from 'fs'

const {
  isFirstDownload = false,
  exportFile = '',
} = config

export const downloadedHistory = {
  urls: new Set(),
  titles: new Set(),
  has: (url, title) => downloadedHistory.urls.has(url) || downloadedHistory.titles.has(title),
  add: (url, title) => downloadedHistory.urls.add(url) && downloadedHistory.titles.add(title),
}

export class Downloader {
  #feedName = ''
  #needToDownload = new Map()

  constructor(feedName) {
    this.#feedName = feedName
  }

  add(url, title, folder) {
    this.#needToDownload.set(url, [title, folder])
    downloadedHistory.add(url, title)
  }

  #exportToFile() {
    if (this.#needToDownload.size === 0) return
    let text = ''
    for (const [url, [title, folder]] of this.#needToDownload) {
      text += `${title}, ${url}\n`
    }
    appendFileSync(exportFile, text)
  }

  async download() {
    if (this.#needToDownload.size === 0) return

    exportFile && this.#exportToFile()

    if (!isFirstDownload && counter.get(this.#feedName, 'success') <= 1) return

    const msgArray = [
      `<pre>Aria2 - ${this.#feedName}</pre>`,
      '='.repeat(20)
    ]

    for (const [url, [title, folder]] of this.#needToDownload) {
      counter.add(this.#feedName, 'download')
      let logo = `✅`
      try {
        await sendToAria2(url, folder)
      } catch (e) {
        logo = `⚠️`
        counter.add(this.#feedName, 'send_to_aria2_fail')
        writeLog(`${this.#feedName} send_to_aria2_fail ${url}`, e)
      }
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
