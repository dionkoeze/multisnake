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

    equals(other) {
        return this.x === other.x && this.y === other.y;
    }

    getNeighbor(mapX, mapY) {
        const x = this.world.applyBoundaryX(mapX(this.x));
        const y = this.world.applyBoundaryY(mapY(this.y));

        return new Coord(this.world, x, y);
    }

    getEast() {
        return this.getNeighbor(x => x + 1, y => y);
    }

    getWest() {
        return this.getNeighbor(x => x - 1, y => y);
    }

    getNorth() {
        return this.getNeighbor(x => x, y => y - 1);
    }

    getSouth() {
        return this.getNeighbor(x => x, y => y + 1);
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

    getOrientation() {
        let first = this.body[0];
        let second = this.body[1];

        if (second.equals(first.getNorth())) {
            return Direction.Down;
        } else if (second.equals(first.getSouth())) {
            return Direction.Up;
        } else if (second.equals(first.getEast())) {
            return Direction.Left;
        } else if (second.equals(first.getWest())) {
            return Direction.Right;
        }
    }

    step(newCoord) {
        this.body.unshift(newCoord);
        this.body.pop();
    }

    tick(move) {
        let orientation = this.getOrientation();
        let head = this.body[0];

        if (move === Direction.Up && orientation !== Direction.Down) {
            this.step(head.getNorth());
        } else if (move === Direction.Down && orientation !== Direction.Up) {
            this.step(head.getSouth());
        } else if (move === Direction.Left && orientation !== Direction.Right) {
            this.step(head.getWest());
        } else if (move === Direction.Right && orientation !== Direction.Left) {
            this.step(head.getEast());
        } else if (orientation === Direction.Up) {
            this.step(head.getNorth());
        } else if (orientation === Direction.Down) {
            this.step(head.getSouth());
        } else if (orientation === Direction.Left) {
            this.step(head.getWest());
        } else if (orientation === Direction.Right) {
            this.step(head.getEast());
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

class SnakeBox {
    constructor(snake) {
        this.snake = snake;
        this.move = null;
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
        this.boxedSnakes = [];
        this.apples = [];

        // temp
        this.boxedSnakes.push(new SnakeBox(new Snake(this)));
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
        return this.applyBoundary(x, this.sizeX);
    }

    applyBoundaryY(y) {
        return this.applyBoundary(y, this.sizeY);
    }

    getDrawer(canvas) {
        return new Drawer(canvas, this.sizeX, this.sizeY);
    }

    tick() {
        this.boxedSnakes.forEach(boxedSnake => boxedSnake.snake.tick(boxedSnake.move));
    }

    show(drawer) {
        drawer.reset();

        for (let x = 0; x < this.sizeX; x++) {
            for (let y = 0; y < this.sizeY; y++) {
                drawer.drawCell(x, y, Colors.Background);
            }
        }

        this.boxedSnakes.forEach(boxedSnake => boxedSnake.snake.show(drawer));
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

setInterval(() => {
    // world.boxedSnakes[0].move = Direction.Up
    world.tick();
    world.show(drawer);
}, 500)

document.addEventListener('keydown', (event) => {
    if (event.keyCode === 37) {
        world.boxedSnakes[0].move = Direction.Left;
    } else if (event.keyCode === 38) {
        world.boxedSnakes[0].move = Direction.Up;
    } else if (event.keyCode === 39) {
        world.boxedSnakes[0].move = Direction.Right;
    } else if (event.keyCode === 40) {
        world.boxedSnakes[0].move = Direction.Down;
    }
});
