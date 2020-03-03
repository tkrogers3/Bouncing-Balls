// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const para = document.getElementById("ballCount");
var total = 50;

// function to generate random number

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

// Shape constructor defined from Ball constructor minus color and size
function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists; //tracks whether the ball exists in the program
}

// function Ball that is inheriting x,y,velX, velY, and exists from  Shape, while adding constructing its own color and size properties.
function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}


Ball.prototype = Object.create(Shape.prototype);



//setting Ball's prototype and constructor reference
Object.defineProperty(Ball.prototype, 'constructor', {
    value: Ball,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true
});


//function to create the Ball
Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

let balls = [];

Ball.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
}

//Inherited from Shape, with its own properties: color and size
function EvilCircle(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, 20, 20, exists);
    this.color = "white";
    this.size = 10;

}

EvilCircle.prototype = Object.create(Shape.prototype);

//Evil Circle prototype and constructor reference
Object.defineProperty(EvilCircle.prototype, 'constructor', {
    value: EvilCircle,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true
});



// 
EvilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 30;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}


/* Made from Ball Update function. value of x, y defined by width, height */
EvilCircle.prototype.checkBounds = function () {
    if ((this.x + this.size) >= width) {
        this.x = width - this.size;
    }

    if ((this.x - this.size) <= 0) {
        this.x = 0 + this.size;
    }

    if ((this.y + this.size) >= height) {
        this.y = height - this.size;
    }

    if ((this.y - this.size) <= 0) {
        this.y = 0 + this.size;
    }
}



EvilCircle.prototype.setControls = function () {
    let _this = this;
    window.onkeydown = function (e) {
        if (e.key === 'a') {
            _this.x -= _this.velX;
        } else if (e.key === 'd') {
            _this.x += _this.velX;
        } else if (e.key === 'w') {
            _this.y -= _this.velY;
        } else if (e.key === 's') {
            _this.y += _this.velY;
        }
    }
}


EvilCircle.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);


            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                total--
                para.textContent = "Ball Count: " + total;
            }


        }
    }
}


evilCircle = new EvilCircle(width / 2, height / 2, 20, 20, true, "white", 10)
evilCircle.setControls();


while (balls.length < 50) {
    let size = random(10, 20);
    let ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        true, //exists parameter 
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size

    );

    balls.push(ball);
}


ballCount = balls.length;



function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);


    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }

    }
    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();
    requestAnimationFrame(loop);
}

loop();