var world = world || {
    gameHeight: 600,
    gameWidth: 880,
};

let config = {
    type: Phaser.AUTO,
    width: world.gameWidth,
    height: world.gameHeight,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

function preload() {
    this.load.image('circle_img', 'assets/sphere.png');
} //end of preload() 

function create() {
    let circle1X = 100;
    let circle1Y = 50;
    let circle2X = 300;
    let circle2Y = 52;
    // set up two circle objects
    this.circle1 = new Circle(this, 'circle_img', circle1X, circle1Y, 0, 4);
    this.circle2 = new Circle(this, 'circle_img', circle2X, circle2Y, -4, 4);
    this.add.existing(this.circle1);
    this.add.existing(this.circle2);
} // end of create()

function update() {
    this.circle1.findCollisionWorld();
    this.circle2.findCollisionWorld();
       if (this.circle1.findCollisionCircle(this.circle2)) {
            console.log("collision found");
        }
        this.circle1.move();
        this.circle2.move();
    } // end of update()

let game = new Phaser.Game(config);