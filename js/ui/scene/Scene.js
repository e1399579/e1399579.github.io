class Scene {
    constructor(state, ui) {
        this.state = state;
        this.ui = ui;
        this.request_id = null;
    }

    renderBg() {}

    refreshBg() {}

    render(timestamp) {
        ++this.ui.frame;
    }

    stop() {
        cancelAnimationFrame(this.request_id);
    }

    abort() {}

    renderBrickFont(map, source_rects, ctx) {
        let square_size = 8 * Constant.ZOOM;
        let part_size = 4 * Constant.ZOOM;
        for (let i = 0;i < map.length;++i) {
            for (let j = 0, len = map[i].length;j < len;++j) {
                let char = map[i][j];
                let code = parseInt(char, 16);
                if (0 === code) continue;
                let point = [j * square_size, i * square_size];
                let source_rect, dest_rect;
                if (code & Constant.WALL_1) {
                    source_rect = source_rects[0];
                    dest_rect = [point[0], point[1], part_size, part_size];
                    ctx.drawImage(this.ui.source, ...source_rect, ...dest_rect);
                }

                if (code & Constant.WALL_2) {
                    source_rect = source_rects[1];
                    dest_rect = [point[0] + part_size, point[1], part_size, part_size];
                    ctx.drawImage(this.ui.source, ...source_rect, ...dest_rect);
                }

                if (code & Constant.WALL_3) {
                    source_rect = source_rects[2];
                    dest_rect = [point[0], point[1] + part_size, part_size, part_size];
                    ctx.drawImage(this.ui.source, ...source_rect, ...dest_rect);
                }

                if (code & Constant.WALL_4) {
                    source_rect = source_rects[3];
                    dest_rect = [point[0] + part_size, point[1] + part_size, part_size, part_size];
                    ctx.drawImage(this.ui.source, ...source_rect, ...dest_rect);
                }
            }
        }
    }

    pause() {}
}