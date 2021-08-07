module.exports = {
  feed_link: 'https://api.lilithraws.cf/v1/rss/latest/file', // rss 链接
  rule_list: [/.*/], // 匹配规则列表 [/Baha.*1080P/i, /Remake/]
  interval: 60 * 1000, // 抓取间隔
  first_dl_enable: false,
  aria2_config: {
    host: 'localhost', // Aria2 RPC 主机名
    port: 6800, // 端口号
    secure: false,
    secret: '', // 密钥
    path: '/jsonrpc'
  },
  aria2_dl_dir: '',
  tg_token: '',
  tg_chat_id: '',
}