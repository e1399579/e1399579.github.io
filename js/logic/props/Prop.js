class Prop {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 16 * Constant.ZOOM;
        this.height = 15 * Constant.ZOOM;
        this.type = null;
        this.frame = 0;
        this.total = 1830 * Constant.FRAME_FACTOR;
        this.every = this.every(6 * Constant.FRAME_FACTOR);
    }

    getType() {
        return this.type;
    }

    incrFrame() {
        ++this.frame;
    }

    isTimeout() {
        return this.frame > this.total;
    }

    isDisplay() {
        return this.every.next().value;
    }

    getRect() {
        return [this.x, this.y, this.width, this.height];
    }

    *every(n) {
        while(1) {
            for (let i of [true, false]) {
                for (let j = 0;j < n;++j) {
                    yield i;
                }
            }
        }
    }

    beDash(player, state) {
        ++state.stats[player.getId() - 1].props;
        state.animations.push(new Score(null, {
            x: this.x + (this.width >> 1),
            y: this.y + (this.height >> 1),
            type: Constant.SCORE_PROPS.toString(),
        }));
        this.work(player, state);
    }

    work(player, state) {}
}