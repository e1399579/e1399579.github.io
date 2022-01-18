class Reborn extends SwitchFrame {
    constructor(total, config = {}, delay = 0) {
        config.frame_every = 4 * Constant.FRAME_FACTOR;
        config.frame_len = 7;
        config.width = 15 * Constant.ZOOM;
        config.height = 15 * Constant.ZOOM;
        // 传入的是原点，转化成中心点
        config.x += config.width / 2;
        config.y += config.height / 2;
        config.type = "reborn";
        super(total, config, delay);
    }
}