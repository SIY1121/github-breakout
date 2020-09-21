import { GameObject } from "./gameObject";
import { Rect } from "./shape";
import { createShape } from "./utils";

export class Player implements GameObject, Rect {
  x = 0
  y = 170
  width = 100
  height = 5
  
  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.width
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.height
  }

  svg: SVGElement
  el: SVGElement

  vx = 0

  constructor(svg: SVGElement) {
    this.svg = svg;
    this.x = this.svg.getBoundingClientRect().width / 2 - this.width / 2
    this.el = svg.appendChild(createShape("rect", {
      width: this.right - this.left,
      height: this.bottom - this.top,
      x: this.left,
      y: this.top,
      fill: "red"
    }))
    document.onkeydown = (e) => {
      if(e.key === "ArrowLeft") this.vx = -200
      if(e.key === "ArrowRight") this.vx = 200
    }
    document.onkeyup = (e) => {
      if(e.key === "ArrowLeft") this.vx = 0
      if(e.key === "ArrowRight") this.vx = 0
    }
  }

  update(delta: number): void {
    this.x+=this.vx * delta;
    this.el.setAttribute("x", this.x.toString())
  }

  reset() {
    this.x = this.svg.getBoundingClientRect().width / 2 - this.width / 2
    this.el.setAttribute("x", this.x.toString())
  }
}