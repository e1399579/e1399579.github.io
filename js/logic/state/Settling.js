class Settling extends GameState {
    constructor() {
        super(...arguments);
    }

    action() {
        this.ui.setScene(new Settle(this, this.ui));
        this.ui.render();
    }

    getData() {
        // 作一些计算
        let config = this.config;
        let data = {
            player_num: config.player_num,
            stage: config.stage,
            stats: [],
        };
        for (let stat of config.stats) {
            let score = 0;
            let total_num = 0;
            let items = {};
            for (let key of Object.keys(stat)) {
                let value = stat[key];
                switch (key) {
                    case "basic":
                    case "fast":
                    case "power":
                    case "armor":
                        total_num += value;
                        break;
                    case "props":
                        break;
                }
                let s = value * Constant.SCORE_DICTIONARY[key];
                score += s;
                items[key] = [value, s];
            }

            data.stats.push({score, total_num, items});
        }
        // let data = {
        //     player_num: 2,
        //     stage: 1,
        //     stats: [
        //         {score: 2200, total_num: 12, items: {basic: [5, 500], fast: [4, 800], power: [3, 900], armor: [0, 0]}},
        //         {score: 4200, total_num: 20, items: {basic: [7, 700], fast: [6, 1200], power: [5, 1500], armor: [2, 800]}},
        //     ],
        // };
        return data;
    }

    setCompleted() {
        this.ui.stop().then(() => {
            this.ui.reset();

            if (this.config.is_over) {
                this.control.setState(new Overing(this.control, this.ui));
            } else {
                // 打赢了则进入下一关
                ++this.config.stage;
                this.config.auto = true;
                this.control.setState(new Choosing(this.control, this.ui, this.config));
            }
        });
    }

    onKeydown(code) {}

    onKeyup(code) {}
}