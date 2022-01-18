class Star extends Prop {
    constructor() {
        super(...arguments);
        this.type = "star";
    }

    work(player, state) {
        // 升级
        player.levelUp();
        state.ui.ga.play("claim_powerup");
    }
}