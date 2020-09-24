import { Breakout } from './game/breakout'

/**
 * called on github page loaded
 */
function main() {
  const svg = document.querySelector<SVGElement>('.js-calendar-graph-svg')
  if (!svg) return
  svg.setAttribute('height', '220')
  new Breakout(svg) // initialize the game
}

main()
