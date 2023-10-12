class Nivel1 extends Phaser.Scene {
    constructor() {
        super('Nivel1');
        this.vida = 100;
        this.puntaje = 0;
    }

    preload() {
        this.load.image('sky', '../../public/img/background1.png')
        this.load.image('enemy', '/public/img/enemy.png')
        this.load.image('cyan', '/public/img/cyan.png')
        this.load.image('shoot', '/public/img/shoot5.png')
        this.load.image('shootenemy', '/public/img/shootEnemy.png')
        this.load.image('item', '/public/img/shoot4.png')
        this.load.image('pared', '/public/img/pipe.png')
        this.load.spritesheet('sega', '/public/img/nave4.png', { frameWidth: 60, frameHeight: 56 })
    }

    create() {
        this.puntaje = 0;
        this.vida = 100;
        this.reload = true;
        this.balas = this.physics.add.group();
        this.bala;

        this.skyline = this.add.blitter(0, 0, 'sky');
        this.skyline.create(0, 0);
        this.skyline.create(800, 0);


        const particles = this.add.particles(0, 0, 'cyan', {
            speed: 200,
            angle: { min: 170, max: 190 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
        });


        // se crean paredes para eliminar elementos fuera del mundo
        this.paredes = this.physics.add.staticGroup();
        this.paredes.create(-100, this.game.config.height / 2, 'pared').setScale(2).refreshBody();
        this.paredes.create(this.game.config.width + 200, this.game.config.height / 2, 'pared').setScale(2).refreshBody();


        this.player = this.physics.add.sprite(this.game.config.width / 8, this.game.config.height / 2, 'sega');
        this.player.setCollideWorldBounds(true);
        particles.startFollow(this.player);

        // para el movimiento de la nave player (animaciones)
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'sega', frame: 0 }],
            frameRate: 20
        })
        this.anims.create({
            key: 'up',
            frames: [{ key: 'sega', frame: 1 }],
            frameRate: 10
        })
        this.anims.create({
            key: 'down',
            frames: [{ key: 'sega', frame: 2 }],
            frameRate: 10
        })

        // para detectar las entradas de teclado
        this.cursors = this.input.keyboard.createCursorKeys();

        // para los enemigos
        this.createEnemy();

        this.time.addEvent({
            delay: 1000,
            callback: this.createEnemy,
            callbackScope: this,
            repeat: -1
        })

        this.physics.add.collider(this.balas, this.paredes, this.outBullet, null, this);
        this.puntajeText = this.add.text(16, 16, 'Puntaje: ' + this.puntaje + '/100', { fontSize: '32px', fill: '#fff' })
        this.vidaText = this.add.text(16, 50, 'Vida: ' + this.vida + '%', { fontSize: '32px', fill: '#fff' })

    }

    update() {
        this.skyline.x -= 1;
        this.skyline.x %= -800;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-400);
            this.player.anims.play('turn');
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(400);
            this.player.anims.play('turn');
        }
        else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-500);
            this.player.anims.play('up')
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(500)
            this.player.anims.play('down')
        }
        else {
            this.player.setVelocityY(0);
            this.player.setVelocityX(0);
            this.player.anims.play('turn', true)
        }
        // cuando se pulse la tecla 32(espacio) la nave dispara
        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode == 32 && this.reload) {
                this.disparar();
            }
        })
        this.physics.add.collider(this.player, this.powerup, this.obtenerPowerup, null, this);
    }


    recarga() {
        this.reload = false;
        if (!this.addreload) {
            this.time.addEvent({
                delay: 500,
                callback: () => {
                    this.reload = true;
                },
                callbackScope: this,
                repeat: -1
            })
        }
    }

    disparar() {
        this.recarga();
        this.posicionPlayer = this.player.body.position;
        this.bala = this.balas.create(this.posicionPlayer.x + 70, this.posicionPlayer.y + 31, 'shoot');
        this.bala.body.velocity.x = 800;
    }

    createEnemy() {
        let enemyOrigenHorizontal = 750;
        for (let i = 0; i < 1; i++) {
            let enemyOrigenVertical = Phaser.Math.Between(31, 569);
            this.enemy = this.physics.add.sprite(enemyOrigenHorizontal, enemyOrigenVertical, "enemy");
            this.enemy.body.velocity.x = -200;
            this.physics.add.overlap(this.player, this.enemy, this.hitenemy, null, this);
            this.physics.add.collider(this.enemy, this.balas, this.hitbullet, null, this);
            this.physics.add.collider(this.enemy, this.paredes, this.outEnemy, null, this);
        }
    }

    outBullet(balas) {
        balas.destroy();
        console.log('se elimino la bala')
    }

    outEnemy(enemy) {
        enemy.destroy();
        console.log('se elimino el enemigo')
    }

    hitenemy(player, enemy) {
        enemy.destroy();
        this.vida -= 25;
        this.vidaText.setText('Vida: ' + this.vida + '%');
        if (this.vida == 0) {
            this.vida = 100;
            this.scene.start('GameOver', { puntaje: this.puntaje });
            player.setTint(0xff0000)
        }

    }

    hitbullet(enemy, balas) {
        console.log("funca");
        this.puntaje += 10;
        balas.destroy();
        enemy.destroy();
        this.puntajeText.setText("Puntaje: " + this.puntaje + "/100");
        if (this.puntaje == 100) {
            this.scene.start("Nivel2", { puntaje: this.puntaje , vida: this.vida});
        }
        if (this.puntaje == 50) {
            this.particlesItem = this.add.particles(0, 0, 'item', {
                speed: 100,
                scale: { start: 1, end: 0 },
                blendMode: 'ADD',
            })
            this.powerup = this.physics.add.sprite(600, 400, 'item').setVelocity(150, 200).setCollideWorldBounds(true, 1, 1, true).setScale();
            this.particlesItem.startFollow(this.powerup);
        }
    }

    obtenerPowerup() {
        console.log('powerup agarrado');
        this.vida += 100;
        this.vidaText.setText('Vida: ' + this.vida + '%');
        this.powerup.destroy();
        this.particlesItem.destroy();
    }

}
export default Nivel1;