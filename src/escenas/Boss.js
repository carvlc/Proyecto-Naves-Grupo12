class Boss extends Phaser.Scene {
    constructor() {
        super('Boss');
        this.scoreText="";
        this.vida=0;
        this.puntaje=0;
    }
    init(data){
        this.puntaje = data.puntaje;
        this.vida = data.vida;
    }
    preload() {
        this.load.image('final', '../../public/img/fondo-space-1.PNG')
        this.load.spritesheet('boss', '/public/img/buster.png', { frameWidth: 96, frameHeight: 112 })
        this.load.image('red', '../public/img/red.png');
        this.load.image('shoot', '/public/img/shoot.png');
        this.load.image("bossShot","/public/img/shootBoss.png");
        this.load.image('pared1', '/public/img/platform.png')
        this.load.spritesheet('meteoro', '../public/img/meteo.png',{ frameWidth : 34.1, frameHeight: 34});
        this.load.spritesheet('nave', '/public/img/nave.png', { frameWidth: 70, frameHeight: 62 })
        this.load.audio('laser', '../public/sound/blaster.mp3');
        this.load.audio('muerte', '../public/sound/player_death.wav');
        this.load.audio('grito', '../public/sound/grito.mp3');
        this.load.audio('final_boss', '../public/sound/final_boss.mp3');
        this.load.audio('muerte_boss', '../public/sound/dead.wav');
        this.load.image('white', '../public/img/white.png');
    }

    create() {

        this.sonido = this.sound.add('final_boss');
        const soundConfig = {
            volume: 0.3,
            loop: true
        }
        if (!this.sound.locked) {
            this.sonido.play(soundConfig);
        }
        else {
            this.sound.once(Phaser.Sound.Events.UNLOCKED, () =>{
                this.sonido.play(soundConfig);
            })
        }

        this.grito = this.sound.add('grito');
        const soundConfig1 = {
            volume: 0.5,
            loop: true
        }
        if (!this.sound.locked) {
            this.grito.play(soundConfig1)
        }
        else {
            this.sound.once(Phaser.Sound.Events.UNLOCKED, () =>{
                this.grito.play(soundConfig1)
            })
        }

        this.reload = true;
        this.balas = this.physics.add.group();
        this.skyline = this.add.blitter(0, 0, 'final');
        this.skyline.create(0, 0);
        this.skyline.create(0, -800);
        this.enemy = this.physics.add.sprite(400, 128, 'boss', 0);
        this.enemy.setBodySize(100, 100);
        this.enemy.state=50;

        this.enemyMoving = this.tweens.add({
            targets: this.enemy.body.velocity,
            props: {
                x: { from: 200, to: -200, duration: 4000 },
                y: { from: 50, to: -50, duration: 2000 }
            },
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        

        this.player = this.physics.add.sprite(400, 540, 'nave');
        this.player.setCollideWorldBounds(true);
        this.player.setRotation(4.71239);

       // this.bossShot();
        this.time.addEvent({
            delay: 2000,
            callback:this.bossShot,
            callbackScope: this,
            repeat: -1
        })

        this.physics.add.overlap(this.enemy, this.balas, (enemy, balas) =>
        {
            this.puntaje += 10;
            enemy.setTint(0xff0304);
            this.time.addEvent({
                delay: 100,
                callbackScope: this,
                callback: function () {
                    enemy.setTint();
                }
    
            })
            this.scoreText.setText('Puntaje: ' + this.puntaje)
            enemy.state -= 1;
            balas.disableBody(true, true);

            if (enemy.state <= 0)
            {
                enemy.setFrame(6);
                enemy.body.checkCollision.none = true;
                this.enemyMoving.stop();
                this.enemy.stop();
                this.grito.stop();
                this.dead = this.sound.add('muerte_boss', {volume: 0.1});
                this.dead.play();
                this.time.addEvent({
                    delay: 4000,
                    callback:() =>{this.scene.start('Win',{ puntaje: this.puntaje }),this.sonido.stop()},
                    callbackScope: this,
                    repeat: -1
                })
            }
        });

        this.time.addEvent({
            delay: 1000,
            callback:  this.bossLoad,
            callbackScope: this,
            repeat: -1
        })
        
        this.llamas = this.add.particles(0, 0, 'white',
        {
            color: [ 0xfacc22, 0xf89800, 0xf83600, 0x9f0404 ],
            colorEase: 'quad.out',
            lifespan: 1000,
            angle: { min: 85, max: 95 },
            scale: { start: 0.40, end: 0, ease: 'sine.out' },
            speed: 200,
            advance: 2000,
            blendMode: 'ADD'
        });
        
        this.llamas.startFollow(this.player,0,20);

        // se crean paredes para eliminar elementos fuera del mundo
        this.paredes1 = this.physics.add.staticGroup();
        this.paredes1.create( this.game.config.width / 2, -100, 'pared1').setScale(2).refreshBody()
        this.paredes1.create(this.game.config.width / 2,this.game.config.height + 200, 'pared1').setScale(2).refreshBody()
    
        // para el movimiento player
        this.anims.create({
            key: 'izquierda1',
            frames: [{ key: 'nave', frame: 2 }],
            frameRate: 10
        });
        this.anims.create({
            key: 'quieto1',
            frames: [{ key: 'nave', frame: 0 }],
            frameRate: 20
        })
        this.anims.create({
            key: 'derecha1',
            frames: [{ key: 'nave', frame: 1 }],
            frameRate: 10
        })
        this.anims.create({
            key: 'arriba1',
            frames: [{ key: 'nave', frame: 0 }],
            frameRate: 10
        })
        this.anims.create({
            key: 'abajo1',
            frames: [{ key: 'nave', frame: 0 }],
            frameRate: 10
        })

        this.anims.create({
            key: 'bossAnimacion',
            frames: this.anims.generateFrameNames('boss', {star: 0, end:5}),
            frameRate: 10,
        })

        this.createMeteoro();

        this.time.addEvent({
            delay: 300,
            callback: this.createMeteoro,
            callbackScope: this,
            repeat: -1
        })

        this.anims.create({
            key: 'meteoritoAnimacion',
            frames: this.anims.generateFrameNames('meteoro', {star: 0, end:26}),
            frameRate: 10,
        })

        this.enemy.play({key:'bossAnimacion', repeat: -1});

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.balas, this.paredes1, this.outBullet, null, this);
        this.scoreText = this.add.text(16, 16, 'Score: ' + this.puntaje, { fontSize: '32px', fill: '#FFFFFF' });
        this.vidaText = this.add.text(16, 50, "vida: " + this.vida + '%', { fontSize: '32px', fill: '#FFFFFF' });
    }

    update() {

        this.skyline.y += 1;
        this.skyline.y %= 800;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-400);
            this.player.anims.play('izquierda1');
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(400);
            this.player.anims.play('derecha1');
        }
        else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-500);
            this.player.anims.play('arriba1')
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(500)
            this.player.anims.play('abajo1')
        }
        else {
            this.player.setVelocityY(0);
            this.player.setVelocityX(0);
            this.player.anims.play('quieto1', true)
        }
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
                delay: 1500,
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
        let bala = this.balas.create(this.posicionPlayer.x + 10, this.posicionPlayer.y, 'shoot');
        bala.setRotation(4.71239);
        bala.body.velocity.y = -600;
        let bala2 = this.balas.create(this.posicionPlayer.x + 50, this.posicionPlayer.y , 'shoot');
        bala2.body.velocity.y = -600;
        bala2.setRotation(4.71239);
    }
    bossLoad(){
        this.loadAtack = this.add.particles(0, 15, 'red', {
            speed: 50,
            lifespan: 1000,
            angle: { min: 90, max: 270},
            scale: { start: 1, end: 0 },
            advance: 1000,
            blendMode: 'ADD',
        });
        this.loadAtack.startFollow(this.enemy);
    }
    bossShot(){
        this.disparosBoss=this.physics.add.group();
        this.posicionEnemy = this.enemy.body.position;
        this.disparoBoss = this.disparosBoss.create(this.posicionEnemy.x +80 , this.posicionEnemy.y +120, 'bossShot');
        this.disparoBoss.body.velocity.y = +600;
        this.disparoBoss.checkWorldBounds= true;

        this.physics.add.overlap(this.player, this.disparoBoss, this.hitBoss, null, this);
        this.physics.add.collider(this.disparoBoss, this.paredes1, this.outBossShot, null, this);
    }

    createMeteoro() {
    
        let meteoroVertical = 0;

        for (let i = 0; i < 1; i++) {
            let meteoroPosicionAncho = Phaser.Math.Between(35, 765);
            this.meteoro = this.physics.add.sprite(meteoroPosicionAncho, meteoroVertical, 'meteoro');
            this.meteoro.body.velocity.y = +200;

            this.meteoro.play({key:'meteoritoAnimacion', repeat: -1});

            this.physics.add.overlap(this.player, this.meteoro, this.hitmeteoro, null, this);
            this.physics.add.collider(this.meteoro, this.paredes1, this.outMeteoro, null, this);
            this.physics.add.overlap(this.meteoro,this.balas,this.bulletmeteor,null,this);
        }
    }

    outBullet(balas) {
        balas.destroy();
        //console.log('se elimino la bala')
    }
    bulletmeteor(balas,meteoro){
        meteoro.destroy();
    }   
    outMeteoro(meteoro) {
        meteoro.destroy();
        //console.log('se elimino el meteoro')
    }

    outBossShot(disparoBoss) {
        this.disparoBoss.destroy();
        console.log('se elimino el tiro')
    }

    hitBoss(disparoBoss,player){
        this.disparoBoss.destroy();
        console.log("auchie auch");
        this.vida=this.vida-25;
        this.vidaText.setText("Vida: "+this.vida+"%");
        player.setTint(0xff0000)
            this.time.addEvent({
                delay: 400,
                callbackScope: this,
                callback: function () {
                    player.setTint();
                }
            })
        if(this.vida ==0){
            this.sound.play('muerte');
            this.sonido.stop();
            this.grito.stop();
            this.scene.start("GameOver",{puntaje: this.puntaje});
        }

    }

    hitmeteoro(player,meteoro){
        meteoro.destroy();
        this.vida=this.vida-25;
        this.vidaText.setText("Vida: "+this.vida+"%");
        player.setTint(0xff0000)
            this.time.addEvent({
                delay: 400,
                callbackScope: this,
                callback: function () {
                    player.setTint();
                }
            })     
        if(this.vida ==0){
            this.sound.play('muerte');
            this.sonido.stop();
            this.grito.stop();
            this.scene.start("GameOver",{puntaje: this.puntaje});
        }
    }
}
export default Boss;