class Brick extends Tile {
    constructor() {
        super(...arguments);
        this.type = 'brick';
        this.layer = 2;
        this.clear_rect = super.getClearRect();
    }

    getMapFlag() {
        return Constant.MAP_BRICK;
    }

    getClearRect() {
        return this.clear_rect;
    }

    beShot(bullet, is_player) {
        if (--this.layer <= 0) {
            this.destroy = true;
            this.clear_rect = super.getClearRect();
        } else {
            // [this.x, this.y, this.width, this.height]
            switch (bullet.getDirect()) {
                case Constant.DIRECT_LEFT:
                    this.width >>= 1;
                    this.clear_rect = [this.x + this.width, this.y, this.width, this.height];
                    break;
                case Constant.DIRECT_UP:
                    this.height >>= 1;
                    this.clear_rect = [this.x, this.y + this.height, this.width, this.height];
                    break;
                case Constant.DIRECT_RIGHT:
                    this.width >>= 1;
                    this.clear_rect = [this.x, this.y, this.width, this.height];
                    this.x += this.width;
                    break;
                case Constant.DIRECT_DOWN:
                    this.height >>= 1;
                    this.clear_rect = [this.x, this.y, this.width, this.height];
                    this.y += this.height;
                    break;
            }
        }
        return {changed: true, animations: [], audio: is_player ? "hit_brick" : ""};
    }

    canDestroy(tank) {
        return true;
    }
}