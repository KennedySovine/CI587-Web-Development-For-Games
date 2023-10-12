const WIDTH = 300;
const HEIGHT = 300;

var canvas, ctx;
let aniFrameID = 0;
var audio = new Audio('sounds/Frying Pan Hit-SoundBible.com-2141771342.mp3');

x = 15;
y = 153;
radius = 10;
var vx = .5;
var vy = -.5;


function init() {
    console.log("Start")
    audio.play();
    canvas = document.querySelector("#canvas");
    draw();
} // end of init()


function draw() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'blue';
    ctx.fill();

1
    if (radius + x > WIDTH){
        vx = 0 - vx;
    }

    else if (x - radius < 0){
        vx = 0 - vx;
    }

    else if (y + radius > HEIGHT){
        vy = 0 - vy;
    }

    else if (y - radius < 0){
        vy = 0 - vy;
    }

    x = x + vx;
    y = y + vy;
    
    aniFrameID = requestAnimationFrame(draw);

} // end of draw()




