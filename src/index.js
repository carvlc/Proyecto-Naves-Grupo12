import Play from "./escenas/Play.js";

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale:{
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
    scene: [Play]
};
let game = new Phaser.Game(config);