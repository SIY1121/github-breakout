/**
 * save high score
 * @param score
 */
export async function saveScore(score: number) {
  if ((await getHighScore()) > score) return Promise.resolve()
  else
    return new Promise((resolve) =>
      chrome.storage.sync.set({ [`score:${location.href}`]: score }, resolve)
    )
}

/**
 * return the high score on the current url
 */
export async function getHighScore(): Promise<number> {
  return new Promise((resolve) =>
    chrome.storage.sync.get([`score:${location.href}`], (v) =>
      resolve(parseInt(v[`score:${location.href}`] || 0))
    )
  )
}
