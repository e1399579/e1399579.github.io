class Eagle extends Tile {
    constructor() {
        super(...arguments);
        this.width = 16 * Constant.ZOOM;
        this.height = 16 * Constant.ZOOM;
        this.type = 'eagle';
        this.is_over = false;
        this.rect = [this.x, this.y, this.width, this.height];
    }

    getClearRect() {
        return [];
    }

    getMapFlag() {
        return Constant.MAP_EAGER;
    }

    beShot(bullet, is_player) {
        if (!this.is_over) {
            this.type = 'eagle_';
            this.is_over = true;

            let point = {x: this.x + (this.width >> 1), y: this.y + (this.height >> 1)};
            return {changed: true, animations: [
                new Bomb2(null, point),
            ], audio: ""};
        } else {
            return {changed: false, animations: [], audio: "eagle_bomb"};
        }
    }

    canDestroy(tank) {
        return true;
    }

    canBulletThrough() {
        return this.is_over;
    }

    isOver() {
        return this.is_over;
    }
}