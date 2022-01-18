class Grenade extends Prop {
    constructor() {
        super(...arguments);
        this.type = "grenade";
    }

    work(player, state) {
        let player_index = player.getId() - 1;
        for (let tank of state.tanks) {
            let point = tank.getCenterPoint();
            let bomb = new Bomb2(null, point);
            state.animations.push(bomb);

            // 更新统计
            ++state.stats[player_index][tank.getType()];
        }

        let load_num = Math.min(state.load_tank_num, state.ai_num);
        state.ai_deduct -= load_num;
        let tasks = state.factory.loadTanks(load_num, 1);
        state.tasks.push(...tasks);
        state.tanks = [];
        state.ui.ga.play("claim_powerup");
    }
}