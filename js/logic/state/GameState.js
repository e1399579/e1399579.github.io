class GameState {
    constructor(control, ui, config = {}) {
        this.control = control;
        this.ui = ui;
        this.config = config;
    }

    action() {}

    onKeydown(code) {}

    onKeyup(code) {}
}