class Nivel1 extends Phaser.Scene {
    constructor() {
        super('Nivel1');
        this.vida = 100;
        this.puntaje = 0;
    }

    preload() {
        this.load.image('sky', '../../public/img/fondo-space-1.PNG')
        this.load.image('enemy', '/public/img/enemy.png')
        this.load.image('red', '/public/img/cyan.png')
        this.load.image('shoot', '/public/img/shoot4.png')
        this.load.image('shootenemy', '/public/img/shootEnemy.png')
        this.load.image('pared', '/public/img/pipe.png')
        this.load.spritesheet('nave', '/public/img/nave4.png', { frameWidth: 60, frameHeight: 56 })
    }

    create() {
        this.reload = true;
        this.balas = this.physics.add.group();
        this.bala;

        this.add.image(400, 300, 'sky');
        const particles = this.add.particles(0, 0, 'red', {
            speed: 200,
            angle: { min: 170, max: 190 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
        });

        // se crean paredes para eliminar elementos fuera del mundo
        this.paredes = this.physics.add.staticGroup();
        this.paredes.create(-100, this.game.config.height / 2, 'pared').setScale(2).refreshBody();
        this.paredes.create(this.game.config.width + 200, this.game.config.height / 2, 'pared').setScale(2).refreshBody();


        this.player = this.physics.add.sprite(this.game.config.width / 8, this.game.config.height / 2, 'nave');
        this.player.setCollideWorldBounds(true);
        particles.startFollow(this.player);

        // para el movimiento de la nave player (animaciones)
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'nave', frame: 0 }],
            frameRate: 20
        })
        this.anims.create({
            key: 'up',
            frames: [{ key: 'nave', frame: 1 }],
            frameRate: 10
        })
        this.anims.create({
            key: 'down',
            frames: [{ key: 'nave', frame: 2 }],
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
        this.vidaText = this.add.text(16, 16, 'Vida: ' + this.vida + '%', { fontSize: '32px', fill: '#fff' })
        this.puntajeText = this.add.text(16, 40, 'Puntaje: ' + this.puntaje + '/150', { fontSize: '32px', fill: '#fff' })

    }

    update() {
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
        this.bala.body.velocity.x = 400;
        // this.particles2.startFollow(this.bala);
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
        this.puntajeText.setText("Score: " + this.puntaje + "/150");
        if (this.puntaje == 150) {
            this.scene.start("GameOver", { puntaje: this.puntaje });
        }
    }
}
export default Nivel1;