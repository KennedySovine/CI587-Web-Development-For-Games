class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, xPos, yPos, texture) {
        super(scene, xPos, yPos, texture);
        // had to do this to create a physics body
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
        
        // TBS Private health properties
        this._health=100;
        this._healthUpdateAllowed_bool=true;
        
        // Add this to the scene to make it visible/active etc
        scene.add.existing(this);
    } // end of constructor()
    
    
    // Updates the  "private" health property
    updateHealth(change){
        // only updates the health at intervals
        if (this._healthUpdateAllowed_bool){
            this._healthUpdateAllowed_bool= false; 
            // TBS set up a timer to  call _enableHealthUpdates
            // TBS update the players _health property
        }
    }// end of updateHealth()
    
    // Called at an iterval after updateHealthChange, effectively  re-enables
    // health updates
    _enableHealthUpdates() {
        this._healthUpdateAllowed_bool=true;
    } // end of _enableHealthUpdates()
    
    // getter function
    get health(){
        return this._health;
    }
    //movement methods
    moveLeft() {
        this.anims.play('walkLeft',true);
        this.setVelocityX(-50);
    }; // end of moveLeft()

    moveRight() {
        this.anims.play('walkRight',true);
        this.setVelocityX(50);
    }; // end of moveRight()

    moveUp() {
        this.anims.play('walkUp',true);
        this.setVelocityY(-50);
    }; // end of moveUp()
    moveDown() {
        this.anims.play('walkDown', true);
        this.setVelocityY(+50);
    }; // end of moveDown()

    standStill() {
        this.setFrame(0);
        this.setVelocity(0)
    } //end of standStill()

} // end of Player class
