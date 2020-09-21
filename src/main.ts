import { Ball } from "./ball";
import { Breakout } from "./breakout";

function main() {
  const svg = document.querySelector<SVGElement>(".js-calendar-graph-svg");
  const g = svg?.querySelector("g");
  if (!svg || !g) return;
  svg.setAttribute("height", "200")

  new Breakout(svg)
}
console.log("hi")
setTimeout(() => {
  main()
},100)

