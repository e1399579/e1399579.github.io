class Fast extends AITank {
    constructor() {
        super(...arguments);
        this.type = "fast";
        this.speed = Constant.BASE_AI_SPEED * 2 * Constant.ZOOM;
        this.bullet_speed = Constant.BASE_BULLET_SPEED * Constant.ZOOM;
        this.level = 1;
    }
}