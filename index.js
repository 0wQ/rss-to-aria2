const Aria2 = require('aria2')
const Parser = require('rss-parser')
const config = require('./config')

const {
  feed_link,
  rule_list = [/.*/],
  interval = 60 * 1000,
  first_dl_enable = false,
  aria2: aria2_config
} = config

const downloaded_list = []
let run_count = 0
let _lastBuildDate


const sendToAria2 = async (uri) => {
  const [guid] = await new Aria2(aria2_config).call('addUri', [uri], {})
  console.log('guid:', guid, 'uri:', uri)
}
const checkTitleMatch = (title) => {
  for (const rule of rule_list) {
    const out = rule.test(title)
    if (out) return out
  }
  return false
}


const run = async () => {
  run_count++
  console.log('####################', run_count, '####################')

  const feed = await new Parser().parseURL(feed_link)
  const { title, items } = feed
  const lastBuildDate = feed.lastBuildDate || feed.pubDate || feed.items[0].pubDate || ''

  console.log(title)

  if (lastBuildDate === '') {
    console.log('未检测到时间, 跳过时间检查')
  } else {
    if (lastBuildDate === _lastBuildDate) {
      console.log('未更新:', _lastBuildDate, '==', lastBuildDate)
      return
    }
    _lastBuildDate = lastBuildDate
    console.log('已更新:', _lastBuildDate, '->', lastBuildDate)
  }

  for (const item of items) {
    const { title } = item
    const link = (item.enclosure && item.enclosure.url) || item.link || ''

    if (link === '') {
      console.log('未检测到下载链接, 跳过')
      return
    }
    if (!first_dl_enable && run_count === 1) {
      downloaded_list.push(link)
    } else {
      !downloaded_list.includes(link) && checkTitleMatch(title) && downloaded_list.push(link) && sendToAria2(link)
    }
  }
}

(async () => {
  if (!feed_link || !aria2_config) {
    console.log('配置缺失')
    return
  }
  await run()
  setInterval(async () => await run(), interval)
})()