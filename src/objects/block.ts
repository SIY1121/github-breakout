import { GameObject } from './gameObject'
import { Rect } from './shape'

export class Block implements GameObject, Rect {
  blockElement: SVGElement

  left: number
  right: number
  top: number
  bottom: number

  origianlLife: number
  originalColor: string

  life: number

  constructor(svgElement: SVGElement, el: SVGElement) {
    this.blockElement = el

    // SVG内での座標を計算
    const r = el.getBoundingClientRect()
    const rr = svgElement.getBoundingClientRect()
    this.right = r.right - rr.left
    this.left = r.left - rr.left
    this.top = r.top - rr.top
    this.bottom = r.bottom - rr.top

    this.origianlLife = Number(el.getAttribute('data-count'))
    this.life = this.origianlLife
    this.originalColor = el.getAttribute('fill') || '#ebedf0'
  }

  update(delta: number) {}

  /**
   * ボールと衝突した際に呼ばれる
   */
  onCollide() {
    this.life = 0 // -1とかにすればcontribution数だけライフを持ったブロックになる
    this.blockElement.setAttribute('fill', '#ebedf0')
    this.blockElement.setAttribute('data-count', '0')
  }

  reset() {
    this.life = this.origianlLife
    this.blockElement.setAttribute('fill', this.originalColor)
    this.blockElement.setAttribute('data-count', this.origianlLife.toString())
  }
}
