class Play extends Scene {
    constructor() {
        super(...arguments);

        this.stage_width = Constant.BASE_STAGE_WIDTH * Constant.ZOOM;
        this.stage_height = Constant.BASE_STAGE_HEIGHT * Constant.ZOOM;
        this.offset = Constant.BASE_STAGE_OFFSET * Constant.ZOOM;

        this.dynamic = []; // 收集动态图片元素，如河流
        this.dynamic_prev = 0;
        this.dynamic_series_len = 0;

        let left = 232 * Constant.ZOOM;
        let top = 25 * Constant.ZOOM;
        this.hud = {
            fill_style: "#7F7F7F",
            segment: 8 * Constant.ZOOM,
            number_width: 8 * Constant.ZOOM,
            number_height: 8 * Constant.ZOOM,
            ai_origin_x: left,
            ai_origin_y: top,
            ai_width: 8 * Constant.ZOOM,
            ai_height: 8 * Constant.ZOOM,
            player_origin_x: left,
            player_origin_y: 136 * Constant.ZOOM,
            player_width: 8 * Constant.ZOOM,
            player_height: 8 * Constant.ZOOM,
            np_width: 16 * Constant.ZOOM,
            np_height: 8 * Constant.ZOOM,
            flag_origin_x: 232 * Constant.ZOOM,
            flag_origin_y: 184 * Constant.ZOOM,
            flag_width: 16 * Constant.ZOOM,
            flag_height: 16 * Constant.ZOOM,
            flag_number_rect: [232 * Constant.ZOOM, 200 * Constant.ZOOM, 16 * Constant.ZOOM, 8 * Constant.ZOOM],
        };
        this.prev_hud = {};
        this.bg3_used = false;

        this.renderBg();
    }

    fixPoint(point) {
        return [point.x + this.offset, point.y + this.offset];
    }

    fixRect(rect) {
        let copy = [];
        copy.push(...rect);
        copy[0] += this.offset;
        copy[1] += this.offset;
        return copy;
    }

    getHUDAiPoint(i) {
        let row = i >> 1;
        let col = i & 1;
        let x = this.hud.ai_origin_x + col * this.hud.ai_width;
        let y = this.hud.ai_origin_y + row * this.hud.ai_height;
        return [x, y, this.hud.ai_width, this.hud.ai_height];
    }

    getHUDPlayerPoint(i, life) {
        let np = {
            type: (i + 1) + "P",
            rect: [
                this.hud.player_origin_x,
                this.hud.player_origin_y + i * (this.hud.np_height + this.hud.player_height + this.hud.segment),
                this.hud.np_width,
                this.hud.np_height,
            ],
        };
        let player = {
            type: "player",
            rect: [
                np.rect[0],
                np.rect[1] + this.hud.player_height,
                this.hud.player_width,
                this.hud.player_height,
            ],
        };
        let player_life = {
            text: life.toString(),
            rect: [
                249 * Constant.ZOOM,
                player.rect[1],
                -this.hud.number_width, // 右对齐，反向擦除
                this.hud.number_height,
            ],
        };

        return {np, player, player_life};
    }

    getStageNumPoint(stage) {
        stage = stage.toString();
        let x = 249 * Constant.ZOOM;
        let y = 200 * Constant.ZOOM;
        return {
            text: stage,
            rect: [x, y],
        };
    }

    updateHud(hud) {
        this.prev_hud = {
            ai_num: hud.ai_num,
            players_life: [...hud.players_life],
            stage: hud.stage,
        };
    }

