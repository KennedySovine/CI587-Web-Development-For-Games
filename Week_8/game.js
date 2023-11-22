let world = {
    health_txt: null,
    cursors: null,
    map: null,
    tileset: null,
    groundLayer: null,
    blockLayer: null,
    aboveLayer: null,
    player_spr: null,
    flower_grp: null
}; // end of world

let config = {
    type: Phaser.AUTO,
    width: 800, // Canvas width in pixels
    height: 800, // Canvas height in pixels
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

function preload() {
    this.load.tilemapTiledJSON('groundLevel', 'assets/world.json');
    this.load.image('gameTiles', 'assets/mountain_landscape.png');
    this.load.spritesheet('flower', 'assets/flower.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.spritesheet('player', 'assets/player.png', {
        frameWidth: 32,
        frameHeight: 32
    });
} //end of preload()

function create() {
    world.cursors = this.input.keyboard.createCursorKeys();
    buildWorld(this, world);
// add camera
    this.cameras.main.setBounds(0, 0, world.map.widthInPixels, world.map.heightInPixels);
    // set physics boundaries
    this.physics.world.setBounds(0, 0, world.map.widthInPixels, world.map.heightInPixels);
    
    world.player_spr = new Player(this, 50, 200, 'player');
    //collision checking on each frame
    this.physics.add.collider(world.player_spr, world.blockLayer);
    this.physics.add.collider(world.player_spr, world.groundLayer);
    this.cameras.main.startFollow(world.player_spr, true, 0.05, 0.05);
} // create()

function buildWorld(scene, world) {
    // Initialise the tilemap
    world.map = scene.make.tilemap({
        key: 'groundLevel'
    });
   // create a tileset and add it to the tilemap
   world.tileSet = world.map.addTilesetImage('mountain_landscape', 'gameTiles');
   // set up the tilemap layers
   world.groundLayer = world.map.createLayer('groundLayer', world.tileSet);
   world.blockLayer = world.map.createLayer('blockLayer', world.tileSet);
   world.aboveLayer = world.map.createLayer('aboveLayer', world.tileSet);
   world.aboveLayer.setDepth(10); // force this layer to be above the player

   // Add the flowers (grid id 168) based on the infomation in the
   // tilemap objects layer
   world.map.createFromObjects('objectLayer1', {gid:168,
       key: 'flower'
   });

    // enable collision handling in blockLayer
    world.blockLayer.setCollisionByProperty({
        collides: true
    });

    // Add a callback function to any tile with the specified tileID 
    // in the specified layer
    world.groundLayer.setTileIndexCallback([168, 12, 13, 14, 28, 29,
                                            30, 44, 45, 46], onSomething, this, );
    world.blockLayer.setTileIndexCallback([152, 133, 134, 117, 118], onSomething, this, );

    // Add the health text - set it so it moves with the camera
    world.health_txt = scene.add.text(10, 10, 'Health goes here', {
        font: '34px Arial',
        fill: '#fff'
    }).setScrollFactor(0);
} //end of buildWorld()

// Callback function called when  a sprite is over a tile with a specified Index
function onSomething(sprite, tile) {
    console.log("Some Thing " + JSON.stringify(tile.properties));
    //TBS check whether the tile has a property "health" (specified in tiled)
    //TBS And sprite has an updateHealth method, if so call the sorites updateHelath method
    // Return false to stop default collision handling
    return false;
} // end of onSomething()

function update() {
    // reset the player motion
    world.player_spr.setVelocity(0);
    // Check the keys and update movement if required
    if (world.cursors.left.isDown) {
        world.player_spr.moveLeft();
    } else if (world.cursors.right.isDown) {
        world.player_spr.moveRight();
    } else if (world.cursors.up.isDown) {
        world.player_spr.moveUp();
    } else if (world.cursors.down.isDown) {
        world.player_spr.moveDown();
    } else {
        world.player_spr.standStill();
    }
    // TBS update the health display
} // end of update()

let game = new Phaser.Game(config);
