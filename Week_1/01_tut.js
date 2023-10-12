const WIDTH = 300;
const HEIGHT = 300;

var canvas, ctx;
let aniFrameID = 0;
var audio = new Audio('sounds/Frying Pan Hit-SoundBible.com-2141771342.mp3');

var paddle= {
    width : WIDTH / 4,
    height : 10,
    y: 0,
    x : 0,
    dx: WIDTH / 75
};

var ball = {
    x: 0,
    y: 0,
    radius: 10,
    dx: 0,
    vy: 0
};


function init() {
    //Keyboard event listeners
    window.addEventListener('keydown', doKeyDown, true);
    window.addEventListener('keyup', doKeyUp, true);

    //set up ball
    ball.dx = 1;
    ball.dy = 1;
    ball.x = 150;
    ball.y = 150;

    //set up paddle
    paddle.y = HEIGHT - paddle.height;
    paddle.x = WIDTH / 2 - paddle.width / 2;
    leftDown_bool = false;
    rightDown_bool = false;
    stop_bool = false;

    console.log("Start")
    audio.play();
    canvas = document.querySelector("#canvas");
    draw();
} // end of init()


function draw() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, WIDTH, HEIGHT); //Clear canvas

    ball.x += ball.dx;
    ball.y += ball.dy;
    checkCollisions();

    //Render the ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'blue';
    ctx.fill();

    //draw the paddle
    if (leftDown_bool){
        if (paddle.x > 0) {
            paddle.x -= paddle.dx;
        }
    }
    else if (rightDown_bool){
        if (paddle.x + paddle.width < WIDTH){
            paddle.x += paddle.dx;
        }
    }

    ctx.fillStyle = "green"
    ctx.fillRect (paddle.x, paddle.y, paddle.width, paddle.height);
    
    if (!stop_bool){
        aniFrameID = requestAnimationFrame(draw);
    }

} // end of draw()

function checkCollisions(){
    if (ball.x + ball.radius - 1 > WIDTH || ball.x - ball.radius - 1 < 0){
        console.log ("ping");
        ball.x -= 2 * ball.dx;
        ball.dx = -ball.dx;
    }

    if (ball.y + ball.radius - 1 > HEIGHT || ball.y - ball.radius - 1 < 0){
        console.log("plop");
        ball.y -= 2 * ball.dy;
        ball.dy = -ball.dy;
        console.log(ball.y);
    }

    if ((ball.y  + ball.radius > paddle.y && ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width)) {
        console.log("Paddle hit");
        ball.y -=  2 * ball.dy;
        ball.dy = -ball.dy;
        paddleCenterX = paddle.x + paddle.width / 2;
        ball.dx = (ball.x - paddleCenterX) / 20; //x speed depends on position of collision with paddle
    }
    else if (ball.y + ball.radius > HEIGHT){
        console.log("off bottom");
        stop_bool = true;
    }
}
function doKeyDown(evt){
    //right is 39 left is 37
    if (evt.keyCode === 39){
        console.log("Right Down");
        rightDown_bool = true;
    }
    else if (evt.keyCode === 37){
        leftDown_bool = true;
    }
}

function doKeyUp(evt){
    if (evt.keyCode === 39){
        console.log("Right Up");
        rightDown_bool = false;
    }
    else if (evt.keyCode === 37){
        leftDown_bool = false;
    }
}