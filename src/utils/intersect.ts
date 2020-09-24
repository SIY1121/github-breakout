import { Circle, Rect } from '../objects/shape'

export enum Direction {
  X,
  Y,
  XY,
  None,
}

/**
 * collision detection with direction
 * @param c circle
 * @param r rectangle
 */
export function intersectDirection(c: Circle, r: Rect): Direction {
  if (!intersect(c, r)) return Direction.None

  if (r.left < c.x && c.x < r.right) return Direction.Y

  if (r.top < c.y && c.y < r.bottom) return Direction.X

  return Direction.XY
}

/**
 * collision detection
 * @param c circle
 * @param r rectangle
 */
export function intersect(c: Circle, r: Rect): boolean {
  return (
    r.left - c.r < c.x &&
    c.x < r.right + c.r &&
    r.top - c.r < c.y &&
    c.y < r.bottom + c.r
  )
}
