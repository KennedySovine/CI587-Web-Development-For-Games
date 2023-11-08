class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, texture) {
        super (scene, 0, 0, texture);
        this.setOrigin(-0.63, -2.3);
        scene.add.existing(this);
        this.initMe()
    }//Constructor

    initMe(){
        this.anims.load('playerZoosh');
        this.anims.load('playerBang');
    }

    startMe(xPos, yPos){
        this.setPosition(xPos, yPos);
    }

    updateMe(cursors, fireButton){
        if (cursors.left.isDown) {
            this.x -= 4;
            // simple boundary check
            if (this.x < 0) {
                this.x = 0;
            }
        }
        if (cursors.right.isDown) {
            this.x += 4;
            if (this.x > GAMEWIDTH) {
                this.x = GAMEWIDTH;
            }
        } 

        
    }

    killMe(){
        // Play named animation once and kill sprite when complete
        // console.log("into kill player");  
        playing_bool = false;
        this.once('animationcomplete', this.myAniEnded);
        this.anims.play('playerBang');
    }

    myAniEnded(){
        console.log("into playerAniEnded");
        // reset the animation to its first frame
        // dont do this it breaks the animation: this.setFrame("enemy0001.png" );
        let firstFrame = this.anims.currentAnim.frames[0];
        this.anims.setCurrentFrame(firstFrame);
        gameOver(this.scene);
    }
}