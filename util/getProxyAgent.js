import HttpsProxyAgent from 'https-proxy-agent'
import config from '../config.js'

const proxy = config.proxy === undefined
  ? undefined
  : config.proxy
  || process.env.HTTPS_PROXY
  || process.env.https_proxy
  || process.env.HTTP_PROXY
  || process.env.http_proxy

const agent = proxy ? new HttpsProxyAgent(proxy) : undefined

export default agent
