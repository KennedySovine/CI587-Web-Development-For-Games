class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, texture) {
        super(scene, 0, 0, texture);
        this.setOrigin(0.5, 0.5);
        scene.add.existing(this);
        this.initMe()
    } // constructor()

    initMe() {
        // centre the anchor point
        this.setActive(false);
        this.setVisible(false);
        this.state = DEAD_STATE;
        // add enemy animation
        this.anims.load('enemyBang');
    } //initMe()
    
   startMe(xPos, yPos) {
        this.state = ALIVE_STATE;
        this.setPosition(xPos, yPos);
        this.setActive(true).setVisible(true);
        // add some extra properties used for movement
        this.xLine = xPos;
        this.theta = Math.random() * 6.28;
        this.speed = Phaser.Math.RND.integerInRange(1, 4);
    }// startMe()
    
 updateMe() {
    this.x = this.xLine + Math.sin(this.theta) * 100;
    this.theta += 0.1;
    this.y += this.speed;
    if (this.y > GAMEHEIGHT + this.height) {
        // Off bottom, so make inactive and invisible
       this.setActive(false);
        this.setVisible(false);
    }
} //updateMe()

killMe() {
    //console.log("Into Destroy enemy");
    //Use the sprite state property to flag this is Dead
  this.state = DEAD_STATE;
    // Set up a one-shot event handler to deal with this animation
    this.once('animationcomplete', this.myAniEnded);
    // Play named animation
    this.anims.play('enemyBang');
} // killMe()

myAniEnded() {
    //Set the enemy_spr (this) inactive and invisible
    this.setActive(false).setVisible(false);
    // reset the animation to its first frame
    // dont do this is breaks the animation: this.setFrame("enemy0001.png" );
    let firstFrame = this.anims.currentAnim.frames[0];
    this.anims.setCurrentFrame(firstFrame);
}// myAniEnded()


} // end of class



