class Settle extends Scene {
    constructor() {
        super(...arguments);
        this.renderBg();
        this.setAnimation();
    }

    renderBg() {
        let data = this.state.getData();
        this.ui.bg3_ctx.fillStyle = "black";
        this.ui.bg3_ctx.fillRect(0, 0, this.ui.screen_width, this.ui.screen_height);

        // 标题与摘要
        this.ui.bg3_ctx.fillStyle = "#E05000";
        this.ui.bg3_ctx.fillText("HI-SCORE", 65 * Constant.ZOOM, 24 * Constant.ZOOM);
        this.ui.bg3_ctx.fillText("20000", 153 * Constant.ZOOM, 24 * Constant.ZOOM);
        this.ui.bg3_ctx.fillStyle = "white";
        this.ui.bg3_ctx.fillText("STAGE", 97 * Constant.ZOOM, 40 * Constant.ZOOM);

        // 右对齐
        this.ui.bg3_ctx.textAlign = "right";
        this.ui.bg3_ctx.fillText(data.stage.toString(), 161 * Constant.ZOOM, 40 * Constant.ZOOM);

        // 以第1个PTS右坐标为基准
        let base_x = 89 * Constant.ZOOM;
        let spacing_x = 144 * Constant.ZOOM;
        let base_y = 96 * Constant.ZOOM;
        let spacing_y = 24 * Constant.ZOOM;
        let arrows = ["←", "→"];
        let stats = data.stats;
        let arrow_x = base_x + 32 * Constant.ZOOM;
        let romans = ["roman-1", "roman-2"];
        let roman_base_x = 24 * Constant.ZOOM;
        let roman_y = 56 * Constant.ZOOM;
        let roman_spacing_x = 144 * Constant.ZOOM;
        for (let i = 0;i < data.player_num;++i) {
            let x = base_x + i * spacing_x;
            // 得分
            let type = romans[i];
            let roman_x = roman_base_x + i * roman_spacing_x;
            this.ui.bg3_ctx.drawImage(this.ui.source, ...this.ui.images['hud'][type], roman_x, roman_y, 8 * Constant.ZOOM, 8 * Constant.ZOOM);
            this.ui.bg3_ctx.fillStyle = "#E05000";
            this.ui.bg3_ctx.fillText("-PLAYER", x, 56 * Constant.ZOOM);
            this.ui.bg3_ctx.fillStyle = "#FFA000";
            this.ui.bg3_ctx.fillText(stats[i].score.toString(), x, 72 * Constant.ZOOM);
            // PTS & arrow
            this.ui.bg3_ctx.fillStyle = "white";
            let arrow = arrows[i];
            for (let j = 0;j < 4;++j) {
                let y = base_y + j * spacing_y;
                this.ui.bg3_ctx.fillText("PTS", x, y);
                this.ui.bg3_ctx.fillText(arrow, arrow_x + i * 24 * Constant.ZOOM, y);
            }
        }

        // 各类型坦克
        let tank_x = base_x + 33 * Constant.ZOOM;
        let tank_y = 93 * Constant.ZOOM;
        let types = ["basic", "fast", "power", "armor"];
        for (let j = 0;j < 4;++j) {
            let type = types[j] + "-silver-1";
            this.ui.bg3_ctx.drawImage(this.ui.source, ...this.ui.images['enemy'][type][0],
                tank_x, tank_y + 24 * Constant.ZOOM * j, 15 * Constant.ZOOM, 15  * Constant.ZOOM);
        }

        // 分界线
        let rect = [96, 181, 64, 2].map(x => x * Constant.ZOOM);
        this.ui.bg3_ctx.fillStyle = "white";
        this.ui.bg3_ctx.fillRect(...rect);

        // 总计
        this.ui.bg3_ctx.fillText("TOTAL", base_x, 184 * Constant.ZOOM);
    }

    setAnimation() {
        let data = this.state.getData();
        // PTS分数，4行，2列/4列，从左至右分别为分数、个数
        let stats = data.stats;
        let type_map = ["basic", "fast", "power", "armor"];
        let lines = [];
        for (let i = 0;i < 4;++i) {
            let y = 96 + 24 * i;
            let type = type_map[i];
            lines[i] = [];
            for (let j = 0;j < data.player_num;++j) {
                let p1 = [57 + 144 * j, y].map(x => x * Constant.ZOOM);
                let p2 = [113 + 48 * j, y].map(x => x * Constant.ZOOM);
                let stat = stats[j];
                let tank_score = stat.items[type];
                lines[i].push([[tank_score[1], Constant.SCORE_DICTIONARY[type]], p1]); // 该种类分数
                lines[i].push([[tank_score[0], 1], p2]); // 该种类个数
            }
        }

        // 总分
        lines[4] = [];
        for (let j = 0;j < data.player_num;++j) {
            let p = [113 + 48 * j, 184].map(x => x * Constant.ZOOM);
            let stat = stats[j];
            let total_num = stat.total_num;
            lines[4].push([[total_num, total_num], p]);
        }
        this.animation = new RisingNumber(null, {lines});
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
            this.stop();
            this.animation.finish(this);
        }
    }
}