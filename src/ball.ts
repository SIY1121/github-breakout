import { GameObject } from "./gameObject";
import { Direction } from "./intersect";
import { Circle } from "./shape";
import { createShape } from "./utils";

export class Ball implements GameObject, Circle {
  svg: SVGElement;
  el: SVGElement;
  x = 100;
  y = 150;

  vx = 0;
  vy = 0;

  r = 5;

  constructor(el: SVGElement) {
    this.svg = el;
    this.el = el.appendChild(
      createShape("circle", {
        cx: 0,
        cy: 0,
        r: this.r,
        fill: "red",
      })
    );
    this.start()
  }

  update(delta: number): void {
    if (
      this.x > this.svg.getBoundingClientRect().width - this.r ||
      this.x < this.r
    ) {
      this.vx *= -1;
      this.x += this.vx / Math.abs(this.vx);
    }
    if (
      this.y < this.r
    ) {
      this.vy *= -1;
      this.y += this.vy / Math.abs(this.vy);
    }
    this.x = this.x + this.vx * delta;
    this.y = this.y + this.vy * delta;
    this.el.setAttribute("cx", this.x.toString());
    this.el.setAttribute("cy", this.y.toString());
  }

  start() {
    this.vx = 100
    this.vy = -100
  }

  onCollide(d: Direction) {
    if (d === Direction.X) {
      this.vx *= -1;
      this.x += this.vx / Math.abs(this.vx);
    }
    else if (d === Direction.Y) {
      this.vy *= -1;
      this.y += this.vy / Math.abs(this.vy);
    }
    else if (d === Direction.XY) {
      this.vx *= -1;
      this.vy *= -1;
    }
  }
}
