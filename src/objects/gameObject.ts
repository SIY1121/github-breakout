export interface GameObject {
  /**
   * 毎アニメーションフレームで呼ばれる
   * @param delta 前回updateが呼ばれてからの経過時間
   */
  update(delta: number): void
}
