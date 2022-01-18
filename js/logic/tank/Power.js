class Power extends AITank {
    constructor() {
        super(...arguments);
        this.type = "power";
        this.speed = Constant.BASE_AI_SPEED * Constant.ZOOM;
        this.bullet_speed = Constant.BASE_BULLET_SPEED * 2 * Constant.ZOOM;
        this.level = 1;
    }
}