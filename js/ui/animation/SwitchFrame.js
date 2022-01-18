class SwitchFrame extends Animation {
    constructor() {
        super(...arguments);
        this.switch_index = this.switchIndex(this.config.frame_every, this.config.frame_len);

        // TODO 优化此处硬编码
        this.offset = Constant.BASE_STAGE_OFFSET * Constant.ZOOM;
    }

    doPlay(ui, ctx) {
        let type = this.config.type;
        let x = this.config.x + this.offset;
        let y = this.config.y + this.offset;

        let rects = ui.images['animation'][type];
        let index = this.switch_index.next().value;
        let rect = rects[index];
        let width = rect[2] * Constant.ZOOM;
        let height = rect[3] * Constant.ZOOM;
        ctx.drawImage(ui.source, ...rect, x -  (width >> 1), y - (height >> 1), width, height);
    }

    *switchIndex(every, len) {
        while(1) {
            for (let i = 0;i < len;++i) {
                for (let j = 0;j < every;++j) {
                    yield i;
                }
            }
        }
    }
}