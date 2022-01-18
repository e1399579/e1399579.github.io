class Bomb extends SwitchFrame {
    constructor(total, config = {}, delay = 0) {
        total = 12 * Constant.FRAME_FACTOR;
        config.frame_every = 4 * Constant.FRAME_FACTOR;
        config.frame_len = 3;
        config.type = "bomb1";
        super(total, config, delay);
    }
}
