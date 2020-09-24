export interface GameObject {
  /**
   * called in every animation frame.
   * @param delta time elapsed since the last time update was called
   */
  update(delta: number): void
}
