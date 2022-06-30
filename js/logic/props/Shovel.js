class Shovel extends Prop {
    constructor() {
        super(...arguments);
        this.type = "shovel";
    }

    work(player, state) {
        state.reinforceBaseWall();
        state.tasks.push(new TaskSchedule(function () {
            state.switchBaseWall();
        }, 1020 * Constant.FRAME_FACTOR, 180, true));
        state.tasks.push(new TaskSchedule(function () {
            state.switchToWall(Constant.MAP_BRICK);
        }, 1201 * Constant.FRAME_FACTOR, 0));
        state.ui.ga.play("claim_powerup");
    }
}