import Aria2 from 'aria2'
import config from '../config.js'
import { posix as path } from 'path'

const { aria2Configs = [] } = config

export default async (url, folder) => {
  for (const aria2Config of aria2Configs) {
    const fullDir = path.join(aria2Config.downloadDir || '', folder || '')
    const options = aria2Config.downloadDir ? { dir: fullDir } : {}
    await new Aria2(aria2Config).call('addUri', [url], options)
  }
}
