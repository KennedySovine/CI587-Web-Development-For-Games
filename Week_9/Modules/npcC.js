import {PLAYER_STATE_EVENT, PLAYER_MOVE_EVENT} from "../game.js";

/**********************************************
 * NPC constructor function inherits from 
 * Phaser.Physics.Arcade.Sprite
 * world: The game world object
 * scene: The parent scene
 * xPos,yPos: Pixel position in world
 * texture: texture used to render the sprite
 **********************************************/
class Npc extends Phaser.Physics.Arcade.Sprite {
    constructor(world, xPos, yPos, texture) {
        super(world.scene, xPos, yPos, texture);
        let scene=this.scene;
        // had to do this to create a physics body
        scene.physics.add.existing(this);
        //set up the physics properties
        this.setCollideWorldBounds(true);
        //add the walking animations
        scene.anims.create({
            key: 'z_walkDown',
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'z_walkLeft',
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 3,
                end: 5
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load('z_walkLeft');
        scene.anims.create({
            key: 'z_walkRight',
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 6,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load('z_walkRight');
        scene.anims.create({
            key: 'z_walkUp',
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 9,
                end: 11
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.load('z_walkUp');

        // pseudo private properites
        this._world = world;
        this._VELOCITY = 10;
        
        this._xDir = 0; //remember between direction changes which way the npc is moving
        this._yDir = 0;

        this._DIRCHANGETIME = 300;
        this._cleverness = 50; // the smaller this number, the more likeley the NPC is to go the wrong way
        this._dirTimer = 0;
        this._changeTime = 0;
        this._state_str = "normal";

        // Players postion and status, set by event handler
        this._player={
                        x:0,
                        y:0,
                        state:"normal"
        }

        // player event listeners, note context: this :-)
        world.gameEmitter.on(PLAYER_STATE_EVENT, this._processPlayerStateEvent, this);
        world.gameEmitter.on(PLAYER_MOVE_EVENT, this._processPlayerMoveEvent, this);

         // Add this objects to the scene to make it visible/active etc
         scene.add.existing(this);
         scene.physics.add.collider(this, this._world.wallsLayer, this._wallCollisionHandler);
    } // end of constructor()   
    
    /**********************************************
     * _move function to move the npc on
     * the screen
     * xDir,yDir: Direction of moverment, -1, 0 ,+1
     **********************************************/
    _move(xDir, yDir) {
        this.setVelocity(0);
        if (xDir === 0 && yDir === 0) {

            this.setFrame(1); // stand still
        } else {
            if (xDir !== 0) {
                this.setVelocityX(xDir * this._VELOCITY);
                if (xDir === -1) {
                    this.anims.play('z_walkLeft', true);
                } else if (xDir === 1) {
                    this.anims.play('z_walkRight', true);
                }
            } else {
                this.setVelocityY(yDir * this._VELOCITY);
                if (yDir === -1) {
                    this.anims.play('z_walkUp', true);
                } else if (yDir === 1) {
                    this.anims.play('z_walkDown', true);
                }
            }
        }
    } //_move()

    /**********************************************
     * _getMove function calculates direction of
     * movement
     **********************************************/
    _getMove() {
        let xDir = this._xDir;
        let yDir = this._yDir;
        // check if it is time to change movement or this npc has changed state
        if (this._dirTimer >= this._changeTime || this._updateState()) {
            // work out directions the enemy needs to move to get closer to player
            xDir = (this._player.x - this.x);
            if (xDir !== 0) {
                xDir = xDir / Math.abs(xDir);
            }
            yDir = (this._player.y - this.y);
            if (yDir !== 0) {
                yDir = yDir / Math.abs(yDir);
            }
            // if running away, reverse directions  
            if (this._state_str == "runaway") {
                console.log('npc running away');
                xDir *= -1;
                yDir *= -1;
            }
            // dumbdown - sometimes go in wrong direction   
            if (Math.random() * this._cleverness < 1) {
                //trace("dumb");
                xDir *= -1;
                yDir *= -1;
            }
            // force the NPC to move along either the x or y axis    
            if (xDir !== 0 && yDir !== 0) {
                if (Math.random() > 0.5) {
                    xDir = 0;
                } else {
                    yDir = 0;
                }
            }
            // reset update timer 
            this._changeTime = Phaser.Math.RND.integerInRange(20, this._DIRCHANGETIME);
            this._dirTimer = 0;
        } // end of update behaviour 
        this._dirTimer++;
        //move
        this._xDir = xDir;
        this._yDir = yDir;
        this._move(xDir, yDir);
    }; // end of getMove()

    /**********************************************
     * _processPlayerStateEvent(evt)
     * event listener for PLAYER_STATE_EVENT updates
     * local playerState
     * 
     **********************************************/
    _processPlayerStateEvent(evt) {
      // console.log("npc: hears player state event "+evt);
        this._player.state=evt;
    } // end of _processPlayerStateEvent()

    /**********************************************
     * _processPlayerMoveEvent(evt)
     * event listener for PLAYER_MOVE_EVENT updates 
     * local playerX and Y
     * 
     * evt: The incomming event
     **********************************************/
    _processPlayerMoveEvent(evt) {
       //console.log("npc: hears move :"+evt.x,+" "+evt.y );
       this._player.x=evt.x;
       this._player.y=evt.y;
    } // end of _processPlayerMoveEvent() 

    /**********************************************
     * _updateState function updates the state of 
     * the NPC, returns true if the state is changed
     **********************************************/
    _updateState() {
        let oldState_str = this._state_str;
      // console.log("_updateState: "+ this._playerState);
        if (this._player.state == "power") {
            //console.log("npc: Time to runaway "+ this._playerState);
            this._state_str = "runaway";
        } else {
            this._state_str = "normal";
        }
        return (oldState_str != this._state_str);
    }; // update state

    /**********************************************
     * _wallCollisionHandler function stub, could 
     * used to add AI to deal with wall collisions
     **********************************************/
    _wallCollisionHandler(npc, tile) {
        //console.log("npc: into _collisionHandler")
    }; // _wallCollisionHandler

    /**********************************************
     * preUpdate: Automatically called by Phaser 
     * as part of the Game loop
     **********************************************/
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this._getMove();
    }

}; //Npc()

export{Npc};