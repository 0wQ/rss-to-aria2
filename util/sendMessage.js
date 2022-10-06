import fetch from 'node-fetch'
import config from '../config.js'
import agent from './getProxyAgent.js'

const { telegramToken, telegramChatID } = config

export default async (msg) => {
  if (!telegramToken && !telegramChatID) return

  const urlSearchParams = new URLSearchParams({
    chat_id: telegramChatID,
    text: msg,
    parse_mode: 'HTML',
    disable_web_page_preview: 'true',
  })
  const url = `https://api.telegram.org/bot${telegramToken}/sendMessage?${urlSearchParams}`
  await fetch(url, { agent })
}
