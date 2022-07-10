import checkConfig from './util/checkConfig.js'

// const ruleList = [
//   /(FAMILY|Love.Live|Kaguya|Tarumono)/i,
//   /(Rendering|aharen|式守|Shikimori)/i,
//   /(Jitsuryoku|至上|OVERLORD|Made.in.Abyss)/i,
// ]
// matcherFunction: (title) => ruleList.some((regex) => regex.test(title))

const ruleMap = new Map([
  [/FAMILY/i, '间谍过家家'],
  [/Love.Live/i, 'Love Live! Superstar!! 第二季'],
  [/Kaguya/i, '辉夜大小姐想让我告白'],
  [/Nariagari/i, '盾之勇者成名录'],
  [/Rendering/i, '夏日重现'],
  [/Shikimori/i, '式守同学不只可爱而已'],
  [/Jitsuryoku/i, '欢迎来到实力至上主义教室 2nd Season'],
  [/OVERLORD/i, 'OVERLORD IV'],
  [/Made.in.Abyss/i, '来自深渊 烈日的黄金乡'],
])

const myMatcherFunction = (title) => {
  for (const [regex, folder] of ruleMap) {
    if (regex.test(title)) return folder
  }
}

const config = {
  feedConfigs: [
    {
      name: 'Lilith Raws', // 不可重复
      link: 'https://api.lilithraws.org/v1/rss/latest/file',
      interval: 30 * 1000,
      matcherFunction: (title) => myMatcherFunction(title), // 需返回 'folder name' || true || false
    },
    {
      name: 'Bangumi.moe',
      link: 'https://bangumi.moe/rss/latest',
      interval: 30 * 1000,
      matcherFunction: (title) => /(NC-Raws|Lilith-Raws).*Baha/i.test(title) && myMatcherFunction(title),
    },
    {
      name: 'Mikan Project',
      link: 'https://mikanani.me/RSS/MyBangumi?token=xxx',
      interval: 60 * 1000,
      matcherFunction: (title) => {
        const regex1 = /(动漫国|桜都|千夏|幻樱|喵萌|诸神|极影).*1080.*(简|CHS|GB)/i
        const regex2 = /(外挂)/i
        if (regex1.test(title) && !regex2.test(title)) {
          return myMatcherFunction(title) || true
        }
      },
    },
  ],
  aria2Configs: [
    {
      host: 'localhost',
      port: 6800,
      secure: false,
      secret: '',
      path: '/jsonrpc',
      downloadDir: '', // 只有填写下载路径时, matcherFunction 返回的 folder name 才有效
    },
    {
      host: 'localhost',
      port: 16800,
    },
  ],
  // defaultInterval: 60 * 1000,
  // isFirstDownload: false,
  // telegramToken: '',
  // telegramChatID: '',
  // proxy: 'socks5://localhost:7890',
  // log: './error.log',
  // debug: false,
}

checkConfig(config)
export default config
