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
        this.load.image('final', '../../public/img/fondo5.png')
        this.load.spritesheet('boss', '/public/img/buster.png', { frameWidth: 96, frameHeight: 112 })
        this.load.image('red', '/public/img/red.png')
        this.load.image('shoot', '/public/img/shoot.png')
        this.load.image('shootenemy', '/public/img/shootEnemy.png')
        this.load.spritesheet('nave', '/public/img/nave.png', { frameWidth: 70, frameHeight: 62 })
    }

    create() {
        this.reload = true;
        this.balas = this.physics.add.group();
        this.bala;


        this.stars = this.add.blitter(0, 0, 'final');
        this.stars.create(0, 0);
        this.stars.create(0, -600);

        this.enemy = this.physics.add.sprite(400, 128, 'boss', 1);
        // this.enemy.anims.play('bossAnimation');
        this.enemy.setBodySize(160, 64);
        this.enemy.state=10;

        this.enemyMoving = this.tweens.add({
            targets: this.enemy.body.velocity,
            props: {
                x: { from: 150, to: -150, duration: 4000 },
                y: { from: 50, to: -50, duration: 2000 }
            },
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        const particles = this.add.particles(0, 15, 'red', {
            speed: 50,
            angle: { min: 45, max: 135 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',

        });

        this.physics.add.overlap(this.enemy, this.balas, (enemy, balas) =>
        {
            // const { x, y } = balas.body.center;

            enemy.state -= 1;
            balas.disableBody(true, true);

            if (enemy.state <= 0)
            {
                enemy.setFrame(6);
                enemy.body.checkCollision.none = true;
                this.enemyMoving.stop();
                this.enemy.stop();
            }
        });

        this.player = this.physics.add.sprite(400, 540, 'nave');
        this.player.setCollideWorldBounds(true);
        this.player.setRotation(4.71239);
        particles.startFollow(this.player);


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

        this.enemy.play({key:'bossAnimacion', repeat: -1});

        this.cursors = this.input.keyboard.createCursorKeys();
 
        this.scoreText = this.add.text(16, 16, 'Score: ' + this.puntaje, { fontSize: '32px', fill: '#FFFFFF' });
        this.vidaText = this.add.text(16, 50, "vida: " + this.vida + '%', { fontSize: '32px', fill: '#FFFFFF' });

    }

    update() {

        this.stars.y += 1;
        this.stars.y %= 600;

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
        let bala = this.balas.create(this.posicionPlayer.x + 35, this.posicionPlayer.y, 'shoot');
        bala.setRotation(4.71239);
        bala.body.velocity.y = -600;
        bala.checkWorldBounds= true;

        bala.on('outOfBounds', () => {
            bala.destroy();
            console.log('se elimina');
        });
    }

            // this.physics.add.overlap(this.player, this.enemy, this.hitenemy, null, this);
            // this.physics.add.collider(this.enemy,this.balas,this.hitbullet, null, this);
}
export default Boss;