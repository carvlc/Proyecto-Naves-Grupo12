class Menu extends Phaser.Scene{

    constructor(){
        super("Menu");
    }

    preload(){
        this.load.image('inicio', '../public/img/space3.png');
        this.load.image('start', '../public/img/boton1.png');
        this.load.spritesheet('nave', '../public/img/nave.png', { frameWidth: 70, frameHeight: 62 });
        this.load.image('white', '../public/img/white.png');
        this.load.spritesheet('sega', '../public/img/nave4.png', { frameWidth: 60, frameHeight: 56});
        this.load.image('nombre', '../public/img/titulo.png');
        this.load.audio('fondo', '../public/sound/menu.mp3');
    }

    create(){

        this.sonido = this.sound.add('fondo');
        const soundConfig = {
            volume: 0.3,
            loop: true
        }
        if (!this.sound.locked) {
            this.sonido.play(soundConfig)
        }
        else {
            this.sound.once(Phaser.Sound.Events.UNLOCKED, () =>{
                this.sonido.play(soundConfig)
            })
        }

        this.add.image(400, 300, 'inicio');
        this.add.image(400,275, 'nombre');
        this.nave = this.add.image(200, 100, "nave");
        this.sega = this.add.image(600, 400, 'sega');
        this.sega.setFlipX(true);

        const pixelated = this.cameras.main.postFX.addPixelate(-1);

        const buttonBox = this.add.rectangle(this.sys.scale.width / 2, this.sys.scale.height - 100, 150, 50, 0x000000, 1);
        buttonBox.setInteractive();
        const buttonText = this.add.text(this.sys.scale.width / 2, this.sys.scale.height - 100, "START").setOrigin(0.5).setColor('#66FFFF').setFontSize(20);

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
                    this.scene.start('Nivel1');
                }
            })
        });

         // Hover button properties
         buttonBox.on('pointerover', () => {
            buttonBox.setFillStyle(0x66FFFF, 1);
            this.input.setDefaultCursor('pointer');
            buttonText.setColor('#000000');
        });

        buttonBox.on('pointerout', () => {
            buttonBox.setFillStyle(0x000000, 1);
            this.input.setDefaultCursor('default');
            buttonText.setColor('#66FFFF');
        });

        this.flame = this.add.particles(this.nave.x -90, this.nave.y, 'white',
            {
                color: [ 0xfacc22, 0xf89800, 0xf83600, 0x9f0404 ],
                colorEase: 'quad.out',
                lifespan: 1000,
                angle: { min: 175, max: 185 },
                scale: { start: 0.40, end: 0, ease: 'sine.out' },
                speed: 200,
                advance: 2000,
                blendMode: 'ADD'
            });

        this.flame2 = this.add.particles(this.sega.x +90, this.sega.y, 'white',
        {
            color: [ 0x96e0da, 0x937ef3 ],
            colorEase: 'quad.out',
            lifespan: 1000,
            angle: { min: 175, max: 185 },
            scale: { start: 0.40, end: 0, ease: 'sine.out' },
            speed: 200,
            advance: 2000,
            blendMode: 'ADD'
        });
        this.flame2.setRotation(3.14159);
    }

    update(){
         // Wrap ship
         this.nave.x = Phaser.Math.Wrap(this.nave.x + 1, 1,this.sys.scale.width+70);
         this.flame.setPosition(this.nave.x -25, this.nave.y);
         this.sega.x = Phaser.Math.Wrap(this.sega.x - 1, -70,this.sys.scale.width+1);
         this.flame2.setPosition(this.sega.x +25, this.sega.y);
    }

}

export default Menu;