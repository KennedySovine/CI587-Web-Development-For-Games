const GAMEHEIGHT = 500;
const GAMEWIDTH = 400;
var playerShip_spr;
var bulletGroup;

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
    this.load.image('ship_img', 'assets/ship.png');
    this.load.image('bullet_img', 'assets/bullet.png');
} //preload();

function create() {
    playerShip_spr = this.add.existing(new Klingon(this, 200, 200, "ship_img"));
    //  Add some controls to play the game with
    cursors = this.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    bulletGroup = this.add.group();
    // debug info
    this.debug_txt = this.add.text(20, 20, 'DebugInfo', {
        fontFamily: 'Arial',
        fontSize: 20,
        color: '#00ff00'
    });
} // create()

function update() {
    var bullet_ary;
    //  Check for movement keys
    /*if (cursors.left.isDown) {
        playerShip_spr.rotation -= .1;
    } else if (cursors.right.isDown) {
        playerShip_spr.rotation += .1;
    }*/
    playerShip_spr.updateMe(cursors);
    //  Player Firing?
    if (fireButton.isDown) {
        playerShip_spr.fire(bulletGroup);
    }
    bullet_ary = bulletGroup.getChildren();
    // Update the bullets
    for (let bullet_spr of bullet_ary) {
        bullet_spr.updateMe();
    }
    //Temporary debug info
    let debug_str = 'rotation: ' + playerShip_spr.rotation.toPrecision(3) + ' angle: ' 
    + playerShip_spr.angle.toPrecision(3);
    this.debug_txt.setText(debug_str);
} // update()
