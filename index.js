import config from './config.js'
import agent from './util/getProxyAgent.js'
import * as counter from './util/counter.js'
import { Downloader, downloadedHistory } from './util/Downloader.js'
import RssParser from 'rss-parser'
import writeLog from './util/writeLog.js'

const {
  feedConfigs = [],
  defaultInterval = 60 * 1000,
  debug = false,
} = config

const rssParser = new RssParser({
  timeout: 30 * 1000,
  maxRedirects: 5,
  requestOptions: { agent },
})

for (const feedConfig of feedConfigs) {
  const { name, link, interval = defaultInterval, matcherFunction } = feedConfig
  requestFeed(link, name, matcherFunction)
  setInterval(() => requestFeed(link, name, matcherFunction), interval)
}

async function requestFeed(feedLink, feedName, matcherFunction = () => [false, '']) {
  let feed = {}
  const startTime = performance.now()
  try {
    feed = await rssParser.parseURL(feedLink)
  } catch (e) {
    counter.add(feedName, 'rss_fail')
    writeLog(`${feedName} rss_fail`, e)
    return
  }
  const timeCost = performance.now() - startTime
  counter.add(feedName, 'success', timeCost)

  const downloader = new Downloader(feedName)

  for (const item of feed.items) {
    const title = item.title
    const url = item.enclosure?.url || item.link || ''
    if (!url || downloadedHistory.has(url, title)) continue

    const matchResult = matcherFunction(title)
    const folder = typeof matchResult === 'string' ? matchResult : ''
    if (!matchResult) continue

    downloader.add(url, title, folder)

    if (debug) {
      console.log('matchResult:', matchResult)
      console.log('folder:', folder)
      console.log('item:', item)
    }
  }

  await downloader.download()
}
