import { GameObject } from "./gameObject";
import { Rect } from "./shape";

export class Block implements GameObject, Rect {
  el: SVGElement;

  left: number;
  right: number;
  top: number;
  bottom: number;

  life: number;
  constructor(svg: SVGElement, el: SVGElement) {
    this.el = el;
    const r = el.getBoundingClientRect();
    const rr = svg.getBoundingClientRect();
    this.right = r.right - rr.left;
    this.left = r.left - rr.left;
    this.top = r.top - rr.top;
    this.bottom = r.bottom - rr.top;

    this.life = Number(el.getAttribute("data-count"));
  }
  update(delta: number) {}

  onCollide() {
    this.life = 0;
    this.el.setAttribute("fill", "#ebedf0");
    this.el.setAttribute("data-count", "0");
  }
}
