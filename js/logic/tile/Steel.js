class Steel extends Tile {
    constructor() {
        super(...arguments);
        this.type = 'steel';
    }

    getMapFlag() {
        return Constant.MAP_STEEL;
    }

    beShot(bullet, is_player) {
        this.destroy = (bullet.getLevel() >= 2);
        let audio = "";
        if (is_player) {
            audio = this.destroy ? "hit_brick" : "hit_edge";
        }
        return {changed: this.destroy, animations: [], audio: audio};
    }

    canDestroy(tank) {
        return (tank.getLevel() >= 4);
    }
}