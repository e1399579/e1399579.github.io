class Choosing extends GameState {
    constructor() {
        super(...arguments);
        this.stage = this.config.stage || 1;
        this.auto = this.config.auto || false;
        this.i = 0;
    }

    action() {
        this.ui.setScene(new Choose(this, this.ui));
        this.ui.render();
    }

    onKeydown(code) {
        if (this.auto) return;

        switch (code) {
            case 'A':
            case 'X':
                this.stage = Math.min(35, ++this.stage);
                break;
            case 'B':
            case 'Y':
                this.stage = Math.max(1, --this.stage);
                break;
            case 'START':
                this.config.stage = this.stage;
                this.ui.stop().then(() => {
                    this.ui.reset();

                    this.control.setState(new Playing(this.control, this.ui, this.config));
                });

                break;
        }
    }

    onKeyup(key) {}

    setCompleted() {
        if (this.auto) {
            // 停1000ms
            if (++this.i >= Constant.FPS) {
                this.ui.stop().then(() => {
                    this.ui.reset();

                    this.control.setState(new Playing(this.control, this.ui, this.config));
                });
            }
        }
    }

    getClearRect() {
        return [97, 112, 64, 8].map(x => x * Constant.ZOOM);
    }

    getTextRect() {
        let stage = this.stage.toString();
        let p1 = [97, 112].map(x => x * Constant.ZOOM);
        let p2 = [153, 112].map(x => x * Constant.ZOOM);
        p2[0] -= (stage.length -1) * 8 * Constant.ZOOM;
        return [
            ["STAGE", p1],
            [stage, p2],
        ];
    }
}