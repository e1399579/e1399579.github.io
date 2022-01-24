class GameUI {
    /**
     * @param {HTMLCanvasElement[]} layers
     */
    constructor(layers) {
        this.layers = layers;

        this.scene = null;
        this.images = {};
        this.source = null;
        this.frame = 0;

        this.canvas = layers[1];
        this.bg1 = layers[0];
        this.bg2 = layers[2];
        this.bg3 = layers[3];
        this.resize(3);

        this.ga = new GameAudio();
    }

    resize(zoom) {
        Constant.ZOOM = zoom;
        let canvas_width = Constant.BASE_SCREEN_WIDTH * Constant.ZOOM;
        let canvas_height = Constant.BASE_SCREEN_HEIGHT * Constant.ZOOM;
        for (let canvas of this.layers) {
            canvas.width = canvas_width;
            canvas.height = canvas_height;
        }

        this.screen_width = canvas_width;
        this.screen_height = canvas_height;

        this.ctx = this.canvas.getContext("2d", {alpha: true});
        this.bg1_ctx = this.bg1.getContext("2d", {alpha: false});
        this.bg2_ctx = this.bg2.getContext("2d", {alpha: true});
        this.bg3_ctx = this.bg3.getContext("2d", {alpha: true});
        this.offscreen = this.createCanvas(this.screen_width, this.screen_height);
        this.offscreen_ctx = this.offscreen.getContext("2d", {alpha: true});

        this.font_size = Constant.BASE_FONT_SIZE * Constant.ZOOM;
        for (let ctx of [this.ctx, this.bg1_ctx, this.bg2_ctx, this.bg3_ctx, this.offscreen_ctx]) {
            ctx.imageSmoothingEnabled = false; // 关闭抗锯齿（柔化），会导致像素模糊
            ctx.textBaseline = "top"; // 文字基线
            ctx.font = this.font_size + "px " + Constant.FONT_FAMILY; // 字体
        }
    }

    getRange() {
        return [this.screen_width, this.screen_height];
    }

    createCanvas(w, h) {
        let canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        return canvas;
    }

    createImage(path) {
        let img = new Image();
        img.src = path;
        img.loading = "eager";
        return img;
    }

    async loadMaterials() {
        this.source = this.createImage('./images/General-Sprites.png');
        await this.source.decode();
        let font = new FontFace('Press Start 2P', 'url(./fonts/PressStart2P-Regular.ttf)'); // font @see https://fonts.google.com/specimen/Press+Start+2P
        await font.load();
        document.fonts.add(font); // @see https://stackoverflow.com/questions/2756575/drawing-text-to-canvas-with-font-face-does-not-work-at-the-first-time

        await this.ga.load();

        // type: level color direct [1, 2]
        // 图像顺序：上-1 左-0 下-3 右-2
        let player = {
            'basic-yellow-1': [[0, 0, 15, 15], [16, 0, 15, 15]],
            'basic-yellow-0': [[32, 0, 15, 15], [48, 0, 15, 15]],
            'basic-yellow-3': [[64, 0, 15, 15], [80, 0, 15, 15]],
            'basic-yellow-2': [[97, 0, 15, 15], [113, 0, 15, 15]],

            'fast-yellow-1': [[0, 16, 15, 16], [16, 16, 15, 16]],
            'fast-yellow-0': [[32, 16, 16, 15], [48, 16, 16, 15]],
            'fast-yellow-3': [[64, 16, 15, 16], [80, 16, 15, 16]],
            'fast-yellow-2': [[96, 16, 16, 15], [112, 16, 16, 15]],

            'power-yellow-1': [[0, 32, 15, 15], [16, 32, 15, 15]],
            'power-yellow-0': [[32, 32, 15, 15], [48, 32, 15, 15]],
            'power-yellow-3': [[64, 33, 15, 15], [80, 33, 15, 15]],
            'power-yellow-2': [[97, 32, 15, 15], [113, 32, 15, 15]],

            'armor-yellow-1': [[0, 48, 16, 15], [16, 48, 16, 15]],
            'armor-yellow-0': [[32, 48, 15, 16], [48, 48, 15, 16]],
            'armor-yellow-3': [[64, 48, 16, 15], [80, 48, 16, 15]],
            'armor-yellow-2': [[97, 48, 15, 16], [113, 48, 15, 16]],

            'basic-green-1': [[0, 128, 15, 15], [16, 128, 15, 15]],
            'basic-green-0': [[32, 128, 15, 15], [48, 128, 15, 15]],
            'basic-green-3': [[64, 128, 15, 15], [80, 128, 15, 15]],
            'basic-green-2': [[97, 128, 15, 15], [113, 128, 15, 15]],

            'fast-green-1': [[0, 144, 15, 16], [16, 144, 15, 16]],
            'fast-green-0': [[32, 144, 16, 15], [48, 144, 16, 15]],
            'fast-green-3': [[64, 144, 15, 16], [80, 144, 15, 16]],
            'fast-green-2': [[96, 144, 16, 15], [112, 144, 16, 15]],

            'power-green-1': [[0, 160, 15, 15], [16, 160, 15, 15]],
            'power-green-0': [[32, 160, 15, 15], [48, 160, 15, 15]],
            'power-green-3': [[64, 161, 15, 15], [80, 161, 15, 15]],
            'power-green-2': [[97, 160, 15, 15], [113, 160, 15, 15]],

            'armor-green-1': [[0, 176, 16, 15], [16, 176, 16, 15]],
            'armor-green-0': [[32, 176, 15, 16], [48, 176, 15, 16]],
            'armor-green-3': [[64, 176, 16, 15], [80, 176, 16, 15]],
            'armor-green-2': [[97, 176, 15, 16], [113, 176, 15, 16]],
        };
        let enemy = {
            'basic-silver-1': [[128, 64, 15, 15], [144, 64, 15, 15]],
            'basic-silver-0': [[160, 65, 15, 15], [176, 65, 15, 15]],
            'basic-silver-3': [[192, 64, 15, 15], [208, 64, 15, 15]],
            'basic-silver-2': [[225, 64, 15, 15], [241, 64, 15, 15]],

            'fast-silver-1': [[128, 80, 15, 15], [144, 80, 15, 15]],
            'fast-silver-0': [[160, 81, 15, 15], [176, 81, 15, 15]],
            'fast-silver-3': [[192, 81, 15, 15], [208, 81, 15, 15]],
            'fast-silver-2': [[225, 80, 15, 15], [241, 80, 15, 15]],

            'power-silver-1': [[128, 96, 15, 15], [144, 96, 15, 15]],
            'power-silver-0': [[160, 97, 15, 15], [176, 97, 15, 15]],
            'power-silver-3': [[191, 96, 15, 15], [207, 96, 15, 15]],
            'power-silver-2': [[225, 96, 15, 15], [241, 96, 15, 15]],

            'armor-silver-1': [[128, 112, 15, 15], [144, 112, 15, 15]],
            'armor-silver-0': [[160, 112, 15, 15], [176, 112, 15, 15]],
            'armor-silver-3': [[192, 112, 15, 15], [208, 112, 15, 15]],
            'armor-silver-2': [[224, 112, 15, 15], [240, 112, 15, 15]],

            'armor-green-1': [[0, 240, 15, 15], [16, 240, 15, 15]],
            'armor-green-0': [[32, 240, 15, 15], [48, 240, 15, 15]],
            'armor-green-3': [[64, 240, 15, 15], [80, 240, 15, 15]],
            'armor-green-2': [[96, 240, 15, 15], [112, 240, 15, 15]],

            'armor-yellow-1': [[0, 112, 15, 15], [16, 112, 15, 15]],
            'armor-yellow-0': [[32, 112, 15, 15], [48, 112, 15, 15]],
            'armor-yellow-3': [[64, 112, 15, 15], [80, 112, 15, 15]],
            'armor-yellow-2': [[96, 112, 15, 15], [112, 112, 15, 15]],

            'basic-red-1': [[128, 192, 15, 15], [144, 192, 15, 15]],
            'basic-red-0': [[160, 193, 15, 15], [176, 193, 15, 15]],
            'basic-red-3': [[192, 192, 15, 15], [208, 192, 15, 15]],
            'basic-red-2': [[225, 192, 15, 15], [241, 192, 15, 15]],

            'fast-red-1': [[128, 208, 15, 15], [144, 208, 15, 15]],
            'fast-red-0': [[160, 209, 15, 15], [176, 209, 15, 15]],
            'fast-red-3': [[192, 209, 15, 15], [208, 209, 15, 15]],
            'fast-red-2': [[225, 208, 15, 15], [241, 208, 15, 15]],

            'power-red-1': [[128, 224, 15, 15], [144, 224, 15, 15]],
            'power-red-0': [[160, 225, 15, 15], [176, 225, 15, 15]],
            'power-red-3': [[191, 224, 15, 15], [207, 224, 15, 15]],
            'power-red-2': [[225, 224, 15, 15], [241, 224, 15, 15]],

            'armor-red-1': [[128, 240, 15, 15], [144, 240, 15, 15]],
            'armor-red-0': [[160, 240, 15, 15], [176, 240, 15, 15]],
            'armor-red-3': [[192, 240, 15, 15], [208, 240, 15, 15]],
            'armor-red-2': [[224, 240, 15, 15], [240, 240, 15, 15]],
        };
        let bullet = [
            [330, 102, 4, 3],
            [323, 102, 3, 4],
            [346, 102, 4, 3],
            [339, 102, 3, 4],
        ];
        let animation = {
            'bomb1': [[256, 127, 16, 16], [272, 127, 16, 16], [288, 127, 16, 16]],
            'bomb2': [
                [256, 127, 16, 16], [272, 127, 16, 16], [288, 127, 16, 16],
                [305, 127, 32, 32], [338, 127, 32, 32], [288, 128, 16, 16],
            ],
            'reborn': [
                [256, 96, 15, 15], [272, 96, 15, 15], [288, 96, 15, 15],
                [304, 96, 15, 15],
                [288, 96, 15, 15], [272, 96, 15, 15], [256, 96, 15, 15],
            ],
            'player-invulnerable': [[256, 144, 16, 16], [272, 144, 16, 16]],
            'player-normal': [],
            '100': [289, 164, 14, 8],
            '200': [305, 164, 14, 8],
            '300': [321, 164, 14, 8],
            '400': [337, 164, 14, 8],
            '500': [353, 164, 14, 8],
        };
        let stage_map = {
            'brick': [256, 64, 8, 8],
            'steel': [256, 72, 8, 8],
            'forest': [264, 72, 8, 8],
            'ice': [272, 72, 8, 8],
            'river': [[264, 80, 8, 8], [272, 80, 8, 8]], // [256, 80, 8, 8],
            'eagle': [281, 72, 16, 16],
            'eagle_': [297, 72, 16, 16],
            'brick-over-parts': [[256, 64, 4, 4], [260, 64, 4, 4], [256, 68, 4, 4], [260, 68, 4, 4]],
            'brick-welcome-parts': [[264, 64, 4, 4], [268, 64, 4, 4], [264, 68, 4, 4], [268, 68, 4, 4]],
        };
        let hud = {
            'stage': [329, 176, 39, 7],
            'ai': [290, 173, 8, 8],
            'player': [298, 173, 8, 8],
            '1P': [258, 173, 16, 8],
            '2P': [274, 173, 16, 8],
            'flag': [307, 173, 16, 16],
            'roman-1': [258, 164, 8, 8],
            'roman-2': [266, 164, 8, 8],
        };
        let props = {
            'helmet': [256, 112, 16, 15],
            'timer': [272, 112, 16, 15],
            'shovel': [288, 112, 16, 15],
            'star': [304, 112, 16, 15],
            'grenade': [320, 112, 16, 15],
            'tank-life': [336, 112, 16, 15],
            'gun': [352, 112, 16, 15],
        };
        this.images = {player, enemy, bullet, animation, stage_map, hud, props};
    }

    /**
     * 设置场景
     * @param {Scene} scene
     */
    setScene(scene) {
        // 停止动作、重置画布由调用方处理，因为某些场景需要延续上一个画面
        this.scene = scene;
    }

    /**
     * 下一帧动画序号
     * @param {number} every 帧数
     * @param {number} len 图片数量
     * @returns {number}
     */
    getNextFrameIndex(every, len) {
        return (this.frame / every | 0) % len;
    }

    render() {
        requestAnimationFrame((timestamp) => {
            ++this.frame;
            this.scene.render(timestamp);
        });
    }

    abort() {
        if (this.scene) this.scene.abort();
    }

    stop() {
        if (this.scene) this.scene.stop();

        // 停止时仍会继续执行完当前回调，实际是取消的下一个，故需要等待下一次再做操作
        return new Promise((resolve, reject) => {
            requestAnimationFrame((timestamp) => {
                resolve();
            });
        });
    }

    reset() {
        // 重置画布，只清除活动的，根据情况擦除背景
        for (let ctx of [this.ctx, this.offscreen_ctx]) {
            ctx.clearRect(0, 0, this.screen_width, this.screen_height);
        }

        for (let ctx of [this.ctx, this.offscreen_ctx, this.bg1_ctx, this.bg2_ctx, this.bg3_ctx]) {
            ctx.textBaseline = "top"; // 文字基线
            ctx.textAlign = "left";
        }
    }

    resetAll() {
        for (let ctx of [this.bg1_ctx, this.bg2_ctx, this.bg3_ctx]) {
            ctx.clearRect(0, 0, this.screen_width, this.screen_height);
        }
        this.reset();
    }
}
