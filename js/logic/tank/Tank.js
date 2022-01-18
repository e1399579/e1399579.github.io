class Tank extends Unit {
    constructor(direct) {
        super();
        this.direct = direct;
        this.role = null;
        this.type = null;
        this.color = ["silver"];
        this.bullet_num = 1;
        this.bullet_level = 1;
        this.bullet_id = 0;

        this.counter = 0;
        this.bullets = [];
        this.bullet_speed = Constant.BASE_BULLET_SPEED * Constant.ZOOM;
        this.fix_base = 8 * Constant.ZOOM;
        this.frame = 0;
        this.frame_index = 0;
        this.frame_state = this.frameState();
        this.color_frame = 8 * Constant.FRAME_FACTOR;
        this.x_max = Constant.BASE_STAGE_WIDTH * Constant.ZOOM - 15 * Constant.ZOOM;
        this.y_max = Constant.BASE_STAGE_HEIGHT * Constant.ZOOM - 15 * Constant.ZOOM;
    }

    incrFrame() {
        ++this.frame;
    }

    *frameState() {
        while (1) {
            for (let i = 0;i < 2;++i) {
                for (let j = 0;j < 4;++j) {
                    yield i;
                }
            }
        }
    }

    getNextFrameIndex() {
        this.frame_index = this.frame_state.next().value;
        return this.frame_index;
    }

    getFrameIndex() {
        return this.frame_index;
    }

    getColorFrame() {
        return this.color_frame;
    }

    getLevel() {
        return this.level;
    }

    getRole() {
        return this.role;
    }

    getCenterPoint() {
        let size = this.getRelativeSize();
        return {x: this.x + (size.w >> 1), y: this.y + (size.h >> 1)};
    }

    getType() {
        return this.type;
    }

    getTag() {
        let tag = [];
        for (let color of this.color) {
            tag.push(this.type + '-' + color + '-' + this.direct);
        }

        return tag;
    }

    getDirect() {
        return this.direct;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    alignX(x) {
        let t = x + this.fix_vertical;
        let fix = Math.round(t / this.fix_base) * this.fix_base;
        return fix - this.fix_vertical;
    }

    alignY(y) {
        let t = y + this.fix_horizontal;
        let fix = Math.round(t / this.fix_base) * this.fix_base;
        return fix - this.fix_horizontal;
    }

    predictPoint(direct) {
        let x = this.x;
        let y = this.y;
        switch (direct) {
            case Constant.DIRECT_LEFT:
                x -= this.speed;
                y = this.alignY(y);
                break;
            case Constant.DIRECT_UP:
                y -= this.speed;
                x = this.alignX(x);
                break;
            case Constant.DIRECT_RIGHT:
                x += this.speed;
                y = this.alignY(y);
                break;
            case Constant.DIRECT_DOWN:
                y += this.speed;
                x = this.alignX(x);
                break;
        }

        return {x, y};
    }

    alignPoint() {
        let x = this.x;
        let y = this.y;
        switch (this.direct) {
            case Constant.DIRECT_LEFT:
                y = this.alignY(y);
                x = Math.min(x, this.x_max);
                x = Math.max(x, 0);
                break;
            case Constant.DIRECT_UP:
                x = this.alignX(x);
                y = Math.min(y, this.y_max);
                y = Math.max(y, 0);
                break;
            case Constant.DIRECT_RIGHT:
                y = this.alignY(y);
                x = Math.min(x, this.x_max);
                x = Math.max(x, 0);
                break;
            case Constant.DIRECT_DOWN:
                x = this.alignX(x);
                y = Math.min(y, this.y_max);
                y = Math.max(y, 0);
                break;
        }

        this.x = x;
        this.y = y;
    }

    shot() {
        let bullet = new Bullet(this.bullet_id++, this, this.bullet_level, this.direct, this.bullet_speed);
        this.bullets.push(bullet);

        let x = this.x;
        let y = this.y;
        let offset1 = bullet.height >> 1;
        let offset2 = (this.width - bullet.width) >> 1;
        // 发射时有半个在弹膛内
        switch (this.direct) {
            case Constant.DIRECT_LEFT:
                x -= offset1;
                y += offset2;
                break;
            case Constant.DIRECT_UP:
                x += offset2;
                y -= offset1;
                break;
            case Constant.DIRECT_RIGHT:
                x += this.height - offset1;
                y += offset2;
                break;
            case Constant.DIRECT_DOWN:
                x += offset2;
                y += this.height - offset1;
                break;
        }

        bullet.moveTo(x, y);
    }

    getBullets() {
        return this.bullets;
    }

    clearBullet(bullet) {
        let id = bullet.getId();
        let index = -1;
        for (let b of this.bullets) {
            ++index;
            if (b.getId() === id) {
                this.bullets.splice(index, 1);
                break;
            }
        }
    }

    setSkating() {}

    setNormal() {}

    beShot(bullet) {}
}
