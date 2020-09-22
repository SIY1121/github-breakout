import { GameObject } from './gameObject'
import { Rect } from './shape'

export class Block implements GameObject, Rect {
  el: SVGElement

  left: number
  right: number
  top: number
  bottom: number

  origianlLife: number
  originalColor: string

  life: number
  constructor(svg: SVGElement, el: SVGElement) {
    this.el = el
    const r = el.getBoundingClientRect()
    const rr = svg.getBoundingClientRect()
    this.right = r.right - rr.left
    this.left = r.left - rr.left
    this.top = r.top - rr.top
    this.bottom = r.bottom - rr.top

    this.origianlLife = Number(el.getAttribute('data-count'))
    this.life = this.origianlLife
    this.originalColor = el.getAttribute('fill') || '#ebedf0'
  }

  update(delta: number) {}

  onCollide() {
    this.life = 0
    this.el.setAttribute('fill', '#ebedf0')
    this.el.setAttribute('data-count', '0')
  }

  reset() {
    this.life = this.origianlLife
    this.el.setAttribute('fill', this.originalColor)
    this.el.setAttribute('data-count', this.origianlLife.toString())
  }
}
