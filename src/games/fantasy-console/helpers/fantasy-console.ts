/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @description  Fantasy Console Helper
 * @license      Digitsensitive
 */

export class FantasyConsole {
  private currentScene: any;
  private cursors: CursorKeys;
  private gameObjects: Phaser.GameObjects.Group;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyB: Phaser.Input.Keyboard.Key;
  private keyX: Phaser.Input.Keyboard.Key;
  private keyY: Phaser.Input.Keyboard.Key;
  private palette: number[];

  // timer
  private passedTicks: number;

  // map
  private tilemap: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private layer: Phaser.Tilemaps.StaticTilemapLayer;

  constructor(scene: Phaser.Scene) {
    this.currentScene = scene;
    this.cursors = this.currentScene.input.keyboard.createCursorKeys();
    this.gameObjects = this.currentScene.add.group();
    this.keyA = this.currentScene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.keyB = this.currentScene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.X
    );
    this.keyX = this.currentScene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.keyY = this.currentScene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Y
    );
    this.palette = [];
    this.passedTicks = 0;
  }

  /**
   * Init color palette with chain hex color string
   * Total 16 colors: 6 * 16 = 96 (string length)
   * Examples:
   * TIC-80 (DB16):
   * 140C1C44243430346D4E4A4F854C30346524D04648757161597DCED27D2C8595A16DAA2CD2AA996DC2CADAD45EDEEED6
   * COMMODORE VIC-20 PALETTE
   * 000000ffffffa8734ae9b287772d26b6686285d4dcc5ffffa85fb4e99df5559e4a92df8742348b7e70cabdcc71ffffb0
   * STILL LIFE PALETTE
   * 3f28117a2222d13b27e07f8a5d853a68c127b3e868122615513155286fb89b8bffa8e4d4cc8218c7b581000000ffffff
   * JAPANESE MACHINE PALETTE
   * 00000019102846af45a1d685453e787664fe8331299ec2e8dc534be18d79d6b97be9d8a1216c4bd365c8afaab9f5f4eb
   * CGARNE PALETTE
   * 0000005e606e2234d10c7e455c2e78b5b5b5FFFFFFffd93f7be2f98a36224c81fb44aacceb8a60aa5c3d6cd947e23d69
   * PSYGNOSIA PALETTE
   * 0000001b1e29362747443f4152524c64647c73615077785b9ea4a7cbe8f7e08b79a2324e003308084a3c546a00516cbf
   * COLOR GRAPHICS ADAPTER PALETTE
   * 000000555555AAAAAAFFFFFF0000AA5555FF00AA0055FF5500AAAA55FFFFAA0000FF5555AA00AAFF55FFAA5500FFFF55
   * EROGE COPPER PALETTE
   * 0d080d4f2b24825b31c59154f0bd77fbdf9bfff9e4bebbb27bb24e74adbb4180a032535f2a23497d3840c16c5be89973
   * EASTER ISLAND PALETTE
   * f6f6bfe6d1d1868691794765f5e17aedc38dcc8d86ca657e39d4b98dbcd28184ab6860869dc0857ea788567864051625
   * PICO-8 PALETTE
   * 0000001D2B537E255383769CAB5236008751FF004D5F574FFF77A8FFA300C2C3C700E436FFCCAA29ADFFFFEC27FFF1E8
   * GRAYSCALE
   * 000000111111222222333333444444555555666666777777888888999999aaaaaabbbbbbccccccddddddeeeeeeffffff
   *
   * @param palette [The color palette]
   */
  public initPalette(palette: string): void {
    let fromPositionInString = 0;
    while (fromPositionInString < 96) {
      this.palette.push(
        parseInt("0x" + palette.substr(fromPositionInString, 6))
      );
      fromPositionInString += 6;
    }
  }

  public initMap(): void {
    this.tilemap = this.currentScene.make.tilemap({ key: "Map" });
    this.tileset = this.tilemap.addTilesetImage("tiles");
    this.layer = this.tilemap.createStaticLayer("layer", this.tileset, 0, 0);
    //this.layer.setCollisionByProperty({ collide: true });
  }

  public update(): void {
    this.passedTicks += 1;
  }

  /**
   * Create a rectangle as GameObjects.Graphics
   * @param  x     [x coordinate of top left corner of the rectangle]
   * @param  y     [y coordinate of top left corner of the rectangle]
   * @param  w     [Width in pixels]
   * @param  h     [Height in pixels]
   * @param  color [Index of the color in the palette]
   * @return       [Rectangle as GameObjects.Graphics]
   */
  public rect(
    x: number,
    y: number,
    w: number,
    h: number,
    color: number
  ): Phaser.GameObjects.Graphics {
    let rect = this.currentScene.add.graphics();
    rect.fillStyle(this.palette[color]);
    rect.fillRect(x, y, w, h);
    this.gameObjects.add(rect);
    return rect;
  }

  /**
   * Create a rectangle outline as GameObjects.Graphics
   * @param  x     [x coordinate of top left corner of the rectangle]
   * @param  y     [y coordinate of top left corner of the rectangle]
   * @param  w     [Width in pixels]
   * @param  h     [Height in pixels]
   * @param  color [Index of the color in the palette]
   * @return       [Rectangle as GameObjects.Graphics]
   */
  public rectb(
    x: number,
    y: number,
    w: number,
    h: number,
    thickness: number,
    color: number
  ): Phaser.GameObjects.Graphics {
    let rectb = this.currentScene.add.graphics();
    rectb.lineStyle(thickness, this.palette[color]);
    rectb.strokeRect(x, y, w, h);
    this.gameObjects.add(rectb);
    return rectb;
  }

  /**
   * Create a circle as GameObjects.Graphics
   * @param  x     [x coordinate of the center of the circle]
   * @param  y     [y coordinate of the center of the circle]
   * @param  r     [Radius of the circle]
   * @param  color [Index of the color in the palette]
   * @return       [Circle as GameObjects.Graphics]
   */
  public circ(
    x: number,
    y: number,
    r: number,
    color: number
  ): Phaser.GameObjects.Graphics {
    let circ = this.currentScene.add.graphics();
    circ.fillStyle(this.palette[color]);
    circ.fillCircle(x, y, r);
    this.gameObjects.add(circ);
    return circ;
  }

  /**
   * Create a circle outline as GameObjects.Graphics
   * @param  x         [x coordinate of the center of the circle]
   * @param  y         [y coordinate of the center of the circle]
   * @param  r         [Radius of the circle]
   * @param  thickness [Thickness of the circle outline]
   * @param  color     [Index of the color in the palette]
   * @return           [Circle as GameObjects.Graphics]
   */
  public circb(
    x: number,
    y: number,
    r: number,
    thickness: number,
    color: number
  ): Phaser.GameObjects.Graphics {
    let circb = this.currentScene.add.graphics();
    circb.lineStyle(thickness, this.palette[color]);
    circb.strokeCircle(x, y, r);
    this.gameObjects.add(circb);
    return circb;
  }

  /**
   * Draw a straight line as GameObjects.Graphics
   * @param  x0        [x coordinate of the start point of the line]
   * @param  y0        [y coordinate of the start point of the line]
   * @param  x1        [x coordinate of the end point of the line]
   * @param  y1        [y coordinate of the end point of the line]
   * @param  thickness [Thickness of the line]
   * @param  color     [Index of the color in the palette]
   * @return           [Line as GameObjects.Graphics]
   */
  public line(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    thickness: number,
    color: number
  ): Phaser.GameObjects.Graphics {
    let line = this.currentScene.add.graphics();
    line.lineStyle(thickness, this.palette[color]);
    line.moveTo(x0, y0);
    line.lineTo(x1, y1);
    line.strokePath();
    this.gameObjects.add(line);
    return line;
  }

  /**
   * Return the time since start of the game in milliseconds
   * @return [time in milliseconds]
   */
  public time(): number {
    return this.currentScene.time.now;
  }

  public getTicks(): number {
    return this.passedTicks;
  }

  /**
   * Print text on the screen
   * @param  text  [Text as a string]
   * @param  x     [x position of the text]
   * @param  y     [y position of the text]
   * @param  color [Color of the text]
   * @return       [Phaser.GameObjects.BitmapText]
   */
  public print(
    text: string,
    x: number,
    y: number,
    color: number
  ): Phaser.GameObjects.BitmapText {
    let newText = this.currentScene.add.bitmapText(
      x,
      y,
      "fantasyConsoleFont",
      text,
      6
    );
    newText.setOrigin(0);
    newText.setTint(this.palette[color]);
    this.gameObjects.add(newText);
    return newText;
  }

  /**
   * Clear all game objects
   * Clear the screen with the color passed
   * @param color [the color passed]
   */
  public cls(color: number): void {
    this.gameObjects.clear(true);
    this.currentScene.cameras.main.setBackgroundColor(this.palette[color]);
  }

  /**
   * Get status of button id passed
   * Returns true when the key is pressed down
   * @param  id [Button id passed]
   * @return    [true or false]
   */
  public btn(id: number): boolean {
    switch (id) {
      case 0: {
        if (this.cursors.up.isDown) {
          return true;
        }
        break;
      }
      case 1: {
        if (this.cursors.down.isDown) {
          return true;
        }
        break;
      }
      case 2: {
        if (this.cursors.left.isDown) {
          return true;
        }
        break;
      }
      case 3: {
        if (this.cursors.right.isDown) {
          return true;
        }
        break;
      }
      case 4: {
        if (this.keyA.isDown) {
          return true;
        }
        break;
      }
      case 5: {
        if (this.keyB.isDown) {
          return true;
        }
        break;
      }
      case 6: {
        if (this.keyX.isDown) {
          return true;
        }
        break;
      }
      case 7: {
        if (this.keyY.isDown) {
          return true;
        }
        break;
      }
    }
  }

  /**
   * Get status of button id passed
   * Returns true only the moment when the key is pressed down
   * @param  id [Button id passed]
   * @return    [true or false]
   */
  public btnp(id: number): boolean {
    switch (id) {
      case 0: {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
          return true;
        }
        break;
      }
      case 1: {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
          return true;
        }
        break;
      }
      case 2: {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
          return true;
        }
        break;
      }
      case 3: {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
          return true;
        }
        break;
      }
      case 4: {
        if (Phaser.Input.Keyboard.JustDown(this.keyA)) {
          return true;
        }
        break;
      }
      case 5: {
        if (Phaser.Input.Keyboard.JustDown(this.keyB)) {
          return true;
        }
        break;
      }
      case 6: {
        if (Phaser.Input.Keyboard.JustDown(this.keyX)) {
          return true;
        }
        break;
      }
      case 7: {
        if (Phaser.Input.Keyboard.JustDown(this.keyY)) {
          return true;
        }
        break;
      }
    }
  }

  public spr(
    id: number,
    x: number,
    y: number,
    scale?: number,
    flipHorizontal?: boolean,
    flipVertical?: boolean,
    rotate?: number
  ): Phaser.GameObjects.Sprite {
    let sprite = this.currentScene.add.sprite(x, y, "spritesheet", id);
    this.gameObjects.add(sprite);
    return sprite;
  }

  public pix(x: number, y: number, color: number): Phaser.GameObjects.Graphics {
    let pixel = this.currentScene.add.graphics();
    pixel.lineStyle(1, this.palette[color]);
    pixel.moveTo(x, y);
    pixel.lineTo(x, y + 4);
    pixel.strokePath();
    this.gameObjects.add(pixel);
    return pixel;
  }

  public height(): number {
    return this.currentScene.sys.canvas.height;
  }

  public width(): number {
    return this.currentScene.sys.canvas.width;
  }

  public anim(
    object: any,
    startFrame: number,
    numberOfFrames: number,
    speed: number
  ): void {
    if (!object.a_ct) {
      object.a_ct = 0;
    }
    if (!object.a_st) {
      object.a_st = 0;
    }

    object.a_ct += 1;

    if (object.a_ct % (30 / speed) == 0) {
      object.a_st += 1;
      if (object.a_st == numberOfFrames) object.a_st = 0;
    }

    object.a_fr = startFrame + object.a_st;

    this.spr(object.a_fr, object.x, object.y);
  }

  public map(): void {}

  public crc(c, r): boolean {
    let circleDistanceX = Math.abs(c.x - r.x);
    let circleDistanceY = Math.abs(c.y - r.y);

    if (circleDistanceX > r.w / 2 + c.r) {
      return false;
    }
    if (circleDistanceY > r.h / 2 + c.r) {
      return false;
    }

    if (circleDistanceX <= r.w / 2) {
      return true;
    }
    if (circleDistanceY <= r.h / 2) {
      return true;
    }

    let cornerDistance_sq =
      (circleDistanceX - r.w / 2) * (circleDistanceX - r.w / 2) +
      (circleDistanceY - r.h / 2) * (circleDistanceY - r.h / 2);

    return cornerDistance_sq <= c.r * c.r;
  }

  public rrc(r1, r2): boolean {
    if (
      r1.x < r2.x + r2.w &&
      r1.x + r1.w > r2.x &&
      r1.y < r2.y + r2.h &&
      r1.y + r1.h > r2.y
    ) {
      return true;
    }
    return false;
  }
}
