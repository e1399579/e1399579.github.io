class Pause extends BlinkFrame {
    constructor(total, config = {}, delay = 0) {
        config.x = 101 * Constant.ZOOM;
        config.y = 121 * Constant.ZOOM;
        config.width = 5 * Constant.BASE_FONT_SIZE * Constant.ZOOM;
        config.height = Constant.BASE_FONT_SIZE * Constant.ZOOM;
        config.frame_every = 16 * Constant.FRAME_FACTOR;
        super(total, config, delay);
    }

    draw(ui, ctx, x, y) {
        ctx.fillStyle = "#E05000";
        ctx.fillText("PAUSE", x, y);
    }
}