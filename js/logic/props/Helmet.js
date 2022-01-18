class Helmet extends Prop {
    constructor() {
        super(...arguments);
        this.type = "helmet";
    }

    work(player, state) {
        // 无敌效果，314帧后消失
        player.setInvulnerable();
        state.tasks.push(new TaskSchedule(function () {
            player.clearInvulnerable();
        }, 314 * Constant.FRAME_FACTOR, 0));
        state.ui.ga.play("claim_powerup");
    }
}