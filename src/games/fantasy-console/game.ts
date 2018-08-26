/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @description  Fantasy Console
 * @license      Digitsensitive
 */

/// <reference path="../../phaser.d.ts"/>

import "phaser";
import { PFCGameScene } from "./scenes/game-scene";

const config: GameConfig = {
  title: "Fantasy Console",
  url: "https://github.com/digitsensitive/phaser3-typescript",
  version: "1.0",
  width: 240,
  height: 136,
  zoom: 4,
  type: Phaser.WEBGL,
  parent: "game",
  scene: [PFCGameScene],
  input: {
    keyboard: true
  },
  backgroundColor: "#ffffff",
  pixelArt: true,
  antialias: false
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var game = new Game(config);
};
