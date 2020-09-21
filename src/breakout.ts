import { Ball } from "./ball";
import { Block } from "./block";
import { Game } from "./game";
import { Direction, intersectDirection } from "./intersect";
import { Player } from "./player";
import { createButton } from "./utils";

enum State {
  Ready,
  Playing,
  Done,
}

export class Breakout extends Game {
  state: State = State.Ready;

  ball: Ball;
  blocks: Block[];
  player: Player;

  contributionElement: HTMLElement | null;

  button: HTMLButtonElement;

  constructor(el: SVGElement) {
    super();
    this.blocks = [...el.querySelectorAll("rect")]
      .filter((e) => e.getAttribute("data-count") !== "0")
      .map((e) => new Block(el, e));
    this.ball = new Ball(el);
    this.player = new Player(el);
    this.contributionElement = document.querySelector<HTMLElement>(
      ".js-yearly-contributions h2"
    );

    this.button = document
      .querySelector(".js-calendar-graph")!
      .appendChild(createButton(this.blocks.length > 0 ? "Play!" : "🥺", () => this.onButtonClick()));

    this.init();
  }

  update(delta: number) {
    if (this.state === State.Playing) {
      this.ball.update(delta);
      this.player.update(delta);
      this.blocks.forEach((b) => b.update(delta));

      let life = 0;
      this.blocks
        .filter((b) => b.life > 0)
        .forEach((b) => {
          const d = intersectDirection(this.ball, b);
          if (d !== Direction.None) {
            this.ball.onCollide(d);
            b.onCollide();
          }
          life += b.life;
        });
      this.ball.onCollide(intersectDirection(this.ball, this.player));
      this.updateHeader(life);
      if(this.ball.y > 250) {
        this.state = State.Done
        this.button.textContent = "GameOver!"
      }
      if(life === 0) {
        this.state = State.Done
        this.button.textContent = "Clear!"
      }
    }
  }

  updateHeader(life: number) {
    const tmp = this.contributionElement?.textContent?.match(
      /.*?[0-9,]+([\s\S]*)/m
    );
    if (this.contributionElement && tmp)
      this.contributionElement.textContent = `${life.toLocaleString()}${tmp[1].replace(
        /\n/,
        ""
      )}`;
  }

  onButtonClick() {
    if(this.blocks.length === 0) {
      location.href = "https://github.com/new"
      return;
    }
    switch (this.state) {
      case State.Ready:
        this.state = State.Playing;
        this.button.textContent = "Reset";
        break;
      case State.Playing:
        this.reset();
        break;
      case State.Done:
        this.reset();
        break;
    }
  }

  reset() {
    this.state = State.Ready;
    let life = 0;
    this.blocks.forEach((b) => {
      b.reset();
      life += b.origianlLife;
    });
    this.player.reset();
    this.ball.reset();
    this.button.textContent = "Play!";
    this.updateHeader(life);
  }
}
