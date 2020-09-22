import { Breakout } from './game/breakout'

/**
 * GitHubのページの読み込み時に呼ばれる
 */
function main() {
  const svg = document.querySelector<SVGElement>('.js-calendar-graph-svg')
  if (!svg) return
  svg.setAttribute('height', '220')
  new Breakout(svg) // ゲーム初期化
}

main()