    renderBg() {
        // 清除画布
        this.ui.bg1_ctx.clearRect(0, 0, this.ui.screen_width, this.ui.screen_height);
        this.ui.bg2_ctx.clearRect(0, 0, this.ui.screen_width, this.ui.screen_height);

        // 填充可视区域为灰色
        this.ui.bg1_ctx.fillStyle = this.hud.fill_style;
        this.ui.bg1_ctx.fillRect(0, 0, this.ui.screen_width, this.ui.screen_height);
        // 清除战场区域，并填充为黑色
        this.ui.bg1_ctx.clearRect(this.offset, this.offset, this.stage_width, this.stage_height);
        this.ui.bg1_ctx.fillStyle = "black";
        this.ui.bg1_ctx.fillRect(this.offset, this.offset, this.stage_width, this.stage_height);
        // 绘制地形
        let stage_map = this.state.getStageMap();
        stage_map.forEach((data, i) => {
            data.forEach((element, j) => {
                if (!element) return;

                let type = element.getType();
                let rect = this.ui.images['stage_map'][type];
                // 河流需要切换图片，这里先不做处理
                if (Array.isArray(rect[0])) {
                    this.dynamic_series_len = Math.max(this.dynamic_series_len, rect.length);
                    this.dynamic.push([i, j]);
                    return;
                }

                let point = this.fixPoint(element.getPoint());
                let size = element.getRelativeSize();
                let bg_ctx;
                if (element.getMapFlag() === Constant.MAP_FOREST) {
                    bg_ctx = this.ui.bg2_ctx;
                } else {
                    bg_ctx = this.ui.bg1_ctx;
                }

                bg_ctx.drawImage(this.ui.source, ...rect, ...point, size.w, size.h);
            });
        });
        // 绘制HUD
        let hud_img = this.ui.images['hud'];
        let hud = this.state.getHUD();
        this.updateHud(hud);
        // AI编组
        for (let i = 0;i < hud.ai_num;++i) {
            let p = this.getHUDAiPoint(i);
            let rect = hud_img['ai'];
            this.ui.bg1_ctx.drawImage(this.ui.source, ...rect, ...p);
        }
        // 玩家编组
        this.ui.bg1_ctx.fillStyle = "black";
        this.ui.bg1_ctx.textAlign = "right";
        for (let i = 0;i < hud.players_life.length;++i) {
            let meta = this.getHUDPlayerPoint(i, hud.players_life[i]);
            this.ui.bg1_ctx.drawImage(this.ui.source, ...hud_img[meta.np.type], ...meta.np.rect);
            this.ui.bg1_ctx.drawImage(this.ui.source, ...hud_img[meta.player.type], ...meta.player.rect);
            this.ui.bg1_ctx.fillText(meta.player_life.text, meta.player_life.rect[0], meta.player_life.rect[1]);
        }
        // 旗帜
        this.ui.bg1_ctx.drawImage(this.ui.source, ...hud_img['flag'], this.hud.flag_origin_x, this.hud.flag_origin_y, this.hud.flag_width, this.hud.flag_height);
        let meta = this.getStageNumPoint(hud.stage);
        this.ui.bg1_ctx.fillText(meta.text, meta.rect[0], meta.rect[1]);
    }

    refreshBg() {
        // 刷新被破坏的砖块
        let elements = this.state.getChangedTile();
        for (let element of elements) {
            // 填充黑色（底色）
            let rect = this.fixRect(element.getRect());
            this.ui.bg1_ctx.fillStyle = "black";
            this.ui.bg1_ctx.fillRect(...rect);

            if (!element.isDestroy()) {
                // 未摧毁则需要重绘（可能形态与原来不一样）
                let type = element.getType();
                let s_rect = this.ui.images['stage_map'][type];
                this.ui.bg1_ctx.drawImage(this.ui.source, ...s_rect, ...rect);

                // 需要擦除的区域填充黑色
                let clear_rect = element.getClearRect();
                if (clear_rect.length) {
                    clear_rect = this.fixRect(clear_rect);
                    this.ui.bg1_ctx.fillStyle = "black";
                    this.ui.bg1_ctx.fillRect(...clear_rect);
                }
            }
        }
        this.state.setChangedComplete();

        // 渲染河流，不停地换帧达到动画效果
        if (this.dynamic_series_len <= 0) return;
        let index = this.ui.getNextFrameIndex(32, this.dynamic_series_len);
        if (index === this.dynamic_prev) return; // 未到刷新时间，不做变更

        this.dynamic_prev = index;
        let stage_map = this.state.getStageMap();
        for (let [row, col] of this.dynamic) {
            let element = stage_map[row][col];
            let type = element.getType();
            let point = this.fixPoint(element.getPoint());
            let rect = this.ui.images['stage_map'][type][index];
            let size = element.getRelativeSize();
            this.ui.bg1_ctx.clearRect(...point, size.w, size.h);
            this.ui.bg1_ctx.drawImage(this.ui.source, ...rect, ...point, size.w, size.h);
        }
    }

