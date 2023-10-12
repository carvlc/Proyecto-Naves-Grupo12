class Nivel2 extends Phaser.Scene {
    constructor() {
        super('Nivel2');
        this.scoreText="";
        this.vida=0;
        this.puntaje=0;
    }
    init(data){
        this.puntaje = data.puntaje;
        this.vida = data.vida;
    }
    preload() {
        this.load.image('space', '../../public/img/space3.png')
        this.load.image('enemy', '/public/img/enemy.png')
        this.load.image('red', '/public/img/red.png')
        this.load.image('shoot', '/public/img/shoot.png')
        this.load.image('shootenemy', '/public/img/shootEnemy.png')
        this.load.spritesheet('nave', '/public/img/nave.png', { frameWidth: 70, frameHeight: 62 })
    }

    create() {
        this.reload = true;
        this.balas = this.physics.add.group();
        this.bala;



        this.add.image(400, 300, 'space');
        const particles = this.add.particles(-15, 0, 'red', {
            speed: 50,
            angle: { min: 90, max: 275 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',

        });

        this.player = this.physics.add.sprite(100, 200, 'nave');
        this.player.setCollideWorldBounds(true);
        particles.startFollow(this.player);

        //para el movimiento player
        this.anims.create({
            key: 'izquierda',
            frames: [{ key: 'nave', frame: 0 }],
            frameRate: 10
        });
        this.anims.create({
            key: 'quieto',
            frames: [{ key: 'nave', frame: 0 }],
            frameRate: 20
        })
        this.anims.create({
            key: 'derecha',
            frames: [{ key: 'nave', frame: 0 }],
            frameRate: 10
        })
        this.anims.create({
            key: 'arriba',
            frames: [{ key: 'nave', frame: 2 }],
            frameRate: 10
        })
        this.anims.create({
            key: 'abajo',
            frames: [{ key: 'nave', frame: 1 }],
            frameRate: 10
        })

        this.cursors = this.input.keyboard.createCursorKeys();

        // para los enemigos
        this.createEnemy();

        this.time.addEvent({
            delay: 500,
            callback: this.createEnemy,
            callbackScope: this,
            repeat: -1
        })

        
        this.scoreText = this.add.text(16, 16, 'Puntaje: ' + this.puntaje + '/250', { fontSize: '32px', fill: '#FFFFFF' });
        this.vidaText = this.add.text(16, 50, "Vida: " + this.vida + '%', { fontSize: '32px', fill: '#FFFFFF' });

    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-400);
            this.player.anims.play('izquierda');
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(400);
            this.player.anims.play('derecha');
        }
        else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-500);
            this.player.anims.play('arriba')
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(500)
            this.player.anims.play('abajo')
        }
        else {
            this.player.setVelocityY(0);
            this.player.setVelocityX(0);
            this.player.anims.play('quieto', true)
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
        let bala = this.balas.create(this.posicionPlayer.x + 70, this.posicionPlayer.y + 31, 'shoot');
        bala.body.velocity.x = 600;
        bala.checkWorldBounds= true;

        bala.on('outOfBounds', () => {
            bala.destroy();
            console.log('se elimina');
        });
    }

    createEnemy() {
    
        let enemyDistanciaHorizontal = 800;

        for (let i = 0; i < 1; i++) {
            let enemyPosicionAltura = Phaser.Math.Between(31, 569);
            this.enemy = this.physics.add.sprite(enemyDistanciaHorizontal, enemyPosicionAltura, 'enemy');
            this.enemy.body.velocity.x = -200;
            this.enemy.checkWorldBounds= true;

            if(this.enemy.body.position.x<0){
                console.log("boooooooom")
                this.enemy.destroy();
            }
            this.physics.add.overlap(this.player, this.enemy, this.hitenemy, null, this);
            this.physics.add.collider(this.enemy,this.balas,this.hitbullet, null, this);
        }
    }

    hitenemy(player,enemy){
        enemy.destroy();
        this.vida=this.vida-25;
        this.vidaText.setText("Vida: "+this.vida+"%");     
        if(this.vida ==0){
            this.scene.start("GameOver",{puntaje: this.puntaje});
            player.setTint(0xff0000);
        }
    }
    
    hitbullet(enemy,bala){
        this.score=this.score+10;
        bala.destroy();
        enemy.destroy();
        this.scoreText.setText("Puntaje: "+this.puntaje+"/250");  
        if(this.puntaje==250){
            this.scene.start("Boss",{puntaje: this.puntaje, vida: this.vida});
        }
    }
}
export default Nivel2;