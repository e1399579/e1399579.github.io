class GameControl {
    constructor(ui) {
        this.state = new Menus(this, ui);
        this.keyboard = new Keyboard(this.state);
        this.keyboard.listen();
    }

    setState(state) {
        this.state = state;
        this.state.action();
        this.keyboard.setState(this.state);
        this.keyboard.listen();
    }

    action() {
        this.state.action();
    }

    reset(ui) {
        ui.stop().then(() => {
            ui.reset();

            this.setState(new Menus(this, ui));
        });
    }
}