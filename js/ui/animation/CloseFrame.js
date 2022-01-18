class CloseFrame extends Animation {
    constructor(total, config = {}, delay = 0) {
        total = 20 * Constant.FRAME_FACTOR;
        super(total, config, delay);

        this.i = 0;
        this.speed = (Constant.BASE_SCREEN_HEIGHT >> 1) * Constant.ZOOM / total;
    }

    doPlay(ui, ctx) {
        // 从外侧逐渐向内测填充
        ctx.fillStyle = this.config.color;

        let width = ui.screen_width;
        let y1 = this.speed * this.i;
        let y2 = ui.screen_height - y1;
        if (y1 <= y2) {
            ctx.fillRect(0, y1, width, this.speed);
            ctx.fillRect(0, y2, width, -this.speed);

            ++this.i;
        }
    }
}