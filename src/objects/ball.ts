import { GameObject } from './gameObject'
import { Direction } from '../intersect'
import { Circle } from './shape'
import { createShape } from '../domUtils'

export class Ball implements GameObject, Circle {
  svg: SVGElement
  el: SVGElement
  x = 0
  y = 185

  vx = 0
  vy = 0

  r = 5

  constructor(el: SVGElement) {
    this.svg = el
    this.x = this.svg.getBoundingClientRect().width / 2
    this.el = el.appendChild(
      createShape('circle', {
        cx: this.x,
        cy: this.y,
        r: this.r,
        fill: 'red',
      })
    )
    this.vx = 140
    this.vy = -140
  }

  update(delta: number): void {
    if (
      this.x > this.svg.getBoundingClientRect().width - this.r ||
      this.x < this.r
    ) {
      this.vx *= -1
      this.x += this.vx / Math.abs(this.vx)
    }
    if (this.y < this.r) {
      this.vy *= -1
      this.y += this.vy / Math.abs(this.vy)
    }
    this.x = this.x + this.vx * delta
    this.y = this.y + this.vy * delta
    this.el.setAttribute('cx', this.x.toString())
    this.el.setAttribute('cy', this.y.toString())
  }

  reset() {
    this.x = this.svg.getBoundingClientRect().width / 2
    this.y = 185
    this.vx = 140
    this.vy = -140
    this.el.setAttribute('cx', this.x.toString())
    this.el.setAttribute('cy', this.y.toString())
  }

  onCollide(d: Direction, vx = 0) {
    if (d === Direction.X) {
      this.vx *= -1
      this.x += this.vx / Math.abs(this.vx)
    } else if (d === Direction.Y) {
      this.vy *= -1
      this.y += this.vy / Math.abs(this.vy)
    } else if (d === Direction.XY) {
      this.vx *= -1
      this.vy *= -1
    }
  }
}
