class BlinkFrame extends Animation {
    constructor(total, config = {}, delay = 0) {
        super(total, config, delay);
        this.every = this.every(this.config.frame_every);
        this.fn = function (ctx) {
            ctx.clearRect(this.config.x - 1, this.config.y, this.config.width + 1, this.config.height + 1);
        };
    }

    doPlay(ui, ctx) {
        this.fn(ctx);
        if (this.every.next().value) {
            this.draw(ui, ctx, this.config.x, this.config.y);
        } else if (this.config.color) {
            ctx.fillStyle = this.config.color;
            ctx.fillRect(this.config.x - 1, this.config.y - 1, this.config.width + 1, this.config.height + 1);
        }
    }

    draw(ui, ctx, x, y) {}

    *every(n) {
        while(1) {
            for (let i of [true, false]) {
                for (let j = 0;j < n;++j) {
                    yield i;
                }
            }
        }
    }
}