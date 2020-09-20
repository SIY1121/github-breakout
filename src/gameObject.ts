export abstract class GameObject {
  private lastUpdtae: number = 0;

  constructor() {
  }

  protected init() {
    this.lastUpdtae = Date.now()
    requestAnimationFrame(() => this.animation())
  }

  animation() {
    if(this.update)
    this.update((Date.now() - this.lastUpdtae) / 1000)
    this.lastUpdtae = Date.now()
    requestAnimationFrame(() => this.animation())
  }

  abstract update(delta: number): void
}