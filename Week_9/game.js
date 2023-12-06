/*
 * Module entry Point
 */

import { Npc } from './modules/npcC.js';
import { Player } from './modules/playerC.js';

const ROWS = 20;
const COLUMNS = 20;
const TILEWIDTH = 32;

const PLAYER_STATE_EVENT = 'playerstate';
const PLAYER_MOVE_EVENT = 'playermove';

const world = {
    scene:null,
    cursors: null,
    map: null,
    groundLayer: null,
    wallsLayer: null,
    thingsLayer: null,
    player_spr: null,
    npc_spr: null,
    gameEmitter:null
}; // end of world

const config = {
    type: Phaser.AUTO,
    width: COLUMNS * TILEWIDTH,
    height: ROWS * TILEWIDTH,
    parent: 'phaser-AI example',
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

let game = new Phaser.Game(config);

function preload() {
    this.load.tilemapTiledJSON('groundLevel', 'assets/world.json');
    this.load.image('gameTiles', 'assets/tiles.png');
    this.load.spritesheet('player', 'assets/player.png', {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.spritesheet('zombie', 'assets/zombie.png', {
        frameWidth: 32,
        frameHeight: 32
    });
} //preload();

function create() {
    // create "shared" event emitter for the game
    world.gameEmitter = new Phaser.Events.EventEmitter();
    world.cursors = this.input.keyboard.createCursorKeys();
    buildWorld(this, world); 
    world.player_spr = new Player(world, 50, 100, 'player');
    // Add some zombies
    world.npc_spr = new Npc(world, 50, 25, 'zombie');   
} // create()

function buildWorld(scene, world) {
    // Initialise the tilemap
    world.map = scene.make.tilemap({
        key: 'groundLevel'
    });
    world.tileSet = world.map.addTilesetImage('tiles', 'gameTiles');
    // set up the tilemap layers
    world.groundLayer = world.map.createLayer('groundLayer', world.tileSet);
    world.wallsLayer = world.map.createLayer('wallsLayer', world.tileSet);
    // set physics boundaries
    scene.physics.world.setBounds(0, 0, world.map.widthInPixels, world.map.heightInPixels);

    // enable collision handling
    world.wallsLayer.setCollisionBetween(1, 300);
    world.thingsLayer = world.map.createLayer('thingsLayer',world.tileSet);
     world.scene= scene;
} //buildWorld()

function update() {
    world.player_spr.updateMe(world);
} // end of update()
export{PLAYER_STATE_EVENT, PLAYER_MOVE_EVENT}