    refreshHUD() {
        // 比较变更，擦除/替换
        let hud_img = this.ui.images['hud'];
        let hud = this.state.getHUD();
        // AI编组，擦除
        for (let i = hud.ai_num;i < this.prev_hud.ai_num;++i) {
            let p = this.getHUDAiPoint(i);
            this.ui.bg1_ctx.fillStyle = this.hud.fill_style;
            this.ui.bg1_ctx.fillRect(...p);
        }
        // 玩家编组，替换
        for (let i = 0;i < hud.players_life.length;++i) {
            if (hud.players_life[i] === this.prev_hud.players_life[i]) continue;

            let meta = this.getHUDPlayerPoint(i, hud.players_life[i]);
            this.ui.ctx.clearRect(...meta.player_life.rect);
            this.ui.bg1_ctx.fillStyle = this.hud.fill_style;
            this.ui.bg1_ctx.fillRect(...meta.player_life.rect);
            this.ui.bg1_ctx.fillStyle = "black";
            this.ui.bg1_ctx.textAlign = "right";
            this.ui.bg1_ctx.fillText(meta.player_life.text, meta.player_life.rect[0], meta.player_life.rect[1]);
        }
        // 旗帜数字，替换
        if (hud.stage !== this.prev_hud.stage) {
            this.ui.bg1_ctx.clearRect(...this.hud.flag_number_rect);
            let meta = this.getStageNumPoint(hud.stage);
            this.ui.bg1_ctx.fillStyle = "black";
            this.ui.bg1_ctx.textAlign = "right";
            this.ui.bg1_ctx.fillText(meta.text, meta.rect[0], meta.rect[1]);
        }

        this.updateHud(hud);
    }

    render(timestamp) {
        super.render(timestamp);
        this.request_id = requestAnimationFrame(this.render.bind(this));

        this.ui.ctx.clearRect(0, 0, this.ui.screen_width, this.ui.screen_height); // 清除画布
        this.state.preprocess();
        // 绘制顺序：[河流、冰面、砖块、钢块]、[坦克、子弹、动画]、[森林、得分、道具]、[pause、game over]

        // 先刷新玩家、AI、子弹等数据
        let players = this.state.getPlayers();
        let tanks = this.state.getTanks();
        let bullets = this.state.getBullets();
        let props = this.state.getProps();

        // 底层：刷新砖块、河流、HUD
        this.refreshBg();
        this.refreshHUD();

        // 中层：活动的单位
        // 玩家
        for (let player of players) {
            let point = this.fixPoint(player.getPoint());
            let role = player.getRole();
            let is_move = player.isMove();
            let colors = player.getTag();
            let color = colors[0];
            let rects = this.ui.images[role][color];
            let frame_index = is_move ? player.getNextFrameIndex() : player.getFrameIndex();
            let rect = rects[frame_index];
            let size = player.getRelativeSize();
            this.ui.ctx.drawImage(this.ui.source, ...rect, ...point, size.w, size.h);

            // 状态
            if (player.isInvulnerable()) {
                rects = this.ui.images['animation']['player-invulnerable'];
                rect = rects[this.ui.getNextFrameIndex(2, rects.length)];
                let w = rect[2] * Constant.ZOOM;
                let h = rect[3] * Constant.ZOOM;
                this.ui.ctx.drawImage(this.ui.source, ...rect, point[0] - (w - size.w) / 2, point[1] - (h - size.h) / 2, w, h);
            }
        }

        // 坦克
        for (let tank of tanks) {
            let point = this.fixPoint(tank.getPoint());
            let role = tank.getRole();
            let colors = tank.getTag();
            let color_frame = tank.getColorFrame();
            let color_index = colors.length > 1 ? this.ui.getNextFrameIndex(color_frame, colors.length) : 0;
            let color = colors[color_index];
            let rects = this.ui.images[role][color];
            let frame_index = this.state.freeze ? tank.getFrameIndex() : tank.getNextFrameIndex();
            let rect = rects[frame_index];
            let size = tank.getRelativeSize();
            this.ui.ctx.drawImage(this.ui.source, ...rect, ...point, size.w, size.h);
        }

        // 子弹
        for (let bullet of bullets) {
            let point =  this.fixPoint(bullet.getPoint());
            let rect = this.ui.images['bullet'][bullet.getDirect()];
            let size = bullet.getRelativeSize();
            this.ui.ctx.drawImage(this.ui.source, ...rect, ...point, size.w, size.h);
        }

        // 部分动画和道具需要展示在最高层，如GAME OVER、分数，将之前用过的清除
        if (this.bg3_used) {
            this.ui.bg3_ctx.clearRect(0, 0, this.ui.screen_width, this.ui.screen_height);
        }

        // 动画
        let layers = [this.ui.ctx, this.ui.bg3_ctx];
        let layers_used = [0, 0];
        for (let animation of this.state.getAnimations()) {
            let layer = animation.getLayer();
            animation.play(this.ui, layers[layer]);
            ++layers_used[layer];
        }

        // 道具
        for (let prop of props) {
            let is_display = prop.isDisplay();
            let type = prop.getType();
            let s_rect = this.ui.images['props'][type];
            let d_rect = this.fixRect(prop.getRect());
            if (is_display) {
                this.ui.bg3_ctx.drawImage(ui.source, ...s_rect, ...d_rect);
            } else {
                this.ui.bg3_ctx.clearRect(...d_rect);
            }
        }

        this.bg3_used = layers_used[1] + props.length > 0;
    }
}