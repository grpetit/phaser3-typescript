/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @description  Fantasy Console: Game Scene
 * @license      Digitsensitive
 */

import { FantasyConsole } from "../helpers/fantasy-console";

export class PFCGameScene extends Phaser.Scene {
  private FCP: FantasyConsole;

  // attack waves
  private AW = [
    {
      t: 100,
      n: 10,
      e: {
        sp: 16,
        health: 1,
        x: 80,
        y: 0,
        w: 8,
        h: 8,
        dx: 0,
        dy: 0.2,
        dc: Math.PI / 50
      }
    },
    {
      t: 100,
      n: 1,
      e: {
        sp: 18,
        health: 10,
        x: 80,
        y: 0,
        w: 8,
        h: 8,
        dx: 0,
        dy: 0.05,
        dc: Math.PI / 30
      }
    },
    {
      t: 400,
      n: 4,
      e: {
        sp: 16,
        health: 1,
        x: 40,
        y: 0,
        w: 8,
        h: 8,
        dx: 0,
        dy: 0.5,
        dc: -1
      }
    },
    {
      t: 800,
      n: 2,
      e: {
        sp: 16,
        health: 1,
        x: 80,
        y: 0,
        w: 8,
        h: 8,
        dx: 0,
        dy: 0.5,
        dc: -1
      }
    },
    {
      t: 1200,
      n: 3,
      e: {
        sp: 16,
        health: 1,
        x: 20,
        y: 0,
        w: 8,
        h: 8,
        dx: 0.5,
        dy: 0.5,
        dc: -1
      }
    },
    {
      t: 1400,
      n: 4,
      e: {
        sp: 16,
        health: 1,
        x: 180,
        y: 0,
        w: 8,
        h: 8,
        dx: -0.5,
        dy: 0.5,
        dc: -1
      }
    }
  ];

  private ship = {
    sp: 0,
    x: 100,
    y: 120,
    w: 8,
    h: 8,
    health: 3,
    l: 1,
    d: 1,
    s: 1,
    p: 0
  };

  private bullets: any[] = [];
  private enemies: any[] = [];
  private explosionCircles: any[] = [];
  private pickups: any[] = [];
  private stars: any[] = [];

  // pick-ups
  private superBombCircle: any = {};
  private laserLine: any = {};
  private defensiveShieldCircle: any = {};

  constructor() {
    super({
      key: "PFCGameScene"
    });
  }

  preload(): void {
    this.load.pack(
      "preload",
      "./src/games/fantasy-console/assets/pack.json",
      "preload"
    );
  }

  init(): void {
    this.FCP = new FantasyConsole(this);
    this.FCP.initPalette(
      "140C1C44243430346D4E4A4F854C30346524D04648757161597DCED27D2C8595A16DAA2CD2AA996DC2CADAD45EDEEED6"
    );
    this.addBackground();
  }

  update(): void {
    this.FCP.update();
    this.FCP.cls(0);
    this.handleInput();
    this.updateAttackWaves();
    this.drawObjects();
    this.drawUI();
  }

  handleInput(): void {
    if (this.FCP.btn(0)) {
      this.ship.y -= 1;
    }
    if (this.FCP.btn(1)) {
      this.ship.y += 1;
    }
    if (this.FCP.btn(2)) {
      this.ship.x -= 2;
    }
    if (this.FCP.btn(3)) {
      this.ship.x += 2;
    }
    if (this.FCP.btnp(4)) {
      if (this.ship.s !== 0) {
        this.ship.s--;
        this.superBomb();
      }
    }
    if (this.FCP.btnp(5)) {
      this.fire();
    }
    if (this.FCP.btnp(6)) {
      if (this.ship.l !== 0) {
        this.ship.l--;
        this.laserAttack();
      }
    }
    if (this.FCP.btnp(7)) {
      if (this.ship.d !== 0) {
        this.ship.d--;
        this.defensiveShield();
      }
    }
  }

  updateAttackWaves(): void {
    for (let w of this.AW) {
      if (w.t === this.FCP.getTicks()) {
        this.createEnemies(w);
      }
    }
  }

