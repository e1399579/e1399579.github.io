class LingerFrame extends Animation {
    doPlay(ui, ctx) {
        let type = this.config.type;
        let x = this.config.x + this.config.offset;
        let y = this.config.y + this.config.offset;


        let rect = ui.images['animation'][type];
        let width = rect[2] * Constant.ZOOM;
        let height = rect[3] * Constant.ZOOM;
        ctx.drawImage(ui.source, ...rect, x -  (width >> 1), y - (height >> 1), width, height);
    }

    getLayer() {
        return 1;
    }
}