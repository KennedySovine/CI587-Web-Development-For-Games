//code rewritten from http://blog.sklambert.com/category/tutorials/
const WIDTH = 300;
const HEIGHT = 300;

var stop_bool;
let rightDown_bool = false;
let leftDown_bool = false;
let aniFrameID = 0;
var canvas, ctx;

let bricks = {
    nRows: 5,
    nCols: 5,
    brickWidth: (WIDTH / 5) - 1,
    brickHeight: 15,
    padding: 1,
    brick_ary: []
};

let paddle = {
    width: WIDTH / 4,
    height: 10,
    y: 0,
    x: 0,
    dx: WIDTH / 75
};

let ball = {
    x: 0,
    y: 0,
    radius: 10,
    dx: 0,
    dy: 0
};

function init() {
    cancelAnimationFrame(aniFrameID);
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    initBricks();
    // set up the ball    
    ball.dx = 0;
    ball.dy = 3;
    ball.x = 150;
    ball.y = 150;
    //set up the paddle
    paddle.y = HEIGHT - paddle.height;
    paddle.x = WIDTH / 2 - paddle.width / 2;
    // Add keyboard event listeners
    window.addEventListener('keydown', doKeyDown, true);
    window.addEventListener('keyup', doKeyUp, true);

    stop_bool = false;
    
    draw();
} // end of init()

function initBricks() {
    var i, j;
    for (i = 0; i < bricks.nRows; i++) {
        bricks.brick_ary[i] = [];
        for (j = 0; j < bricks.nCols; j++) {
            bricks.brick_ary[i][j] = 1;
        }
    }
} // end of initBricks()

function draw() {
    var i, j;
    ctx.clearRect(0, 0, 300, 300); // clear the canvas

    // work out new ball pos
    ball.x += ball.dx;
    ball.y += ball.dy;
    checkCollisions();
    //render the ball 
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = "blue";
    ctx.fill();
    // draw the paddle
    if (leftDown_bool) {
        if (paddle.x > 0) {
            paddle.x -= paddle.dx;
        }
    } else if (rightDown_bool) {
        if (paddle.x + paddle.width < WIDTH) {
            paddle.x += paddle.dx;
        }
    }
    ctx.fillStyle = "green";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    //Bricks
    ctx.fillStyle = "red";
    //draw bricks
    for (i = 0; i < bricks.nRows; i++) {
        for (j = 0; j < bricks.nCols; j++) {
            if (bricks.brick_ary[i][j] === 1) {
                ctx.fillRect((j * (bricks.brickWidth + bricks.padding)) + bricks.padding, (i * (bricks.brickHeight + bricks.padding)) + bricks.padding,
                    bricks.brickWidth, bricks.brickHeight);
            }
        }
    }
    if (!stop_bool) {
        aniFrameID = requestAnimationFrame(draw);
    }
} // end of draw()

function checkCollisions() {
    // check for collision with bricks
    var rowHeight = bricks.brickHeight + bricks.padding;
    var colWidth = bricks.brickWidth + bricks.padding;
    var row = Math.floor(ball.y / rowHeight);
    var col = Math.floor(ball.x / colWidth);
    var paddleCentreX;
    if (row < bricks.nRows && row >= 0 && col >= 0 && bricks.brick_ary[row][col] === 1) {
        console.log("Bang!");
        ball.dy = -ball.dy;
        //bricks.brick_ary[row][col] = 0;
    }

    // check for collision with edges
    if (ball.x > WIDTH || ball.x < 0) {
        console.log("ping");
        ball.x -= 2 * ball.dx;
        ball.dx = -ball.dx;
    }
    if (ball.y < 0) {
        console.log("plop");
        ball.y -= 2 * ball.dy;
        ball.dy = -ball.dy;
    }
    // check paddle
    if ((ball.y + ball.radius > paddle.y && ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width)) {
        console.log("paddle plop");
        ball.y -= 2 * ball.dy;
        ball.dy = -ball.dy;
        paddleCentreX = paddle.x + paddle.width / 2;
        ball.dx = (ball.x - paddleCentreX) / 20; //x speed depends on postion of collision with paddle
    } else if (ball.y > HEIGHT) {
        //TODO: you lose!
        console.log("off bottom");
        stop_bool = true;
    }
} // end of checkCollisions()

// Keyboard Handling

function doKeyDown(evt) {
    //right is 39 left is 37
    if (evt.keyCode === 39) {
        console.log("Right Down");
        rightDown_bool = true;
    } else if (evt.keyCode === 37) {
        leftDown_bool = true;
    }
} // end of doKeyDown()

function doKeyUp(evt) {
    if (evt.keyCode === 39) {
        console.log("Right Up");
        rightDown_bool = false;
    } else if (evt.keyCode === 37) {
        leftDown_bool = false;
    }
} // end of doKeyUp()