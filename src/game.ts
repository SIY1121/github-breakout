import { GameObject } from "./gameObject";

export abstract class Game {
  private lastUpdtae: number = 0;

  protected objects: GameObject[] = []

  constructor() {
  }

  protected init() {
    this.lastUpdtae = Date.now()
    requestAnimationFrame(() => this.animation())
  }

  animation() {
    this.objects.forEach(o => o.update((Date.now() - this.lastUpdtae) / 1000))
    this.lastUpdtae = Date.now()
    this.afterUpdate()
    requestAnimationFrame(() => this.animation())
  }

  abstract afterUpdate(): void;
}