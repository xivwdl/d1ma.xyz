let shapes = [];
const maxShapes = 25;
let lastShapeTime = 0;
const shapeInterval = 100;

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-container');
    strokeWeight(1);
}

function draw() {
    clear();

    for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        shape.update();
        shape.display();

        if (shape.isOffscreen() || shape.age > 400) {
            shapes.splice(i, 1);
        }
    }
}

function mouseDragged(event) {
    event.preventDefault();
    const currentTime = millis();
    if (currentTime - lastShapeTime > shapeInterval) {
        addShape(mouseX, mouseY);
        lastShapeTime = currentTime;
    }
    return false;
}

function touchMoved(event) {
    event.preventDefault();
    const currentTime = millis();
    if (currentTime - lastShapeTime > shapeInterval) {
        addShape(touches[0].x, touches[0].y);
        lastShapeTime = currentTime;
    }
    return false;
}

function addShape(x, y) {
    if (shapes.length >= maxShapes) {
        shapes.shift();
    }

    const size = random(10, 100);
    shapes.push(new Circle(x, y, size));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Circle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.vx = random(-1.5, 1.5);
        this.vy = random(-4, -2);
        this.gravity = 0.08;
        this.age = 0;
        this.opacity = 255;
        this.isFilled = random() > 0.5;
    }

    update() {
        this.x += this.vx;
        this.vy += this.gravity;
        this.y += this.vy;
        this.age++;

        if (this.age > 300) {
            this.opacity = map(this.age, 300, 400, 255, 0);
        }
    }

    display() {
        push();
        if (this.isFilled) {
            noStroke();
            const gradient = drawingContext.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size / 2
            );
            const startColor = color(228, 252, 235, this.opacity);
            const endColor = color(0, 225, 63, this.opacity);
            gradient.addColorStop(0, startColor.toString());
            gradient.addColorStop(1, endColor.toString());
            drawingContext.fillStyle = gradient;
            circle(this.x, this.y, this.size);
        } else {
            noFill();
            const strokeCol = color(0, 225, 63, this.opacity);
            stroke(strokeCol);
            circle(this.x, this.y, this.size);
        }
        pop();
    }

    isOffscreen() {
        return (
            this.x < -this.size ||
            this.x > width + this.size ||
            this.y > height + this.size
        );
    }
}