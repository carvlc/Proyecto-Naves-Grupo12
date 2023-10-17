class Win extends Phaser.Scene{
    constructor(){
        super('Win');
    }

    init(data){
        this.puntaje = data.puntaje;
    }

    preload(){
        this.load.image('win','/public/img/fondo-space-1.PNG');
        this.load.image('continuar','/public/img/continuar.png');
        this.load.image('winner','/public/img/win.png');
        this.load.audio('win','/public/sound/win.mp3')
    }

    create(){
        this.win = this.sound.add('win', {volume: 0.5});
        this.win.play();
        this.skyline = this.add.blitter(0,0,'win');
        this.skyline.create(0,0);
        this.skyline.create(0, -800);
        this.add.image(400,200,'winner')
        this.continuar = this.add.image(400,500, 'continuar').setInteractive().setScale(0.5);
        this.continuar.on('pointerdown',() => {
            this.scene.start('Menu')
            this.win.stop()
        });
        this.puntajeText = this.add.text(250,400,'Puntaje: ' + this.puntaje,{fontSize:'40px', fill:'#45ed48'});
    }

    update(){
        this.skyline.y +=1;
        this.skyline.y %= 800;
    }
}
export default Win;