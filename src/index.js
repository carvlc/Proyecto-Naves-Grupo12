
import GameOver from "./escenas/GameOver.js";
import Boss from "./escenas/Boss.js";
import Menu from "./escenas/Menu.js";
import Nivel1 from "./escenas/Nivel1.js";
import Nivel2 from "./escenas/Nivel2.js";


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

    scene: [Menu, Nivel1, Nivel2, Boss, GameOver]
};
let game = new Phaser.Game(config);