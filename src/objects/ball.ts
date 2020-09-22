import { GameObject } from './gameObject'
import { Direction } from '../utils/intersect'
import { Circle } from './shape'
import { createShape } from '../utils/domUtils'

const speed = 140

/**
 * ボール
 */
export class Ball implements GameObject, Circle {
  svgElement: SVGElement
  ballElement: SVGElement

  x = 0
  y = 185
  r = 5

  vx = 0
  vy = 0

  constructor(el: SVGElement) {
    this.svgElement = el
    this.x = this.svgElement.getBoundingClientRect().width / 2
    this.ballElement = el.appendChild(
      createShape('circle', {
        cx: this.x,
        cy: this.y,
        r: this.r,
        fill: 'red',
      })
    )
    this.vx = speed
    this.vy = -speed
  }

  update(delta: number): void {
    //// 領域外に出ないように反射させる
    if (
      this.x > this.svgElement.getBoundingClientRect().width - this.r ||
      this.x < this.r
    ) {
      this.vx *= -1
      this.x += this.vx / Math.abs(this.vx)
    }
    if (this.y < this.r) {
      this.vy *= -1
      this.y += this.vy / Math.abs(this.vy)
    }
    ////

    // 現在の速度から次の位置を設定
    this.x = this.x + this.vx * delta
    this.y = this.y + this.vy * delta
    this.ballElement.setAttribute('cx', this.x.toString())
    this.ballElement.setAttribute('cy', this.y.toString())
  }

  /**
   * 物体にぶつかったときに呼び出される
   * @param d 反射する方向
   */
  onCollide(d: Direction) {
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

  reset() {
    this.x = this.svgElement.getBoundingClientRect().width / 2
    this.y = 185
    this.vx = speed
    this.vy = -speed
    this.ballElement.setAttribute('cx', this.x.toString())
    this.ballElement.setAttribute('cy', this.y.toString())
  }
}
