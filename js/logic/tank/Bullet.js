class Bullet extends Unit {
    constructor(id, tank, level, direct, speed) {
        super();
        this.id = id;
        this.tank = tank;
        this.role = tank.getRole();
        this.level = level;
        this.direct = direct;
        this.speed = speed;

        this.width = 3 * Constant.ZOOM;
        this.height = 4 * Constant.ZOOM;
    }

    getId() {
        return this.id;
    }

    getRole() {
        return this.role;
    }

    getTank() {
        return this.tank;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    getPoint() {
        return {x: this.x, y: this.y};
    }

    getDirect() {
        return this.direct;
    }

    getLevel() {
        return this.level;
    }

    predictPoint() {
        let x = this.x;
        let y = this.y;
        switch (this.direct) {
            case Constant.DIRECT_LEFT:
                x -= this.speed;
                break;
            case Constant.DIRECT_UP:
                y -= this.speed;
                break;
            case Constant.DIRECT_RIGHT:
                x += this.speed;
                break;
            case Constant.DIRECT_DOWN:
                y += this.speed;
                break;
        }

        return {x, y};
    }

    getHeadPoint() {
        return super.getHeadPoint(this.getPoint(), this.direct);
    }

    getAttackRange() {
        let x, y, w, h;
        if (this.isVertical()) {
            x = this.x - 1;
            y = this.y;
            w = this.width + 2;
            h = this.height;
        } else {
            x = this.x;
            y = this.y - 1;
            w = this.height;
            h = this.width + 2;
        }

        return [{x, y}, {w, h}];
    }

    getOverAnimation() {
        // 动画
        let point = this.getHeadPoint();
        return new Bomb(null, point);
    }
}