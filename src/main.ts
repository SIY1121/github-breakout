import { Ball } from "./ball";

function main() {
  const svg = document.querySelector<SVGElement>(".js-calendar-graph-svg");
  const g = svg?.querySelector("g");
  if (!svg || !g) return;
  svg.setAttribute("height", "200")

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
  rect.setAttribute("width", "200")
  rect.setAttribute("height", "20")
  rect.setAttribute("x", "100")
  rect.setAttribute("y", "150")
  rect.setAttribute("fill", "#ff0000")
  svg.appendChild(rect)
  let x = 0;
  document.onkeydown = (e) => {
    switch(e.code) {
      case "ArrowLeft":
        x-=10;
        break;
    case "ArrowRight":
      x+=10;
        break;
    }
    rect.setAttribute("x", x.toString())
  }
  new Ball(svg)
}
console.log("hi")
setTimeout(() => {
  main()
},100)

