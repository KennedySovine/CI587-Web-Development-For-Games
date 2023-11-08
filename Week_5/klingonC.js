class Klingon extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this._noseOffset = this.width / 2;
        // allow for delay beteen firing
        this._nextBulletTime = 0;
        this._fireDelay = 200;
    }; //end ofconstructor()

    fire(bulletGroup) {
        let angleRad = this.rotation;
        let startX = this.x + (this._noseOffset * Math.cos(angleRad));
        let startY = this.y + (this._noseOffset * Math.sin(angleRad));
        if (this.scene.time.now > this._nextBulletTime) {
            bulletGroup.add(new Bullet(this.scene, startX, startY, "bullet_img", angleRad), true);
            this._nextBulletTime = this.scene.time.now + this._fireDelay;
        }
    }; //end of fire()

    updateMe(cursors){
        if (cursors.left.isDown) {
            this.x -= 4 ;
            // simple boundary check
            if (this.x < 0) {
                this.x = GAMEWIDTH;
            }
        }
        if (cursors.right.isDown) {
            this.x += 4;
            if (this.x > GAMEWIDTH) {
                this.x = 0;
            }
        }
        if (cursors.up.isDown){
            this.y -= 4;
            if (this.y < 0){
                this.y = GAMEHEIGHT;
            }
        }
        if (cursors.down.isDown){
            this.y += 4;
            if (this.y  > GAMEHEIGHT){
                this.y = 0;
            }
        }
    }
} // end of Class
 