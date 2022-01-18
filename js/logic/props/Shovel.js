class Shovel extends Prop {
    constructor() {
        super(...arguments);
        this.type = "shovel";
    }

    work(player, state) {
        state.ui.ga.play("claim_powerup");
    }
}