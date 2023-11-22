let world = {
    ROWS: 10,
    COLUMNS: 10,
    TILEWIDTH: 32,
    //map define inital layout of _world
    l1Surface_ary: [
		[0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
		[0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 0, 0, 1, 1, 1, 0, 0],
		[0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
		[0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    // identify location and type of items
    l1Item_ary: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 2, 1, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 3, 0, 1, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
		[0, 0, 0, 2, 0, 1, 0, 0, 0, 0],
		[0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
		[0, 0, 0, 1, 0, 0, 0, 0, 0, 0]],
    player_spr: null
}; // end of world

let cursors

let config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: world.COLUMNS * world.TILEWIDTH,
    height: world.ROWS * world.TILEWIDTH,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

function preload() {
    this.load.atlasXML('player', 'assets/newPlayer.png', 'assets/newPlayer.xml');
    this.load.atlasXML('tiles', 'assets/tiles.png', 'assets/tiles.xml');
    this.load.atlasXML('items', 'assets/items.png', 'assets/items.xml');
}//preload();

function create() {
    buildWorld(this, world);
    //  Add some controls to play the game with
    cursors = this.input.keyboard.createCursorKeys();
}// create()

function buildWorld(scene, world) {
    for (let rowIdx = 0; rowIdx < world.ROWS; rowIdx++) {
        for (let colIdx = 0; colIdx < world.COLUMNS; colIdx++) {
            let tileFrm_str = "tile000" + world.l1Surface_ary[rowIdx][colIdx];
            scene.add.sprite(colIdx * world.TILEWIDTH, rowIdx * world.TILEWIDTH, 'tiles', tileFrm_str);
            // Add items
            itemNum = world.l1Item_ary[rowIdx][colIdx];
            if (itemNum !== 0) {
                let itemFrm_str = "item000" + itemNum;
                scene.add.sprite(colIdx * world.TILEWIDTH, rowIdx * world.TILEWIDTH, 'items', itemFrm_str);
            }
        } // end of colIdx
    } // end of rowIdx
    world.player_spr = scene.add.sprite(colToXpx(world, 4), rowToYPx(world, 3), 'player');
} //buildWorld()

function update() {
    let stuck_bool = false;
    let playerNextLeftCol;
    let playerNextRightCol;
    let playerNextTopRow;
    let playerNextBottomRow;

    let newXpos = world.player_spr.x;
    let newYpos = world.player_spr.y;
    //  Check for movement keys
    if (cursors.left.isDown) {
        world.player_spr.setFrame("newPlayer0001");
        newXpos = world.player_spr.x - 2;
    } else if (cursors.right.isDown) {
        world.player_spr.setFrame("newPlayer0002");
        newXpos = world.player_spr.x + 2;
    } else if (cursors.down.isDown) {
        world.player_spr.setFrame("newPlayer0000");
        newYpos = world.player_spr.y + 2;
    } else if (cursors.up.isDown) {
        world.player_spr.setFrame("newPlayer0003");
        newYpos = world.player_spr.y - 2;
    } else {
        world.player_spr.setFrame("newPlayer0000");;
    }

    //Look for collisions, first work out where it wants to go
    playerNextLeftCol = xPxToCol(world, newXpos + 5);
    playerNextRightCol = xPxToCol(world, newXpos + world.player_spr.width - 5);
    playerNextTopRow = yPxToRow(world, newYpos + 5);
    playerNextBottomRow = yPxToRow(world, newYpos + world.player_spr.height - 5);
    // check top left
    if (world.l1Item_ary[playerNextTopRow][playerNextLeftCol] !== 0) {
        console.log("crash top left", world.l1Item_ary[playerNextTopRow][playerNextLeftCol]);
        stuck_bool = true;
    }
    // check top right
    if (world.l1Item_ary[playerNextTopRow][playerNextRightCol] !== 0) {
        console.log("crash top right", world.l1Item_ary[playerNextTopRow][playerNextRightCol]);
        stuck_bool = true;
    }
    // check bottom left
    if (world.l1Item_ary[playerNextBottomRow][playerNextLeftCol] !== 0) {
        console.log("crash bottom left", world.l1Item_ary[playerNextBottomRow][playerNextLeftCol]);
        stuck_bool = true;
    }
    // check bottom right
    if (world.l1Item_ary[playerNextBottomRow][playerNextRightCol] !== 0) {
        console.log("crash bottom Right", world.l1Item_ary[playerNextBottomRow][playerNextRightCol]);
        stuck_bool = true;
    }
    if (!stuck_bool) {
        //update position
        world.player_spr.x = newXpos;
        world.player_spr.y = newYpos;
    }
} // update()

let game = new Phaser.Game(config);
