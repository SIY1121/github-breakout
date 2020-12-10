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
    ;(async () => {
      this.initGameObject()
      await this.initUI()
      this.startGameLoop()
    })()
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
      createShape(
        'text',
        { x: 20, y: 130, fill: 'var(--color-text-primary)' },
        ''
      )
    )

    this.headerElement = document.querySelector<HTMLElement>(
      '.js-yearly-contributions h2'
    )

    const uiContainer = document.querySelector('.js-calendar-graph')
    if (!uiContainer) return

    this.button = uiContainer.appendChild(
      createButton(this.blocks.length > 0 ? `Play!` : '🥺', () =>
        this.onButtonClick()
      )
    )

    const hs = await getHighScore()
    this.footerElement = uiContainer.appendChild(
      createDivElement(
        hs > 0 ? `HighScore: ${hs}` : 'Press the arrow keys to play ←→'
      )
    )
  }

  /**
   * game loop
   * @param delta time elapsed since the last time update was called
   */
  update(delta: number) {
    if (this.state !== State.Playing) return

    // update objects
    this.ball.update(delta)
    this.player.update(delta)
    this.blocks.forEach((b) => b.update(delta))

    // TODO reduce the computational cost
    let remainingContributions = 0
    this.blocks
      .filter((b) => b.life > 0)
      .forEach((b) => {
        const d = intersectDirection(this.ball, b)
        // the ball hit the block
        if (d !== Direction.None) {
          this.ball.onCollide(d)
          b.onCollide()
          this.score += b.origianlLife
        }
        remainingContributions += b.life
      })
    // the ball hit the bar
    this.ball.onCollide(intersectDirection(this.ball, this.player))

    // update score label
    this.updateLabel(remainingContributions)

    // gameover
    if (this.ball.y > 220) {
      this.state = State.Done
      this.button.textContent = 'GameOver!'
      saveScore(this.score)
    }

    // clear
    if (remainingContributions === 0) {
      this.state = State.Done
      this.button.textContent = 'Clear!'
      saveScore(this.score)
    }
  }

  /**
   * update score and contribution label
   * @param contributons remaining contributions
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
   * footer button
   */
  onButtonClick() {
    // Can't play? Let's write the code!
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
   * Reset all status
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
