class GameOver extends Phaser.Scene{
    constructor(){
        super('GameOver');
    }
    init(data){
        this.puntaje = data.puntaje;
    }

    preload(){
        this.load.image('gameover','/public/img/sky.png');
    }

    create(){
        this.gameover = this.add.image(400,300, 'gameover').setInteractive();
        this.gameover.on('pointerdown',() => this.scene.start('Nivel1'));
        this.puntajeText = this.add.text(200,550,'Puntaje: ' + this.puntaje,{fontSize:'40px', fill:'#d42068'});
    }
}

export default GameOver;