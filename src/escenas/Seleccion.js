class Seleccion extends Phaser.Scene{

    constructor(){
        super('Seleccion');
        this.numJugador=0;
    }

    init(data){
        this.sonido = data.sonido;
    }

    preload(){
        this.load.image('final', '../../public/img/fondo-space-1.PNG');
        this.load.spritesheet('nave', '/public/img/nave.png', { frameWidth: 70, frameHeight: 62 });
        this.load.spritesheet('sega', '/public/img/nave4.png', { frameWidth: 60, frameHeight: 56 });
        //this.load.image('mira', '../public/img/miraJuego.png');
        this.load.image('seleccion', '../public/img/seleccion.png');

    }

    create(){

        //this.add.image(400,100, 'seleccion');

        this.skyline = this.add.blitter(0, 0, 'final');
        this.skyline.create(0, 0);
        this.skyline.create(0, -800);

        this.add.image(400,300, 'seleccion');
        console.log(this.numJugador);

        const pixelated = this.cameras.main.postFX.addPixelate(-1);

        this.anims.create({
            key: 'naveAnimacion',
            frames: this.anims.generateFrameNames('nave', {star: 0, end:2}),
            frameRate: 3,
        })

        this.anims.create({
            key: 'segaAnimacion',
            frames: this.anims.generateFrameNames('sega', {star: 0, end:2}),
            frameRate: 3,
        })

        const buttonBox = this.add.rectangle(this.sys.scale.width / 4, this.sys.scale.height - 300, 150, 200, 0xB2B2B2,1);
        const buttonBox1 = this.add.rectangle(600, this.sys.scale.height - 300, 150, 200, 0xB2B2B2,1);
        buttonBox.setInteractive();
        buttonBox1.setInteractive();
        const buttonImg = this.add.sprite(this.sys.scale.width / 4, this.sys.scale.height - 300, "nave").setOrigin(0.5);
        const buttonImg1 = this.add.sprite(600, this.sys.scale.height - 300, "sega").setOrigin(0.5);

        // Click to change scene
        buttonBox.on('pointerdown', () => {
            // Transition to next scene
            this.add.tween({
                targets: pixelated,
                duration: 700,
                amount: 40,
                onComplete: () => {
                    this.cameras.main.fadeOut(100);
                    this.sonido.stop('fondo');
                    this.numJugador = 1;
                    this.scene.start('Nivel1', {numJugador: this.numJugador});
                }
            })
        });

         // Hover button properties
         buttonBox.on('pointerover', () => {
            buttonBox.setFillStyle(0x0000FF, 1);
            this.input.setDefaultCursor('pointer');
            buttonImg.play({key:'naveAnimacion', repeat: -1});
        });

        buttonBox.setInteractive();

        buttonBox.on('pointerout', () => {
            buttonBox.setFillStyle(0xB2B2B2, 1);
            this.input.setDefaultCursor('default');
            buttonImg.stop();
            buttonImg.setFrame(0);
        });

         // Click to change scene
         buttonBox1.on('pointerdown', () => {
            // Transition to next scene
            this.add.tween({
                targets: pixelated,
                duration: 700,
                amount: 40,
                onComplete: () => {
                    this.cameras.main.fadeOut(100);
                    this.sonido.stop('fondo');
                    this.numJugador = 2;
                    this.scene.start('Nivel1', {numJugador: this.numJugador});
                }
            })
        });

         // Hover button properties
         buttonBox1.on('pointerover', () => {
            buttonBox1.setFillStyle(0x00FFFF, 1);
            this.input.setDefaultCursor('pointer');
            buttonImg1.play({key:'segaAnimacion', repeat: -1});
        });

        buttonBox1.on('pointerout', () => {
            buttonBox1.setFillStyle(0xB2B2B2, 1);
            this.input.setDefaultCursor('default');
            buttonImg1.stop();
            buttonImg1.setFrame(0);
        });
    }

    update(){

        this.skyline.y += 1;
        this.skyline.y %= 800;
    }
}

export default Seleccion;