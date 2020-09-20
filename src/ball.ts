import { GameObject } from "./gameObject"
import { createShape } from "./utils"

export class Ball extends GameObject {
  svg: SVGElement
  el: SVGElement
  x = 0
  y = 0
  
  vx = 100
  vy = 0

  constructor(el: SVGElement){
    super()
    this.svg = el
    this.el = el.appendChild(createShape("circle", {
      cx: 0,
      cy: 0,
      r: 10,
      fill: "red"
    }))
    this.init()
  }
  
  update(delta: number): void {
    this.x =  (this.x + this.vx * delta);
    this.el.setAttribute("cx", this.x.toString())
  }
}