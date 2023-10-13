
import GameOver from "./escenas/GameOver.js";
import Boss from "./escenas/Boss.js";
import Menu from "./escenas/Menu.js";
import Nivel1 from "./escenas/Nivel1.js";
import Nivel2 from "./escenas/Nivel2.js";
import Nivel3 from "./escenas/Nivel3.js";
import Win from "./escenas/Win.js";


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
            debug: true
        }
    },
    scene: [Menu, Nivel1, Nivel2,Nivel3,Boss, GameOver, Win]
};
let game = new Phaser.Game(config);