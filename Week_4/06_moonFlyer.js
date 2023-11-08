const GAMEHEIGHT = 500;
const GAMEWIDTH = 400;
const ALIVE_STATE = 1;
const DEAD_STATE = 5;
const NUMENEMIES = 6;

let background_spr;

let playerShip_spr;
let fireButton;
let cursors;

let bullet_ary = [];
let nextBulletTime = 0;
const NUMBULLETS = 5;
const BULLET_DELAY = 200;

let enemy_ary = [];

let playing_bool = false;

let start_txt;

let config = {
    type: Phaser.AUTO,
    width: GAMEWIDTH,
    height: GAMEHEIGHT,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

function preload() {
    this.load.image('background_img', 'assets/gameBg.png');
    this.load.image('bullet_img', 'assets/bullet.png');
    this.load.spritesheet('playerShip_sp', 'assets/player_spr186x147.png', {
        frameWidth: 186,
        frameHeight: 147
    });
    this.load.atlas('enemy_sp', 'assets/enemy.png', 'assets/enemy.json');

} //preload();

function create() {
    //  The scrolling moon background
    background_spr = this.add.sprite(0, -GAMEHEIGHT, 'background_img').setOrigin(0, 0);
    // Add named (playerZoosh and playerBang) player animations to the scene animation manager
    this.anims.create({
        key: 'playerZoosh',
        frames: this.anims.generateFrameNumbers('playerShip_sp', {
            start: 0,
            end: 9
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'playerBang',
        frames: this.anims.generateFrameNumbers('playerShip_sp', {
            start: 10,
            end: 21
        }),
        frameRate: 10,
        repeat: 0,
    });
    this.anims.create({
        key: 'enemyBang',
        frames: this.anims.generateFrameNames('enemy_sp'),
        frameRate: 25,
        repeat: 0,
    });

    // setup the player ship
    playerShip_spr = this.add.sprite(GAMEWIDTH / 2, GAMEHEIGHT - 100, 'playerShip_sp');
    playerShip_spr.setOrigin(0.455, 0.5);
    playerShip_spr.anims.load('playerZoosh');

    // Add some controls to play the game with
    cursors = this.input.keyboard.createCursorKeys();

    // Record when space key is pressed
    fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //  Set up an array of bullets
    for (let idx = 0; idx < NUMBULLETS; idx++) {
        bullet_ary[idx] = new Bullet(this, 'bullet_img');
    }
    // set up array of enemies
    for (let idx = 0; idx < NUMENEMIES; idx++) {
        enemy_ary[idx] = new Enemy(this, 'enemy_sp');
    }

    // Create and display the start Text
    start_txt = this.add.text(GAMEWIDTH / 2, 100, ' ', {
        font: '30px Arial',
        fill: '#fff'
    });
    start_txt.setOrigin(0.5, 0.5);
    start_txt.text = "Click to Start";

    //the "click to Start" handler "attached" to the scene (whole browser client area)
    this.input.addListener('pointerdown', startGame, this);

} // create()

function update() {
    if (playing_bool) {
        //  Scroll the background, reset it when it reaches the bottom
        background_spr.y += 2;
        if (background_spr.y >= 0) {
            background_spr.y = -GAMEHEIGHT;
        }
        //Handle the  players ship
        updatePlayer(playerShip_spr, cursors, fireButton);

        // if fire button is down, then see if we can fire a bullet
        //  To avoid them being allowed to fire too fast we set a time limit    
        if ((this.time.now > nextBulletTime) && fireButton.isDown) {
            // Get the first bullet that isn't active
            let bullet_spr = Phaser.Actions.GetFirst(bullet_ary, {
                active: false
            });
            if (bullet_spr) {
                //  And fire it
               bullet_spr.fireMe(playerShip_spr.x, playerShip_spr.y - 18);
                nextBulletTime = this.time.now + BULLET_DELAY;
            }
        }
        // Update the bullets
        for (let bullet_spr of bullet_ary) {
            bullet_spr.updateMe();
        }
        //Update enemies
        for (let enemy_spr of enemy_ary) {
            enemy_spr.updateMe();
            // Check for collisions with each enemy          
            checkCollisionsEnemy(enemy_spr, bullet_ary, playerShip_spr);
        }
    }
} // update()

function checkCollisionsEnemy(enemy_spr, bullet_ary, playerShip_spr) {
    // ignor exploding enemies
    if (enemy_spr.state === ALIVE_STATE) {
        // bullet with enemy
        for (let bullet_spr of bullet_ary) {
            //check to see if the bullet is active /alive
            if (bullet_spr.active) {
                checkCollisionBullet(bullet_spr, enemy_spr);
            }
        }
        // enemy with player
        checkCollisionPlayer(playerShip_spr, enemy_spr);
    }
} // checkCollsionsEnemy()

function checkCollisionBullet(bullet_spr, enemy_spr) {
    //console.log("into checkCollisionBullet ");
    if (collided(bullet_spr, enemy_spr)) {
        // kill the bullet
        bullet_spr. killMe();
        // kill the enemy ship
        enemy_spr.killMe();
    }
} //checkCollisionBullet()

function checkCollisionPlayer(playerShip_spr, enemy_spr) {
    if (collided(playerShip_spr, enemy_spr)) {
        console.log("player and enemy collided");
        //kill the players ship
        killPlayer(playerShip_spr);
        //kill the other ship
        enemy_spr.killMe();
    }
} // checkCollisionPlayer()

function collided(a_spr, b_spr) {
    let bang_bool = false;
    let xDiff, yDiff;
    if (a_spr !== undefined && b_spr !== undefined) {
        xDiff = Math.abs(a_spr.x - b_spr.x);
        yDiff = Math.abs(a_spr.y - b_spr.y);
        bang_bool = (xDiff + yDiff) < 100;
    }
    return (bang_bool);
}// collided()

function startGame() {
    this.input.removeListener('pointerdown', startGame);

    start_txt.visible = false;

    playing_bool = true;

    playerShip_spr.anims.play('playerZoosh');

    startEnemies(this);
} //startGame()

function startEnemies(currentScene) {
    if (playing_bool) {
        let xOffset = Phaser.Math.RND.integerInRange(50, 150);
        let nextDelay = Phaser.Math.RND.integerInRange(1000, 2000);
        for (let idx = 0; idx <= 3; idx++) {
            let enemy_spr = Phaser.Actions.GetFirst(enemy_ary, {
                active: false
            });
            if (enemy_spr) {
                enemy_spr.startMe(xOffset, -50);
                xOffset += 60;
            }
        }
        currentScene.time.delayedCall(nextDelay, startEnemies, [currentScene]);
    }
} //startEnemies()

function gameOver(scene) {
    // reset the bullets and enemies
    for (let bullet_spr of bullet_ary) {
        bullet_spr.initMe();
    }
    for (let enemy_spr of enemy_ary) {
        enemy_spr.initMe();
    }
    start_txt.text = "Click to Start Again";
    scene.input.addListener('pointerdown', startGame, scene);
    start_txt.visible = true;
} // gameOver
