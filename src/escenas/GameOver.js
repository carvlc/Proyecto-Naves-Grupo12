class GameOver extends Phaser.Scene{
    constructor(){
        super('GameOver');
    }
    init(data){
        this.puntaje = data.puntaje;
    }

    preload(){
        this.load.image('gameover','/public/img/fondo-space-1.PNG');
        this.load.image('text','/public/img/gameover.png');
        this.load.image('continuar','/public/img/continuar.png')
    }

    create(){
        this.skyline = this.add.blitter(0, 0, 'gameover');
        this.skyline.create(0, 0);
        this.skyline.create(0, -800);
        this.add.image(400,200,'text').setScale(0.5)
        this.continuar = this.add.image(400,500, 'continuar').setInteractive().setScale(0.5);
        this.continuar.on('pointerdown',() => {
            this.scene.start('Menu')
        });
        this.puntajeText = this.add.text(250,this.game.config.height/2,'Puntaje: ' + this.puntaje,{fontSize:'40px', fill:'#d42068'});
    }

    update(){
        this.skyline.y +=1;
        this.skyline.y %= 800;
    }
}

export default GameOver;