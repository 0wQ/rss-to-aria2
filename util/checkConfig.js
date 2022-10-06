const checkConfig = (config) => {
  const {
    feedConfigs = [],
    aria2Configs = [],
  } = config

  if (feedConfigs.length === 0) return false
  // if (aria2Configs.length === 0) return false

  const feedNames = new Set()
  for (const feedConfig of feedConfigs) {
    if (!feedConfig.link || !feedConfig.name) return false
    if (feedNames.has(feedConfig.name)) return false
    feedNames.add(feedConfig.name)
  }

  for (const aria2Config of aria2Configs) {
    if (!aria2Config.host || !aria2Config.port) return false
  }

  return true
}

export default (config) => {
  if (!checkConfig(config)) {
    console.error('Config is not valid')
    process.exit(1)
  }
}
