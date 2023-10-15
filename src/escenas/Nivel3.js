class Nivel3 extends Phaser.Scene {
    constructor() {
        super('Nivel3');
        this.puntajeText = "";
        this.vida = 100;
        this.puntaje = 0;
    }
    init(data) {
        this.puntaje = data.puntaje;
        this.vida = data.vida;
        this.sonido = data.sonido;
    }
    preload() {
        this.load.image('space2', '../../public/img/fondo-space-1.PNG')
        this.load.image('enemy', '/public/img/enemy.png')
        this.load.image('shoot', '/public/img/shoot5.png')
        this.load.image('shoot2', '/public/img/shoot3.png')
        this.load.image('shootenemy', '/public/img/shootEnemy.png')
        this.load.image('pared', '/public/img/pipe.png')
        this.load.image('white','/public/img/white.png')
        this.load.spritesheet('nave', '/public/img/nave4.png', { frameWidth: 60, frameHeight: 56 })
        this.load.audio('laser', '../public/sound/blaster.mp3');
        this.load.audio('muerteEnemigo', '../public/sound/alien_death.wav');
        this.load.audio('muerte', '../public/sound/player_death.wav');
        this.load.audio('vida', '../public/sound/vida.mp3');
    }

    create() {
        this.healCount = 0;
        this.reload = true;
        this.reloadEnemy = true;
        this.balas = this.physics.add.group();
        this.balasEnemy = this.physics.add.group();
        this.bala;

        this.skyline = this.add.blitter(0, 0, 'space2');
        this.skyline.create(0, 0);
        this.skyline.create(800, 0);

        this.flame = this.add.particles(0, 0, 'white',
        {
            color: [ 0x96e0da, 0x937ef3 ],
            colorEase: 'quad.out',
            lifespan: 1000,
            angle: { min: 175, max: 185 },
            scale: { start: 0.40, end: 0, ease: 'sine.out' },
            speed: 220,
            advance: 2000,
            blendMode: 'ADD'
        });

        // se crean paredes para eliminar elementos fuera del mundo
        this.paredes = this.physics.add.staticGroup();
        this.paredes.create(-100, this.game.config.height / 2, 'pared').setScale(2).refreshBody();
        this.paredes.create(this.game.config.width + 200, this.game.config.height / 2, 'pared').setScale(2).refreshBody();

        this.player = this.physics.add.sprite(100, 200, 'nave');
        this.player.setCollideWorldBounds(true);
        this.flame.startFollow(this.player,-25,0);

        // para el movimiento de la nave player
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
            delay: 400,
            callback: this.createEnemy,
            callbackScope: this,
            repeat: -1
        })
        this.createShooter();
        this.time.addEvent({
            delay: 1500,
            callback: this.createShooter,
            callbackScope: this,
            repeat: -1
        })
        this.time.addEvent({
            delay: 5000,
            callback: this.createHealer,
            callbackScope: this,
            repeat: -1
        })

        this.physics.add.collider(this.balas, this.paredes, this.outBullet, null, this);
        this.puntajeText = this.add.text(16, 40, 'Puntaje: ' + this.puntaje + '/1500', { fontSize: '32px', fill: '#fff' })
        this.vidaText = this.add.text(16, 16, 'Vida: ' + this.vida + '%', { fontSize: '32px', fill: '#fff' })
    }

    update() {
        this.skyline.x -= 1;
        this.skyline.x %= -800;

        this.hitCheck = true;
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
        // cuando se pulse la tecla 32(espacio) el bird da n salto hacia arriba
        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode == 32 && this.reload) {
                this.disparar();
                this.disparo = this.sound.add('laser', {volume: 0.1});
                this.disparo.play();
            }
        })
    }

    recarga() {
        this.reload = false;
        if (!this.addreload) {
            this.time.addEvent({
                delay: 700,
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
    }


    createEnemy() {
        let enemyOrigenHorizontal = 900;
        for (let i = 0; i < 1; i++) {
            let enemyOrigenVertical = Phaser.Math.Between(31, 569);

            this.enemy = this.physics.add.sprite(enemyOrigenHorizontal, enemyOrigenVertical, "enemy");
            this.enemy.checkWorldBounds = true;
            this.enemy.body.velocity.x = -300;
            this.enemy.body.position.x = this.enemy.body.position.x;
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
        //console.log('se elimino el enemigo')
    }

    outHealer(healer) {
        healer.destroy();
        //console.log('se alimino el healer')
    }
    outShooter(healer) {
        healer.destroy();
        //console.log('se alimino el shooter')
    }

    createHealer() {
        let healerOrigenHorizontal = 900;

        for (let i = 0; i < 1; i++) {
            let healerOrigenVertical = Phaser.Math.Between(31, 569);

            this.healer = this.physics.add.sprite(healerOrigenHorizontal, healerOrigenVertical, "enemy");
            this.healer.setTint(0x90ee90);
            this.healer.checkWorldBounds = true;
            this.healer.body.velocity.x = -300;

            this.physics.add.collider(this.healer, this.balas, this.heal, null, this);
            this.physics.add.collider(this.healer, this.paredes, this.outHealer, null, this);

        }
    }
    // se crea nave que dispara
    createShooter() {
        let shooterOrigenHorizontal = 900;
        for (let i = 0; i < 2; i++) {
            let shooterOrigenVertical = Phaser.Math.Between(31, 569);

            this.shooter = this.physics.add.sprite(shooterOrigenHorizontal, shooterOrigenVertical, "enemy");
            this.shooter.setTint(0xff0075);
            this.shooter.body.velocity.x = -200;
            this.enemyShoot();

            this.physics.add.overlap(this.player, this.shooter, this.hitShooter, null, this);
            this.physics.add.overlap(this.balas, this.balasEnemy, this.collideBullet, null, this);
            this.physics.add.overlap(this.player, this.balasEnemy, this.hitenemyBullet, null, this);
            this.physics.add.collider(this.shooter, this.balas, this.shootShooter, null, this);
            this.physics.add.collider(this.shooter, this.paredes, this.outShooter, null, this);

        }
    }
    //disparos del enemigo
    enemyShoot() {

        this.posicionShooter = this.shooter.body.position;
        this.balaenEmigo = this.balasEnemy.create(this.posicionShooter.x - 10, this.posicionShooter.y + 31, 'shoot2');
        this.balaenEmigo.body.velocity.x = -300;
    }


    // colisiones
    heal(balas, healer) {
        balas.destroy();
        healer.destroy();
        this.vidaJugador = this.sound.add('vida', {volume: 0.1});
        this.vidaJugador.play();
        if (this.vida < 100) {
            console.log("te curaste boludo qliao")
            this.healCount += 1;
            console.log(this.healCount)
            this.vida = 100;
            this.vidaText.setText('Vida: ' + this.vida + '%');
            this.player.setTint(0x90ee90);
            this.time.addEvent({
                delay: 400,
                callbackScope: this,
                callback: function () {
                    this.player.setTint();
                }

            })
        }
    }
    collideBullet(balas, balasEnemy) {
        balasEnemy.destroy();
        balas.destroy();
    }
    hitShooter(player, shooter) {
        shooter.destroy();
        this.vida -= 25;
        this.vidaText.setText('Vida: ' + this.vida + '%');
        player.setTint(0xff0304);
        this.time.addEvent({
            delay: 400,
            callbackScope: this,
            callback: function () {
                player.setTint();
            }

        })
        if (this.vida == 0) {
            this.vida = 100;
            this.sonido.stop();
            this.scene.start('GameOver', { puntaje: this.puntaje });
        }
    }

    hitenemy(player, enemy) {
        enemy.destroy();
        this.vida -= 25;
        this.vidaText.setText('Vida: ' + this.vida + '%');
        player.setTint(0xff0304);
        this.time.addEvent({
            delay: 400,
            callbackScope: this,
            callback: function () {
                player.setTint();
            }

        })
        if (this.vida == 0) {
            this.vida = 100;
            this.sonido.stop();
            this.sound.play('muerte');
            this.scene.start('GameOver', { puntaje: this.puntaje });
        }
    }

    hitenemyBullet(player, balasEnemy) {
        balasEnemy.destroy();
        this.vida -= 25;
        this.vidaText.setText('Vida: ' + this.vida + '%');
        player.setTint(0xff0304);
        this.time.addEvent({
            delay: 400,
            callbackScope: this,
            callback: function () {
                player.setTint();
            }

        })
        if (this.vida == 0) {
            this.vida = 100;
            this.sonido.stop();
            this.sound.play('muerte');
            this.scene.start('GameOver', { puntaje: this.puntaje });
        }
    }

    hitbullet(enemy, balas) {
        this.puntaje += 10;
        balas.destroy();
        enemy.destroy();
        this.muerteEnemigo = this.sound.add('muerteEnemigo', {volume: 0.1});
        this.muerteEnemigo.play();
        this.puntajeText.setText("Puntaje: " + this.puntaje + "/1500");
        if (this.puntaje >= 1500) {
            this.sonido.stop();
            this.scene.start('Boss', { puntaje: this.puntaje, vida: this.vida });
        }
    }

    shootShooter(shooter, balas) {
        this.puntaje += 20;
        balas.destroy();
        shooter.destroy();
        this.muerteEnemigo = this.sound.add('muerteEnemigo', {volume: 0.1});
        this.muerteEnemigo.play();
        this.puntajeText.setText("Puntaje: " + this.puntaje + "/1500");
        if (this.puntaje >= 1500) {
            this.sonido.stop();
            this.scene.start('Boss', { puntaje: this.puntaje, vida: this.vida });
        }
    }
}
export default Nivel3;