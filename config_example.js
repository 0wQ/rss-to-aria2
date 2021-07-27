module.exports = {
  feed_link: 'https://api.lilithraws.cf/v1/rss/latest/file',
  rule_list: [/.*/],
  interval: 20 * 1000,
  first_dl_enable: false,
  aria2_config: {
    host: 'localhost',
    port: 6800,
    secure: false,
    secret: '',
    path: '/jsonrpc'
  },
  aria2_dl_dir: '',
  tg_token: '',
  tg_chat_id: '',
}