class MoveFrame extends Animation {
    constructor() {
        super(...arguments);

        this.x = this.config.from.x;
        this.y = this.config.from.y;
        let move_width = this.config.to.x - this.x;
        let move_height = this.config.to.y - this.y;
        this.speed_x = move_width / this.total;
        this.speed_y = move_height / this.total;
    }

    doPlay(ui, ctx) {
        if (this.frame <= this.total) {
            this.x += this.speed_x;
            this.y += this.speed_y;
        } else {
            // 浮点数计算、刷新时间等原因会有细微差别，此处修正坐标，确保最终是正确的
            this.x = this.config.to.x;
            this.y = this.config.to.y;
        }
        this.draw(ui, ctx, this.x, this.y);
    }

    skip(ui, ctx) {
        if (!this.is_complete) {
            // 确保跳过只能执行一次
            this.is_complete = true;
            this.draw(ui, ctx, this.config.to.x, this.config.to.y);
        }
    }

    draw(ui, ctx, x, y) {}
}