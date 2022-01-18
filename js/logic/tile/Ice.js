class Ice extends Tile {
    constructor() {
        super(...arguments);
        this.type = 'ice';
    }

    getMapFlag() {
        return Constant.MAP_ICE;
    }

    beWalk(tank) {
        tank.setSkating();
    }

    canTankThrough() {
        return true;
    }

    canBulletThrough() {
        return true;
    }
}