const GAMEHEIGHT = 500;
const GAMEWIDTH = 400;

var background_spr;
var playerShip_spr;
var fireButton;
var cursors;

let config = {
    type: Phaser.AUTO,
    width: GAMEWIDTH,
    height: GAMEHEIGHT,
    scene: {
        preload: preload,
        create: create,
        update
    }
};

let game = new Phaser.Game(config);

function preload() {
    this.load.image('background_img', 'assets/gameBg.png');

    this.load.spritesheet('playerShip_sp', 'assets/player_spr186x147.png', {
        frameWidth: 186,
        frameHeight: 147
    });
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

    // setup the player ship
    playerShip_spr = this.add.sprite(GAMEWIDTH / 2, GAMEHEIGHT - 100, 'playerShip_spr');

    playerShip_spr.anims.load('playerZoosh');
    playerShip_spr.play('playerZoosh');

    // Add some controls to play the game with
    cursors = this.input.keyboard.createCursorKeys();

    // Record when space key is pressed
    fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


} // end of create()

function update() {
    //  Scroll the background, reset it when it reaches the bottom
    background_spr.y += 2;
    if (background_spr.y >= 0) {
        background_spr.y = -GAMEHEIGHT;
    }
    //Handle the  players ship
    updatePlayer(playerShip_spr, cursors, fireButton);
} //end of update()
