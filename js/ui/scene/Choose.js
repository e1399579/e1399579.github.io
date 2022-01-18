// 开幕，选择关卡
class Choose extends Scene {
    constructor() {
        super(...arguments);
        this.renderBg();
        this.setAnimation();
    }

    renderBg() {
        this.ui.bg3_ctx.clearRect(0, 0, this.ui.screen_width, this.ui.screen_height);
    }

    setAnimation() {
        this.animation = new CloseFrame(null, {color: "#7F7F7F"});
        this.animation.onFinish(function () {
            this.state.setCompleted();
        });
    }

    render(timestamp) {
        super.render(timestamp);
        this.request_id = requestAnimationFrame(this.render.bind(this));

        if (!this.animation.isComplete()) {
            this.animation.play(this.ui, this.ui.bg3_ctx);
        } else {
            let rect = this.state.getClearRect();
            this.ui.bg3_ctx.clearRect(...rect);
            let metas = this.state.getTextRect();
            this.ui.bg3_ctx.fillStyle = "#7F7F7F";
            this.ui.bg3_ctx.fillRect(...rect);
            this.ui.bg3_ctx.fillStyle = "black";
            this.ui.bg3_ctx.fillText(metas[0][0], ...metas[0][1]);
            this.ui.bg3_ctx.fillText(metas[1][0], ...metas[1][1]);

            this.animation.finish(this);
        }
    }
}