class Score extends LingerFrame {
    constructor(total, config = {}, delay = 0) {
        total = 10;
        config.offset = Constant.BASE_STAGE_OFFSET * Constant.ZOOM;
        super(total, config, delay);
    }
}