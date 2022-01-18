class River extends Tile {
    constructor() {
        super(...arguments);
        this.type = 'river';
    }

    getMapFlag() {
        return Constant.MAP_RIVER;
    }

    canBulletThrough() {
        return true;
    }
}