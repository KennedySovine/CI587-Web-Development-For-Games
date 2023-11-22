let config = {
    type: Phaser.AUTO,
    width: 880,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y:100},
            debug: true,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
var circle1, circle2;

function preload() {
    this.load.image('circle_img', 'assets/sphere.png');
} //end of preload() 

function create() {
    // set up two circle objects
    circle1 = this.physics.add.image(100, 50, 'circle_img');
    circle2 = this.physics.add.image(100, 100, 'circle_img');

    circle1.body.setCollideWorldBounds(true);
    circle2.body.setCollideWorldBounds(true);

    circle1.setBounce(.75);
    circle2.setBounce(.75);
    
    this.physics.add.collider(circle1, circle2);
} // end of create()

function update() {
    } // end of update()