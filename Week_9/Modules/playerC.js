
import {PLAYER_STATE_EVENT, PLAYER_MOVE_EVENT} from "../game.js";
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(world, xPos, yPos, texture) {
        super(world.scene, xPos, yPos, texture);
        // had to do this to create a physics body
        let scene=this.scene;
        scene.physics.add.existing(this);
        //set up the physics properties
        this.setCollideWorldBounds(true);
        //add the walking animations
        scene.anims.create({
            key: 'walkDown',
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load('walkDown');
        scene.anims.create({
            key: 'walkDown',
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load('walkDown');
        scene.anims.create({
            key: 'walkLeft',
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 3,
                end: 5
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load('walkLeft');
        scene.anims.create({
            key: 'walkRight',
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 6,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load('walkRight');
        scene.anims.create({
            key: 'walkUp',
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 9,
                end: 11
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load('walkUp');

        //Setup callback for tiles containing interesting things
        world.map.setTileIndexCallback([31, 47], this._itemHandler, this, world.thingsLayer);

        // pseudo private properites
        this._VELOCITY = 30;
        this._health = 100;
        this._healthUpdateAllowed_bool = true;
        this._state_str = "normal";
        this._gameEmitter=world.gameEmitter;

        // Add this to the scene to make it visible/active etc
        scene.add.existing(this);
    } // end of constructor()


    // Updates the  "private" health property
    updateHealth(change) {
        // only updates the health at intervals
        if (this._healthUpdateAllowed_bool) {
            this._healthUpdateAllowed_bool = false; // stop more updates
            this.scene.time.addEvent({
                delay: 2000,
                callback: this._enableHealthUpdates,
                callbackScope: this
            });
            this._health += change;
        }
    } // end of updateHealth()

    // Called at an iterval after updateHealthChange, effectively  re-enables
    // health updates
    _enableHealthUpdates() {
        this._healthUpdateAllowed_bool = true;
    } // end of _enableHealthUpdates()

    // getter function
    get health() {
        return this._health;
    }

    /**********************************************
     * _move function to move the npc on
     * the screen
     * xDir,yDir: Direction of moverment, -1, 0 ,+1
     **********************************************/
    _move(xDir, yDir) {
        if (xDir === 0 && yDir === 0) {
            this.setVelocity(0);
            this.setFrame(1); // stand still
        } else {
            this.setVelocityX(xDir * this._VELOCITY);

            this.setVelocityY(yDir * this._VELOCITY);
            if (xDir === -1) {
                this.anims.play('walkLeft', true);
            } else if (xDir === 1) {
                this.anims.play('walkRight', true);
            }

            if (yDir === -1) {
                this.anims.play('walkUp', true);
            } else if (yDir === 1) {
                this.anims.play('walkDown', true);
            }
        }
        this._gameEmitter.emit(PLAYER_MOVE_EVENT, this.body.position);
    } //_move()


    updateMe(world) {
        var xDir = 0;
        var yDir = 0;
        // check keyboard
        if (world.cursors.left.isDown) {
            xDir = -1;
        } else if (world.cursors.right.isDown) {
            xDir = 1;
        } else if (world.cursors.up.isDown) {
            yDir = -1;
        } else if (world.cursors.down.isDown) {
            yDir = 1;
        }

        this._move(xDir, yDir);
        // Call collision detection for each layer that we care about
        this.scene.physics.collide(this, world.wallsLayer);
        this.scene.physics.collide(this, world.thingsLayer);
    }; // end of updateMe()

    /**********************************************
     * _itemHandler function called when colliding
     * with the specfied tiles (by index) Changes the
     * Players state
     * player: the player object
     * tile: the tile with player is colliding
     **********************************************/
    _itemHandler = function (player, tile) {
        if (tile.index == 47 && this._state_str != "power") {
            this._setState("power");
            // delay call to  reset the state
            this.scene.time.delayedCall(10000, this._setState, ["normal"], this);
        }
    }; // end of_itemHandler()

    /**********************************************
     * _setState function called to set players
     * state
     * newState_str: the new state
     **********************************************/
    _setState(newState_str) {
        this._state_str = newState_str;
        this._gameEmitter.emit(PLAYER_STATE_EVENT, this._state_str);
    }; // end of _setState()
}; // end of Player class

export{Player};