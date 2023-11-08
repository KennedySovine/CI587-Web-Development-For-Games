class Bullet extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y,texture, angleRad) {
        super(scene, x, y, texture);
        this._speed=5;
        //Calculate X and Y velocity
        this._xMov = this._speed * Math.cos(angleRad);
        this._yMov = this._speed * Math.sin(angleRad); 
    } // constructor()

    updateMe() {
        this.x += this._xMov;
        this.y += this._yMov;
        if (this.x > this.scene.game.width || this.x < 0 || this.y > this.scene.game.height || this.y < 0) {
            this.destroy();
        }
    } //updateMe()

} // class Bullet
