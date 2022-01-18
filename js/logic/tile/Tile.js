class Tile {
    constructor(x, y, area) {
        this.x = x;
        this.y = y;
        this.area = area;
        this.destroy = false;
        this.width = 8 * Constant.ZOOM;
        this.height = 8 * Constant.ZOOM;
        this.type = 'tile';
        this.rect = [x, y, this.width, this.height];
    }

    getRect() {
        return this.rect;
    }

    getClearRect() {
        return this.rect;
    }

    getPoint() {
        return {x: this.x, y: this.y};
    }

    getRelativeSize() {
        return {w:this.width, h:this.height};
    }

    getArea() {
        return this.area;
    }

    isDestroy() {
        return this.destroy;
    }

    canDestroy(tank) {
        return false;
    }

    canTankThrough() {
        return false;
    }

    canBulletThrough() {
        return false;
    }

    getType() {
        return this.type;
    }

    getMapFlag() {}

    beWalk(tank) {
        tank.setNormal();
    }

    beShot(bullet, is_player) {
        return {changed: false, animations: [], audio: ""};
    }
}