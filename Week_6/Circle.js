Circle = function (game, key_str, x, y, xMov, yMov) {
    Phaser.Sprite.call(this, game, x, y, key_str, 0);
    this.xMov = xMov;
    this.yMov = yMov;
    this.anchor.setTo(0.5, 0.5);
}; //end of Circle()

Circle.prototype = Object.create(Phaser.Sprite.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.move = function () {
    //public method to move the box
    this.x += this.xMov;
    this.y += this.yMov;
    this.radius = (this.width - 2) / 2;
}; //end of move()

Circle.prototype.findCollisionCircle = function (otherCircle) {
    /*
     * Determine whether otherCircle has collided with this, 
     * if have, return true
     */
    //console.log("Circle: Into findCollisionCircle()");
    var collide_bool = false;
    var xDiff = this.x - otherCircle.x;
    var yDiff = this.y - otherCircle.y;
    var distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    collide_bool = (distance <= this.radius + otherCircle.radius);
    if (collide_bool) {
        this.circleCircleReaction(xDiff, yDiff, distance, otherCircle);
    }
    return collide_bool;
}; // end findCollisionCircle()

Circle.prototype.findCollisionWorld = function () {
    /* 
     * Detect collision between the circle and the edge 
     * of the world if a collision has occured, update 
     * the move values for circle
     */
    
    //check if off world
    if (this.x >= this.game.width - this.radius) {
        console.log("bing");
        this.x = this.game.width - this.radius;
        this.xMov *= -1;
    }
    if (this.x <= 0 + this.radius) {
        console.log("bang");
        this.x = this.radius;
        this.xMov *= -1;
    }
    if (this.y >= this.game.height - this.radius) {
        console.log("bong");
        this.y = this.game.height - this.radius;
        this.yMov *= -1;
    }
    if (this.y <= this.radius) {
        console.log("boo");
        this.tmpY = this.radius;
        this.yMov *= -1;
    }
}; // end findCollisionWorld()


Circle.prototype.circleCircleReaction = function (xDiff, yDiff, distance, circle2) {
    /* 
     * React to a collision between this circle and circle 2
     * xDiff: X Distance between centre of the 2 circles
     * yDiff: Y Distance between centre of the 2 circles
     * distance: Distance between centre of the 2 circles
     *  circle2:  The other circles
     */
   // console.log("Circle: circleCircleReaction()");
    var dvx, dvy;
    //calculate perpendicular angle
    var cosTheta = xDiff / distance;
    var sinTheta = yDiff / distance;
    // calculate difference in velocity between the 2 circles perpendicular to
    // the collision
    var dVector = (this.xMov - circle2.xMov) * cosTheta + (this.yMov - circle2.yMov) * sinTheta;
    // Ignor collisions that cause circles to overlap
    // if they are already moving apart, then dvector will be
    // positive, DONT reverse is
    if (dVector < 0) {
        //calculate the change in speed in x & y directions
        dvx = dVector * cosTheta;
        dvy = dVector * sinTheta;
        // change the x + y velocities of circle 1 and circle 2
        this.xMov -= dvx;
        this.yMov -= dvy;
        circle2.xMov += dvx;
        circle2.yMov += dvy;
    }
}; // end of circelCircleReaction()