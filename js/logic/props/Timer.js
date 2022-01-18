class Timer extends Prop {
    constructor() {
        super(...arguments);
        this.type = "timer";
    }

    work(player, state) {
        state.freeze = true;
        state.tasks.push(new TaskSchedule(function () {
            this.freeze = false;
        }, 600 * Constant.FRAME_FACTOR, 0));
        state.ui.ga.play("claim_powerup");
    }
}