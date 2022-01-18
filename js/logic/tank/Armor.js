class Armor extends AITank {
    constructor() {
        super(...arguments);
        this.type = "armor";
        this.speed = Constant.BASE_AI_SPEED * Constant.ZOOM;
        this.bullet_speed = Constant.BASE_BULLET_SPEED * Constant.ZOOM;
        this.color_map = {
            1: ["silver"],
            2: ["green", "yellow"],
            3: ["yellow", "silver"],
            4: ["green", "silver"],
        };
        this.level = 4;
        if (!this.width_prop) {
            this.color = this.color_map[this.level];
            this.color_frame = 1;
        }
    }

    doBeShot(bullet) {
        if (this.level > 0) {
            this.color = this.color_map[this.level];
            this.color_frame = 1;

            // 转向反击
            this.turnReverse(bullet.getDirect());
        }
    }
}