class GameOver extends MoveFrame {
    constructor(total, config = {}, delay = 0) {
        let x = 105 * Constant.ZOOM;
        let y = Constant.BASE_SCREEN_HEIGHT * Constant.ZOOM;
        total = 126;
        config = {
            from: {x, y},
            to: {x, y: 106 * Constant.ZOOM},
        };
        delay = 128;
        super(total, config, delay);
    }

    draw(ui, ctx, x, y) {
        ctx.fillStyle = "#E05000";
        ctx.fillText("GAME", x, y);
        ctx.fillText("OVER", x, y + ui.font_size);
    }

    getLayer() {
        return 1;
    }
}