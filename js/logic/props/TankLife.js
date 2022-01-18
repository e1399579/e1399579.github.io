class TankLife extends Prop {
    constructor() {
        super(...arguments);
        this.type = "tank-life";
    }

    work(player, state) {
        ++state.players_life[player.getId() - 1];
        state.ui.ga.play("claim_tank_life");
    }
}