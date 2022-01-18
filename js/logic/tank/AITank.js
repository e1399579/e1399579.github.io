class AITank extends Tank {
    constructor(direct, with_prop = false) {
        super(direct);
        this.width_prop = with_prop;
        this.shot_counter = 0;

        this.role = "enemy";
        this.color = ["silver"];
        if (this.width_prop) {
            this.color = ["red", "silver"];
        }

        this.width = 15 * Constant.ZOOM;
        this.height = 15 * Constant.ZOOM;
        this.fix_vertical = Math.ceil(this.width / 2);
        this.fix_horizontal = this.width - this.fix_vertical;

        this.max_counter = 208 * Constant.ZOOM;
        this.turn_counter = Math.rand(10, this.max_counter);
        this.limit_counter = 10;
    }

    turnOther() {
        // let directs = this.getDirects();
        // directs.splice(this.direct, 1);
        // let direct = Math.rand(0, 2);
        // let direct = Math.rand(0, 6);
        // direct = Math.min(direct, 3);
        // 增加向下的概率，更快地找到鹰攻击
        let directs = [0, 2, 3];
        let direct = Math.min(directs.length - 1, Math.rand(0, 4));
        this.setDirect(directs[direct]);
    }

    isTurn() {
        return this.counter > this.turn_counter;
    }

    incrCounter() {
        ++this.counter;
        ++this.shot_counter;
    }

    setDirect(direct) {
        this.direct = direct;
        this.counter = 0;
        this.turn_counter = Math.rand(10, this.max_counter);
        // 转向时修正坐标
        this.alignPoint();
    }

    isLimit() {
        // 避免转向过快，影响观看
        return this.counter <= this.limit_counter;
    }

    turn(direct) {
        this.setDirect(direct);
        this.limit_counter = Math.rand(1, 40);
    }

    turnReverse(direct) {
        direct = (direct + 2) % 4;
        this.direct = direct;
    }

    turnAim(player) {
        let point = player.getPoint();
        let size = player.getRelativeSize();
        let range = [[point.x, point.x + size.w], [point.y, point.y + size.h]];
        for (let direct of this.getDirects()) {
            let point = this.predictPoint(direct);
            let head = this.getHeadPoint(point, direct);
            let x = head.x;
            let y = head.y;
            if ((range[0][0] <= x && x <= range[0][1]) && (range[1][0] <= y && y <= range[1][1])) {
                this.direct = direct;
                break;
            }
        }
    }

    shot() {
        let min_counter = 25;
        if (this.shot_counter < min_counter) return;
        if (this.bullets.length >= this.bullet_num) return;

        super.shot();
    }

    clearBullet(bullet) {
        super.clearBullet(bullet);
        this.shot_counter = 0;
    }

    getScore() {
        return Constant.SCORE_DICTIONARY[this.type];
    }

    beShot(bullet) {
        // 结合生命计算是否摧毁，降级等
        let destroy = --this.level <= 0;
        let audio;
        if (this.width_prop) {
            audio = "powerup_tank_be_shot";
        } else {
            audio = destroy ? "enemy_bomb" : "armor_be_shot";
        }
        let animations = [];
        if (destroy) {
            let point = this.getCenterPoint();
            let score = this.getScore();
            let bomb = new Bomb2(null, point);
            bomb.onFinish(function () {
                this.animations.push(new Score(null, {
                    x: point.x,
                    y: point.y,
                    type: score.toString(),
                }));
            });
            animations.push(bomb);
        }
        let prop = this.width_prop;
        this.width_prop = false;

        this.doBeShot(bullet);

        return {destroy, audio, animations, prop};
    }

    doBeShot(bullet) {}
}