  drawObjects(): void {
    // draw background with stars
    this.stars.forEach((s, i) => {
      s.y += s.s;
      this.FCP.pix(s.x, s.y, Math.floor(Math.random() * 10));
      if (s.y > this.FCP.height()) {
        s.y = 0;
      }
    });

    // draw our player
    this.FCP.anim(this.ship, 0, 2, 4);

    // bullets
    this.bullets.forEach((b, i) => {
      if (!this.bulletOfScreen(b)) {
        b.x += b.dx;
        b.y += b.dy;
        this.FCP.spr(b.sp, b.x, b.y);

        this.enemies.forEach((e, index) => {
          if (this.FCP.rrc(b, e)) {
            e.health -= 1;
            this.bullets.splice(i, 1);
            this.createCircleExplosion(e, 1);
            if (e.health === 0) {
              this.ship.p += 10;
              if (Math.floor(Math.random() * 10) === 3) {
                this.dropPickup(e);
              }
              this.createCircleExplosion(e, 3);
              this.enemies.splice(index, 1);
            }
          }
        });
      } else {
        this.bullets.splice(i, 1);
      }
    });

    // enemies
    this.enemies.forEach((e, i) => {
      if (!this.enemyOfScreen(e)) {
        if (e.c !== -1) {
          e.x += Math.cos(e.c) + e.dx;
          e.y += Math.sin(e.c) + e.dy;
          e.c += e.dc;
        } else {
          e.x += e.dx;
          e.y += e.dy;
        }

        this.FCP.anim(e, e.sp, 2, 4);

        if (this.FCP.crc(this.superBombCircle, e)) {
          this.ship.p += 10;
          this.enemies.splice(i, 1);
          this.createCircleExplosion(e, 3);
        }

        if (this.FCP.rrc(e, this.laserLine)) {
          this.ship.p += 10;
          this.enemies.splice(i, 1);
          this.createCircleExplosion(e, 3);
        }

        if (this.FCP.rrc(e, this.ship)) {
          this.ship.p += 10;
          this.enemies.splice(i, 1);
          this.playerDying();
          this.createCircleExplosion(e, 3);
        }
      } else {
        this.enemies.splice(i, 1);
      }
    });

    // explosion circles
    this.explosionCircles.forEach((c, i) => {
      if (c.r < 30) {
        this.FCP.circb(c.x, c.y, c.r, c.t, c.c);
        c.r += 1;
      } else {
        this.explosionCircles.splice(i, 1);
      }
    });

    // pickups
    this.pickups.forEach((p, i) => {
      p.y += 1;
      this.FCP.spr(p.t, p.x, p.y);
      if (p.y > this.FCP.height()) {
        this.pickups.splice(i, 1);
      }

      if (this.FCP.rrc(p, this.ship)) {
        this.pickups.splice(i, 1);
        switch (p.t) {
          case 32: {
            this.ship.l += 1;
            break;
          }
          case 33: {
            this.ship.d += 1;
            break;
          }
          case 34: {
            this.ship.s += 1;
            break;
          }
          case 35: {
            this.ship.health += 1;
            break;
          }
        }
      }
    });

    if (this.superBombCircle) {
      if (this.superBombCircle.r < 200) {
        this.FCP.circb(
          this.superBombCircle.x,
          this.superBombCircle.y,
          this.superBombCircle.r,
          this.superBombCircle.t,
          this.superBombCircle.c
        );
        this.superBombCircle.r += 2;
      } else {
        this.superBombCircle = {};
      }
    }

    if (this.laserLine) {
      this.laserLine.d--;
      this.laserLine.x = this.ship.x - 1;
      this.laserLine.y = 0;
      this.laserLine.h =
        this.FCP.height() - (this.FCP.height() - this.ship.y + 3);
      if (this.laserLine.d > 0) {
        this.FCP.rect(
          this.laserLine.x,
          this.laserLine.y,
          this.laserLine.w,
          this.laserLine.h,
          Math.floor(Math.random() * 17) + 1
        );
      } else {
        this.laserLine = {};
      }
    }

    if (this.defensiveShieldCircle) {
      this.defensiveShieldCircle.d--;
      if (this.defensiveShieldCircle.d > 0) {
        this.FCP.circb(
          this.ship.x,
          this.ship.y,
          this.defensiveShieldCircle.r,
          this.defensiveShieldCircle.t,
          Math.floor(Math.random() * 17) + 1
        );
      } else {
        this.defensiveShieldCircle = {};
      }
    }
  }

