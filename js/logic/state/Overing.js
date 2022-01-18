class Overing extends GameState {
    action() {
        this.ui.setScene(new Over(this, this.ui));
        this.ui.render();
        this.ui.ga.play("game_over");
        this.is_complete = false;

        this.frame = 0;
        this.total = 120 * Constant.FRAME_FACTOR;
        requestAnimationFrame(this.wait.bind(this));
    }

    onKeydown(code) {
        this.next();
    }

    next() {
        this.ui.stop().then(() => {
            this.ui.resetAll();

            this.control.setState(new Menus(this.control, this.ui));
        });
        this.is_complete = true;
    }

    wait(timestamp) {
        ++this.frame;
        if (this.is_complete) return;
        if (this.frame >= this.total) {
            this.next();
            return;
        }
        requestAnimationFrame(this.wait.bind(this));
    }
}