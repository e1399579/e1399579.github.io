class Bomb2 extends SwitchFrame {
    constructor(total, config = {}, delay = 0) {
        total = 36 * Constant.FRAME_FACTOR;
        config.frame_every = 6 * Constant.FRAME_FACTOR;
        config.frame_len = 6;
        config.type = "bomb2";
        super(total, config, delay);
    }
}
