class OpenFrame extends Animation {
    constructor(total, config = {}, delay = 0) {
        total = 20 * Constant.FRAME_FACTOR;
        super(total, config, delay);

        this.i = 0;
        this.speed = (Constant.BASE_SCREEN_HEIGHT >> 1) * Constant.ZOOM / total;
    }

    doPlay(ui, ctx) {
        // 从中间逐渐向外侧增加清除区域
        let width = ui.screen_width;
        let half_h = this.speed * this.i;
        let middle = ui.screen_height >> 1;
        let y1 = middle - half_h;
        let y2 = middle + half_h;
        if (y1 > 0) {
            ctx.clearRect(0, y1, width, this.speed);
            ctx.clearRect(0, y2, width, -this.speed);
            ++this.i;
        }
    }
}