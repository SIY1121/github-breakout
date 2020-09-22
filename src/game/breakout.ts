import { Ball } from '../objects/ball'
import { Block } from '../objects/block'
import { Game } from './game'
import { Direction, intersectDirection } from '../utils/intersect'
import { Player } from '../objects/player'
import { createButton, createDivElement, createShape } from '../utils/domUtils'
import { getHighScore, saveScore } from '../utils/score'

enum State {
  Ready,
  Playing,
  Done,
}

export class Breakout extends Game {
  state: State = State.Ready
  score = 0

  ball!: Ball
  blocks!: Block[]
  player!: Player

  svgElement: SVGElement
  headerElement!: HTMLElement | null
  button!: HTMLButtonElement
  footerElement!: HTMLDivElement
  scoreElement!: SVGElement

  constructor(svgElement: SVGElement) {
    super()
    this.svgElement = svgElement
    this.initGameObject()
    this.initUI()
  }

  initGameObject() {
    this.ball = new Ball(this.svgElement)
    this.player = new Player(this.svgElement)
    this.blocks = [...this.svgElement.querySelectorAll('rect')]
      .filter((e) => e.getAttribute('data-count') !== '0')
      .map((e) => new Block(this.svgElement, e))
  }

  async initUI() {
    this.scoreElement = this.svgElement.appendChild(
      createShape('text', { x: 20, y: 130 }, '')
    )
    this.headerElement = document.querySelector<HTMLElement>(
      '.js-yearly-contributions h2'
    )
    const uiContainer = document.querySelector('.js-calendar-graph')
    if (!uiContainer) return
    const hs = await getHighScore()
    this.button = uiContainer.appendChild(
      createButton(this.blocks.length > 0 ? `Play!` : '🥺', () =>
        this.onButtonClick()
      )
    )
    this.footerElement = uiContainer.appendChild(
      createDivElement(
        hs > 0 ? `HighScore: ${hs}` : 'Press the arrow keys to play ←→'
      )
    )
    this.init()
  }

  /**
   * 毎アニメーションフレームで呼ばれる
   * @param delta 前回update呼ばれてからの経過時間
   */
  update(delta: number) {
    if (this.state !== State.Playing) return

    // 更新
    this.ball.update(delta)
    this.player.update(delta)
    this.blocks.forEach((b) => b.update(delta))

    // TODO すべてのブロックに対して当たり判定してるので空間分割とかで計算量減らしたい
    let life = 0
    this.blocks
      .filter((b) => b.life > 0)
      .forEach((b) => {
        life += b.life

        const d = intersectDirection(this.ball, b)
        // ボールがブロックにぶつかったら
        if (d !== Direction.None) {
          this.ball.onCollide(d)
          b.onCollide()
          this.score += b.origianlLife
        }
      })
    // ボールがバーにぶつかったら
    this.ball.onCollide(intersectDirection(this.ball, this.player))

    // スコア更新
    this.updateLabel(life)

    // 下に落ちたら終了
    if (this.ball.y > 220) {
      this.state = State.Done
      this.button.textContent = 'GameOver!'
      saveScore(this.score)
    }

    // 除草が完了したらクリア
    if (life === 0) {
      this.state = State.Done
      this.button.textContent = 'Clear!'
      saveScore(this.score)
    }
  }

  /**
   * スコアラベルとcontributionラベルの更新
   * @param contributons 残りcontributions
   */
  updateLabel(contributons: number) {
    const tmp = this.headerElement?.textContent?.match(/.*?[0-9,]+([\s\S]*)/m)
    if (this.headerElement && tmp)
      this.headerElement.textContent = `${contributons.toLocaleString()}${tmp[1].replace(
        /\n/,
        ''
      )}`
    this.scoreElement.textContent = `score: ${this.score}`
  }

  /**
   * 下部のボタンをクリックした場合
   */
  onButtonClick() {
    // プレイする草がないユーザーには進捗を生んでもらう
    if (this.blocks.length === 0) {
      location.href = 'https://github.com/new'
      return
    }

    switch (this.state) {
      case State.Ready:
        this.state = State.Playing
        this.button.textContent = 'Reset'
        break
      case State.Playing:
        this.reset()
        break
      case State.Done:
        this.reset()
        break
    }
  }

  /**
   * リセット
   */
  async reset() {
    this.state = State.Ready
    let life = 0
    this.blocks.forEach((b) => {
      b.reset()
      life += b.origianlLife
    })
    this.player.reset()
    this.ball.reset()
    this.score = 0
    this.button.textContent = 'Play!'
    this.scoreElement.textContent = ''
    this.footerElement.textContent = `HighScore: ${await getHighScore()}`
    this.updateLabel(life)
  }
}
