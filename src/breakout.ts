import { Ball } from "./ball";
import { Block } from "./block";
import { Game } from "./game";
import { Direction, intersectDirection } from "./intersect";
import { Player } from "./player";

export class Breakout extends Game {
  ball: Ball;
  blocks: Block[];
  player: Player;

  contributionElement: HTMLElement | null;

  constructor(el: SVGElement) {
    super();
    this.ball = new Ball(el);
    this.blocks = [...el.querySelectorAll("rect")].map((e) => new Block(el, e));
    this.player = new Player(el);
    this.objects.push(this.ball);
    this.objects.push(this.player);
    this.contributionElement = document.querySelector<HTMLElement>(
      ".js-yearly-contributions h2"
    );

    this.init();
  }

  afterUpdate() {
    let life = 0;
    this.blocks.forEach((b) => {
      if (b.life > 0) {
        const d = intersectDirection(this.ball, b);
        if (d !== Direction.None) {
          this.ball.onCollide(d);
          b.onCollide();
        }
      }
      life += b.life;
    });
    this.ball.onCollide(intersectDirection(this.ball, this.player));

    const tmp = this.contributionElement?.textContent?.match(/.*?[0-9,]+([\s\S]*)/m);
    if (this.contributionElement && tmp)
     this.contributionElement.textContent = `${life.toLocaleString()}${tmp[1].replace(/\n/, "")}`
  }
}
