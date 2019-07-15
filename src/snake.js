const Direction = {
    'Up': 1,
    'Down': 2,
    'Left': 3,
    'Right': 4
}

const Colors = {
    'Border': 'rgb(0, 0, 0)',
    'Background': 'rgb(30, 30, 30)',
    'SnakeHead': 'rgb(0, 180, 0)',
    'SnakeBody': 'rgb(0, 140, 0)',
    'Apple': 'rgb(180, 0, 0)'
}

class Coord {
    constructor(world, x, y) {
        this.world = world;

        if (typeof x === 'undefined') {
            this.x = 0;
        } else {
            this.x = x;
        }
        
        if (typeof y === 'undefined') {
            this.y = 0;
        } else {
            this.y = y;
        }
    }

    getNeighbor(mapX, mapY) {
        const x = this.world.applyBoundaryX(mapX(this.x));
        const y = this.world.applyBoundaryY(mapY(this.y));

        return new Coord(this.world, x, y);
    }

    getEast() {
        return getNeighbor(x => x + 1, y => y);
    }

    getWest() {
        return getNeighbor(x => x - 1, y => y);
    }

    getNorth() {
        return getNeighbor(x => x, y => y - 1);
    }

    getSouth() {
        return getNeighbor(x => x, y => y + 1);
    }
}

class Snake {
    constructor(world) {
        this.world = world;
        this.body = [];

        // temp
        this.body.push(new Coord(this.world, 10,5));
        this.body.push(new Coord(this.world, 10,6));
        this.body.push(new Coord(this.world, 11,6));
        this.body.push(new Coord(this.world, 12,6));
    }

    step(move) {
        if (move === 'up') {
            moveUp();
        } else if (move === 'down') {
            moveDown();
        } else if (move === 'left') {
            moveLeft();
        } else if (move === 'right') {
            moveRight();
        }
    }

    show(drawer) {
        this.body.forEach((segment, idx) => {
            let color;
            if (idx === 0) {
                color = Colors.SnakeHead;
            } else {
                color = Colors.SnakeBody;
            }

            drawer.drawCell(segment.x, segment.y, color);
        })
    }
}

class Apple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    show(drawer) {
        drawer.drawCell(this.x, this.y, Colors.Apple);
    }
}

class World {
    constructor(sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.snakes = [];
        this.apples = [];

        // temp
        this.snakes.push(new Snake());
        this.apples.push(new Apple(15, 17));
    }

    getCoord(x, y) {
        return new Coord(this, x, y);
    }

    applyBoundary(coord, size) {
        while (coord< 0) {
            coord+= size;
        }

        while (coord>= size) {
            coord-= size;
        }

        return coord;
    }

    applyBoundaryX(x) {
        return applyBoundary(x, this.sizeX);
    }

    applyBoundaryY(y) {
        return applyBoundary(y, this.sizeY);
    }

    getDrawer(canvas) {
        return new Drawer(canvas, this.sizeX, this.sizeY);
    }

    show(drawer) {
        drawer.reset();

        for (let x = 0; x < this.sizeX; x++) {
            for (let y = 0; y < this.sizeY; y++) {
                // ctx.fillRect(x*strideX+border/2, y*strideY+border/2, strideX-border, strideY-border);
                drawer.drawCell(x, y, Colors.Background);
            }
        }

        this.snakes.forEach(snake => snake.show(drawer));
        this.apples.forEach(apple => apple.show(drawer));
    }
}

class Drawer {
    constructor(canvas, sizeX, sizeY) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.strideX = canvas.width / sizeX;
        this.strideY = canvas.height / sizeY;
        this.border = Math.min(this.strideX, this.strideY)/8;
    }

    reset() {
        this.ctx.fillStyle = Colors.Border;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawCell(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x*this.strideX+this.border/2, y*this.strideY+this.border/2, this.strideX-this.border, this.strideY-this.border);
    }
}

let world = new World(30, 30);
let cnvs = document.getElementById("snakeCanvas");
let drawer = world.getDrawer(cnvs);
world.show(drawer);