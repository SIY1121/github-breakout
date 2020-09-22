import { Circle, Rect } from '../objects/shape'

export enum Direction {
  X,
  Y,
  XY,
  None,
}

/**
 * 円と長方形の当たり判定＆向き判定
 * @param c 円
 * @param r 長方形
 */
export function intersectDirection(c: Circle, r: Rect): Direction {
  if (!intersect(c, r)) return Direction.None

  if (r.left < c.x && c.x < r.right) return Direction.Y

  if (r.top < c.y && c.y < r.bottom) return Direction.X

  return Direction.XY
}

/**
 * 円と長方形の当たり判定
 * @param c 円
 * @param r 長方形
 */
export function intersect(c: Circle, r: Rect): boolean {
  return (
    r.left - c.r < c.x &&
    c.x < r.right + c.r &&
    r.top - c.r < c.y &&
    c.y < r.bottom + c.r
  )
}
