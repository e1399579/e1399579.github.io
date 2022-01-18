class Forest extends Tile {
    getType() {
        return 'forest';
    }

    getMapFlag() {
        return Constant.MAP_FOREST;
    }

    canTankThrough() {
        return true;
    }

    canBulletThrough() {
        return true;
    }
}