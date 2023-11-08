class Bullet extends Phaser.GameObjects.Sprite {
    
    constructor(scene, texture) {       
        super(scene, 0, 0, texture);
        this.setOrigin(0.5, 0.5);
        scene.add.existing(this);
        this.initMe()
    } // constructor()

    initMe() {
        this.setActive(false); // it's dead
        this.setVisible(false); // it's invisble
    } //init()

    fireMe(x, y) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
    } // fireMe()

    updateMe() {
        if (this.active) {
            this.y -= 5;
            if (this.y < -10) {
                this.initMe();
            }
        }
    } //updateMe()
    
    killMe() {
        //remove the bullet from the display and put back into the pool
        this.initMe()
    } //killMe()

} // class Bullet
