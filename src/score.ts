export async function saveScore(score: number) {
  if ((await getHighScore()) > score) return Promise.resolve()
  else
    return new Promise((resolve) =>
      chrome.storage.sync.set({ [location.href]: score }, resolve)
    )
}

export async function getHighScore(): Promise<number> {
  return new Promise((resolve) =>
    chrome.storage.sync.get([location.href], (v) =>
      resolve(parseInt(v[location.href] || 0))
    )
  )
}
