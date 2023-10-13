class Nivel3 extends Phaser.Scene {
    constructor() {
        super('Nivel3');
        this.vida = 100;
        this.puntaje = 0;
    }
    preload() {
        this.load.image('sky', '../../public/img/fondo-space-1.PNG')
        this.load.image('enemy', '/public/img/enemy.png')
        this.load.image('red', '/public/img/cyan.png')
        this.load.image('minicyan', '/public/img/mini-cyan.png')
        this.load.image('shoot', '/public/img/shoot4.png')
        this.load.image('shoot2', '/public/img/shoot3.png')
        this.load.image('shootenemy', '/public/img/shootEnemy.png')
        this.load.spritesheet('nave', '/public/img/nave4.png', { frameWidth: 60, frameHeight: 56 })
    }

    create() {
        this.healCount=0;
        this.reload = true;
        this.reloadEnemy = true;
        this.balas = this.physics.add.group();
        this.balasEnemy = this.physics.add.group();
        this.bala;

        this.add.image(400, 300, 'sky');
        const particles = this.add.particles(0, 0, 'red', {
            speed: 200,
            angle: { min: 170, max: 190 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
        });


        this.player = this.physics.add.sprite(100, 200, 'nave');
        this.player.setCollideWorldBounds(true);
        particles.startFollow(this.player);

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
            callback:  this.createEnemy,
            callbackScope: this,
            repeat: -1
        })
        this.createShooter();
        this.time.addEvent({
            delay: 1500,
            callback:  this.createShooter,
            callbackScope: this,
            repeat: -1
        })
        this.time.addEvent({
            delay: 5000,
            callback:  this.createHealer,
            callbackScope: this,
            repeat: -1
        })

        this.vidaText = this.add.text(16, 16, 'vida: 100%', { fontSize: '32px', fill: '#fff' })
        this.puntajeText = this.add.text(16, 40, 'puntaje: 0/1000', { fontSize: '32px', fill: '#fff' })
    }

    update() {
     
        this.hitCheck=true;
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
        console.log(this.posicionPlayer);
        this.bala = this.balas.create(this.posicionPlayer.x + 70, this.posicionPlayer.y + 31, 'shoot');
        this.bala.body.velocity.x = 400;
    }
 
  
    createEnemy() {
        let enemyOrigenHorizontal = 900;
         
        // let enemyGroup = this.physics.add.group();
        for (let i = 0; i < 1; i++) {
            let enemyOrigenVertical = Phaser.Math.Between(31, 569);

            this.enemy = this.physics.add.sprite(enemyOrigenHorizontal, enemyOrigenVertical, "enemy");            
            this.enemy.checkWorldBounds = true;
            this.enemy.body.velocity.x = -300;
            this.enemy.body.position.x = this.enemy.body.position.x;
            console.log(this.enemy.body.position.x)
     
            this.enemy.on('outOfBounds', () => {
                console.log('mensaje')
                this.enemy.destroy();
            });
        
            this.physics.add.overlap(this.player, this.enemy, this.hitenemy, null, this);         
            this.physics.add.collider(this.enemy, this.balas, this.hitbullet, null, this);
        }
    }
    createHealer(){
        let healerOrigenHorizontal = 900;

        for (let i = 0; i < 1; i++) {
            let healerOrigenVertical = Phaser.Math.Between(31, 569);

            this.healer = this.physics.add.sprite(healerOrigenHorizontal, healerOrigenVertical, "enemy"); 
            this.healer.setTint(0x90ee90);           
            this.healer.checkWorldBounds = true;
            this.healer.body.velocity.x = -300;
            this.healer.body.position.x = this.healer.body.position.x;
            console.log(this.healer.body.position.x)

            this.physics.add.collider(this.healer, this.balas, this.heal, null, this);
        }
    }
    // se crea nave que dispara
    createShooter(){
        let shooterOrigenHorizontal = 900;
        // let shooterGroup = this.physics.add.group();
        for (let i = 0; i < 2; i++) {
            let shooterOrigenVertical = Phaser.Math.Between(31, 569);

            this.shooter = this.physics.add.sprite(shooterOrigenHorizontal, shooterOrigenVertical, "enemy");            
            this.shooter.setTint(0xff0075);
            this.shooter.body.velocity.x = -200;
            this.shooter.body.position.x = this.shooter.body.position.x;
            this.shooter.checkWorldBounds = true;
            this.enemyShoot();
      
                this.physics.add.overlap(this.player, this.shooter, this.hitShooter, null, this);
                this.physics.add.overlap(this.balas, this.balasEnemy, this.collideBullet, null, this);      
                this.physics.add.overlap(this.player, this.balasEnemy, this.hitenemyBullet, null, this);      
                this.physics.add.collider(this.shooter, this.balas, this.shootShooter, null, this);
        }
    }
       //disparos del enemigo
       enemyShoot(){

        this.posicionShooter = this.shooter.body.position;
        console.log(this.posicionShooter);
        this.balaenEmigo = this.balasEnemy.create(this.posicionShooter.x -10, this.posicionShooter.y +31 , 'shoot2');
        this.balaenEmigo.body.velocity.x =-300;
    }

    
    // colisiones
    heal(balas,healer){
        balas.destroy();
        healer.destroy();
        if(this.vida <100)
        {    
            console.log("te curaste boludo qliao")
        this.healCount+=1;
        console.log(this.healCount)
        this.vida=100;
        this.vidaText.setText('Vida: ' + this.vida + '%');
        this.player.setTint(0x90ee90);
        this.time.addEvent({
            delay: 400,
            callbackScope: this,
            callback:function(){
                this.player.setTint();
            }
        
        })}
    }
    collideBullet(balas,balasEnemy){
        balasEnemy.destroy();
        balas.destroy();
    }  
    hitShooter(player,shooter){
        shooter.destroy();
        this.vida -= 25;
        this.vidaText.setText('Vida: ' + this.vida + '%');
        player.setTint(0xff0304);
        this.time.addEvent({
            delay: 400,
            callbackScope: this,
            callback:function(){
                player.setTint();
            }
        
        })
        if (this.vida == 0) {
            this.vida = 100;
            this.scene.start('GameOver');
           
        }
    }
    
    hitenemy(player,enemy) {
        enemy.destroy();
        this.vida -= 25;
        this.vidaText.setText('Vida: ' + this.vida + '%');
        player.setTint(0xff0304);
        this.time.addEvent({
            delay: 400,
            callbackScope: this,
            callback:function(){
                player.setTint();
            }
        
        })
        if (this.vida == 0) {
            this.vida = 100;
            this.scene.start('GameOver');
           
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
            callback:function(){
                player.setTint();
            }
        
        })
        if (this.vida == 0) {
            this.vida = 100;
            this.scene.start('GameOver');
           
        }
    }
  
    hitbullet(enemy,balas) {
        console.log("funca");
        this.puntaje += 10;
        balas.destroy();
        // this.particles2.destroy();
        enemy.destroy();
        this.puntajeText.setText("Score: " + this.puntaje + "/1000");
        if (this.puntaje >= 700 ) {
            this.scene.start('Boss');
        }
    }
    
    shootShooter(shooter,balas) {
        console.log("funca");
        this.puntaje += 20;
        balas.destroy();
        // this.particles2.destroy();
        shooter.destroy();
        this.puntajeText.setText("Score: " + this.puntaje + "/1000");
        if (this.puntaje >= 700 ) {
            this.scene.start('Boss');
         }
    }
}
export default Nivel3;