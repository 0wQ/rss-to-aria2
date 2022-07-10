import config from '../config.js'

const count = {}

export const add = (name, type, timeCost) => {
  !count[name] && (count[name] = {
    success: 0,
    download: 0,
    avg_ms: 0,
  })
  !count[name][type] && (count[name][type] = 0)
  count[name][type]++

  if (type === 'success' && timeCost !== undefined) {
    count[name].avg_ms = Math.round(
      (count[name].avg_ms * count[name].success + timeCost) / (count[name].success + 1)
    )
  }
  config.debug || console.clear()
  console.table(count)
}

export const get = (name, type) => {
  return count[name][type] || 0
}
