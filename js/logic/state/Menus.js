class Menus extends GameState {
    constructor() {
        super(...arguments);

        this.base_x = this.focus_x = 65 * Constant.ZOOM;
        this.base_y = this.focus_y = 132 * Constant.ZOOM;
        this.line_no = 0;
        this.complete = false;
    }

    action() {
        this.ui.setScene(new Menu(this, this.ui));
        this.ui.render();
    }

    onKeydown(code) {
        // 任意键停止动画
        if (!this.complete) {
            this.complete = true;
            this.ui.abort();
            return;
        }

        switch (code) {
            case 'L-UP':
            case 'R-UP':
                if (--this.line_no < 0) {
                    this.line_no = 2;
                }
                break;
            case 'L-DOWN':
            case 'R-DOWN':
            case 'SELECT':
                if (++this.line_no > 2) {
                    this.line_no = 0;
                }
                break;
            case 'START':
                if (this.line_no < 2) {
                    this.ui.stop().then(() => {
                        // 保留黑色背景，后面选关可以复用
                        this.ui.reset();

                        this.config.auto = false;
                        this.config.player_num = this.line_no + 1;
                        this.control.setState(new Choosing(this.control, this.ui, this.config));
                    });
                }
                break;
        }

        this.focus_y = this.base_y + this.line_no * 16 * Constant.ZOOM;
    }

    getFocusRect() {
        return [this.focus_x, this.focus_y, 15 * Constant.ZOOM, 15 * Constant.ZOOM];
    }

    getFocusClearRect() {
        return [this.base_x, this.base_y, 15 * Constant.ZOOM, 48 * Constant.ZOOM];
    }

    setComplete() {
        this.complete = true;
    }
}