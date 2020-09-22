import { Ball } from '../objects/ball'
import { Block } from '../objects/block'
import { Game } from './game'
import { Direction, intersectDirection } from '../intersect'
import { Player } from '../objects/player'
import { createButton, createDivElement, createShape } from '../domUtils'
import { getHighScore, saveScore } from '../score'

enum State {
  Ready,
  Playing,
  Done,
}

export class Breakout extends Game {
  state: State = State.Ready

  ball: Ball
  blocks: Block[] = []
  player: Player

  contributionElement: HTMLElement | null

  button!: HTMLButtonElement
  text!: HTMLDivElement

  scoreText: SVGElement
  score = 0

  constructor(el: SVGElement) {
    super()
    this.blocks = [...el.querySelectorAll('rect')]
      .filter((e) => e.getAttribute('data-count') !== '0')
      .map((e) => new Block(el, e))
    this.ball = new Ball(el)
    this.player = new Player(el)
    this.scoreText = el.appendChild(createShape('text', { x: 20, y: 130 }, ''))
    this.contributionElement = document.querySelector<HTMLElement>(
      '.js-yearly-contributions h2'
    )
    ;(async () => {
      const hs = await getHighScore()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.button = document
        .querySelector('.js-calendar-graph')!
        .appendChild(
          createButton(this.blocks.length > 0 ? `Play!` : '🥺', () =>
            this.onButtonClick()
          )
        )
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.text = document
        .querySelector('.js-calendar-graph')!
        .appendChild(
          createDivElement(
            hs > 0 ? `HighScore: ${hs}` : 'Press the arrow keys to play ←→'
          )
        )
      this.init()
    })()
  }

  update(delta: number) {
    if (this.state === State.Playing) {
      this.ball.update(delta)
      this.player.update(delta)
      this.blocks.forEach((b) => b.update(delta))
      let life = 0
      this.blocks
        .filter((b) => b.life > 0)
        .forEach((b) => {
          life += b.life
          const d = intersectDirection(this.ball, b)
          if (d !== Direction.None) {
            this.ball.onCollide(d)
            b.onCollide()
            this.score += b.origianlLife
          }
        })
      this.ball.onCollide(
        intersectDirection(this.ball, this.player),
        this.ball.vx
      )
      this.updateHeader(life)
      if (this.ball.y > 220) {
        this.state = State.Done
        this.button.textContent = 'GameOver!'
        saveScore(this.score)
      }
      if (life === 0) {
        this.state = State.Done
        this.button.textContent = 'Clear!'
        saveScore(this.score)
      }
    }
  }

  updateHeader(life: number) {
    const tmp = this.contributionElement?.textContent?.match(
      /.*?[0-9,]+([\s\S]*)/m
    )
    if (this.contributionElement && tmp)
      this.contributionElement.textContent = `${life.toLocaleString()}${tmp[1].replace(
        /\n/,
        ''
      )}`
    this.scoreText.textContent = `score: ${this.score}`
  }

  onButtonClick() {
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
    this.scoreText.textContent = ''
    this.text.textContent = `HighScore: ${await getHighScore()}`
    this.updateHeader(life)
  }
}
