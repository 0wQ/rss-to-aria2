module.exports = {
  feed_link: 'https://api.lilithraws.cf/v1/rss/latest/file',
  rule_list: [/.*/],
  interval: 20 * 1000,
  first_dl_enable: false,
  aria2: {
    host: 'localhost',
    port: 6800,
    secure: false,
    secret: '',
    path: '/jsonrpc'
  }
}