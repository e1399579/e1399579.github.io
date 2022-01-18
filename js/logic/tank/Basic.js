class Basic extends AITank {
    constructor() {
        super(...arguments);
        this.type = "basic";
        this.speed = Constant.BASE_AI_SPEED * Constant.ZOOM;
        this.bullet_speed = Constant.BASE_BULLET_SPEED * Constant.ZOOM;
        this.level = 1;
    }
}