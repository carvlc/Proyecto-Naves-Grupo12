import GameOver from "./escenas/GameOver.js";
import Nivel1 from "./escenas/Nivel1.js";

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Nivel1, GameOver]
};
let game = new Phaser.Game(config);