  drawUI(): void {
    // draw player lives
    for (let i = 1; i < 4; i++) {
      if (this.ship.health < i) {
        this.FCP.spr(4, 200 + i * 10, 10);
      } else {
        this.FCP.spr(3, 200 + i * 10, 10);
      }
    }

    // draw player pickup status
    this.FCP.spr(32, 10, this.FCP.height() - 30);
    this.FCP.print("x" + this.ship.d, 16, this.FCP.height() - 33, 10);
    this.FCP.spr(33, 10, this.FCP.height() - 20);
    this.FCP.print("x" + this.ship.l, 16, this.FCP.height() - 23, 10);
    this.FCP.spr(35, 10, this.FCP.height() - 10);
    this.FCP.print("x" + this.ship.s, 16, this.FCP.height() - 13, 10);

    // draw player score
    this.FCP.print("Score: " + this.ship.p, 5, 5, 10);
  }

  addBackground(): void {
    for (let i = 0; i < 10; i++) {
      let s = {
        x: Math.floor(Math.random() * this.FCP.width()) + 1,
        y: Math.floor(Math.random() * this.FCP.width()) + 1,
        s: 2,
        c: 10
      };
      this.stars.push(s);
    }
  }

  fire(): void {
    let b = {
      sp: 2,
      x: this.ship.x,
      y: this.ship.y - 2,
      w: 8,
      h: 8,
      dx: 0,
      dy: -3
    };
    this.bullets.push(b);
  }

  bulletOfScreen(b): boolean {
    if (b.y < 0) {
      return true;
    } else {
      return false;
    }
  }

  enemyOfScreen(e): boolean {
    if (e.y > this.FCP.height()) {
      return true;
    } else {
      return false;
    }
  }

  createCircleExplosion(pos, numb): void {
    for (let n = 0; n < numb; n++) {
      this.explosionCircles.push({
        x: pos.x,
        y: pos.y,
        r: n * 4,
        t: 1,
        c: Math.floor(Math.random() * 17) + 1
      });
    }
  }
  createEnemies(w): void {
    for (let i = 1; i <= w.n; i++) {
      let enemy = {
        sp: w.e.sp,
        x: w.e.x + i * 20,
        y: -10,
        w: w.e.h,
        h: w.e.w,
        dx: w.e.dx,
        dy: w.e.dy,
        c: 0,
        dc: w.e.dc,
        health: w.e.health
      };
      this.enemies.push(enemy);
    }
  }

  playerDying(): void {
    this.ship.health -= 1;
    if (this.ship.health > 0) {
      this.resetPlayer();
    } else {
      // game over screen
      console.log("gameover");
    }
  }

  resetPlayer(): void {
    this.ship.x = 100;
    this.ship.y = 120;
  }

  superBomb(): void {
    this.superBombCircle = {
      x: this.ship.x,
      y: this.ship.y,
      r: 4,
      t: 1,
      c: Math.floor(Math.random() * 17) + 1
    };
  }

  laserAttack(): void {
    this.laserLine = {
      x: this.ship.x - 1,
      y: this.ship.y + 3,
      w: 2,
      h: this.FCP.height() - this.ship.y,
      t: 2,
      c: 3,
      d: 100
    };
  }

  defensiveShield(): void {
    this.defensiveShieldCircle = {
      x: this.ship.x,
      y: this.ship.y,
      r: 8,
      t: 2,
      c: Math.floor(Math.random() * 17) + 1,
      d: 100
    };
  }

  // function that drops a random pickup when an enemy is killed
  dropPickup(o): void {
    // random number between 0 and 3
    let r = Math.floor(Math.random() * 3) + 0;

    // create new pickup
    let p = {
      x: o.x,
      y: o.y,
      w: 8,
      h: 8,
      t: 32 + r
    };

    // add pickup to array
    this.pickups.push(p);
  }
}
