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
    
}

class Apple {

}

class World {
    constructor(sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
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
}
