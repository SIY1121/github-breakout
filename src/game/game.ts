export abstract class Game {
  private lastUpdtae = 0

  protected init() {
    this.lastUpdtae = Date.now()
    requestAnimationFrame(() => this._update())
  }

  _update() {
    this.update((Date.now() - this.lastUpdtae) / 1000)
    this.lastUpdtae = Date.now()
    requestAnimationFrame(() => this._update())
  }

  abstract update(delta: number): void
}
