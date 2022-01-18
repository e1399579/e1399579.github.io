// 选择界面
class Menu extends Scene {
    map = [
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "000A73D0EB403F303F30F000F3300000",
        "000ADC7A50F00F000F00F000FC400000",
        "000A50FA73F00F000F00F000F0000000",
        "00023312103003000300333033300000",
        "00000000000000000000000000000000",
        "0000000087B42B712B71A5A500000000",
        "00000000F0000A500A502DE100000000",
        "00000000B4840A500A500A5000000000",
        "00000000033023310210021000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
        "00000000000000000000000000000000",
    ];

    constructor() {
        super(...arguments);
        this.renderBg();
        let screen_height = this.ui.screen_height;
        this.animation = new class extends MoveFrame {
            constructor() {
                super(240, {
                    from: {x: 0, y: screen_height},
                    to: {x: 0, y: 0},
                });
            }

            draw(ui, ctx, x, y) {
                ctx.clearRect(0, 0, ui.screen_width, ui.screen_height);
                // 底层为黑色，此处不必再次填充

                ctx.drawImage(ui.offscreen, x, y);
            }
        };
    }

    renderBg() {
        this.ui.bg1_ctx.fillStyle = "black";
        this.ui.bg1_ctx.fillRect(0, 0, this.ui.screen_width, this.ui.screen_height);

        // 砖块
        let source_rects = this.ui.images['stage_map']['brick-welcome-parts'];
        this.renderBrickFont(this.map, source_rects, this.ui.offscreen_ctx);

        // 菜单
        this.ui.offscreen_ctx.fillStyle = "white";
        this.ui.offscreen_ctx.fillText("1 PLAYER", 89 * Constant.ZOOM, 136 * Constant.ZOOM);
        this.ui.offscreen_ctx.fillText("2 PLAYERS", 89 * Constant.ZOOM, 152 * Constant.ZOOM);
        this.ui.offscreen_ctx.fillText("CONSTRUCTION", 89 * Constant.ZOOM, 168 * Constant.ZOOM);
    }

    render(timestamp) {
        super.render(timestamp);
        this.request_id = requestAnimationFrame(this.render.bind(this)); // 若放到最后，则无法自动停止，故放在前面

        // 背景
        if (!this.animation.isComplete()) {
            this.animation.play(this.ui, this.ui.ctx);
        } else {
            this.state.setComplete();
            // 刷新坦克
            let c_rect = this.state.getFocusClearRect();
            this.ui.ctx.clearRect(...c_rect)
            let s_rects = this.ui.images['player']['basic-yellow-2'];
            let s_rect = s_rects[this.ui.getNextFrameIndex(3, s_rects.length)];
            let d_rect = this.state.getFocusRect();
            this.ui.ctx.drawImage(this.ui.source, ...s_rect, ...d_rect);
        }
    }

    abort() {
        this.animation.skip(this.ui, this.ui.ctx);
    }
}