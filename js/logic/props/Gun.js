class Gun extends Prop {
    constructor() {
        super(...arguments);
        this.type = "gun";
    }

    work(player, state) {
        player.levelTo(4);
        state.ui.ga.play("claim_powerup");
    }
}