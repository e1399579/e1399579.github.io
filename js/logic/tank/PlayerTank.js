class PlayerTank extends Tank {
    constructor(direct, level = 1) {
        super(direct);
        this.role = "player";
        this.speed = Constant.BASE_PLAYER_SPEED * Constant.ZOOM;
        this.level = level;
        this.levelAbility();
        this.invulnerable = true; // 无敌状态
        this.move = false;

        this.id = null;
        this.skating = false;
        this.skating_frame = 18 * Constant.FRAME_FACTOR;
        this.keyup_frame = 0;
    }

    clearInvulnerable() {
        this.invulnerable = false;
    }

    isInvulnerable() {
        return this.invulnerable;
    }

    setInvulnerable() {
        this.invulnerable = true;
    }

    isMove() {
        return this.move;
    }

    getId() {
        return this.id;
    }

    setDirect(direct) {
        // 转向时修正坐标
        [this.x, this.y] = this.alignPoint(this.direct, direct, this.x, this.y);
        this.direct = direct;
    }

    onKeydown(ga) {
        this.move = true;
        ga.alonePlay("player_move");
    }

    onKeyup(ga) {
        this.move = false;
        this.keyup_frame = this.frame;
        ga.mute("player_move");
    }

    setSkating() {
        this.skating = true;
    }

    setNormal() {
        this.skating = false;
    }

    isSkating() {
        return this.skating && !this.move && (this.frame - this.keyup_frame <= this.skating_frame);
    }

    levelUp() {
        this.level = Math.min(++this.level, 4);
        this.levelAbility();
    }

    levelTo(level) {
        this.level = Math.min(level, 4);
        this.levelAbility();
    }

    levelAbility() {
        switch (this.level) {
            case 1:
                this.type = "basic";
                this.bullet_speed = Constant.BASE_BULLET_SPEED * Constant.ZOOM;
                this.width = 15 * Constant.ZOOM;
                this.height = 15 * Constant.ZOOM;
                this.bullet_num = 1;
                this.bullet_level = 1;
                break;
            case 2:
                this.type = "fast";
                this.bullet_speed = Constant.BASE_BULLET_SPEED * 2 * Constant.ZOOM;
                this.width = 15 * Constant.ZOOM;
                this.height = 16 * Constant.ZOOM;
                this.bullet_num = 1;
                this.bullet_level = 1;
                break;
            case 3:
                this.type = "power";
                this.bullet_speed = Constant.BASE_BULLET_SPEED * 2 * Constant.ZOOM;
                this.width = 15 * Constant.ZOOM;
                this.height = 15 * Constant.ZOOM;
                this.bullet_num = 2;
                this.bullet_level = 1;
                break;
            case 4:
                this.type = "armor";
                this.bullet_speed = Constant.BASE_BULLET_SPEED * 2 * Constant.ZOOM;
                this.width = 16 * Constant.ZOOM;
                this.height = 15 * Constant.ZOOM;
                this.bullet_num = 2;
                this.bullet_level = 2;
                break;
        }

        this.fix_vertical = Math.ceil(this.width / 2);
        this.fix_horizontal = this.width - this.fix_vertical;
        // 坦克体积发生变化，修正坐标
        this.x = this.alignX(this.x);
        this.y = this.alignY(this.y);
    }

    shot(ga) {
        if (this.bullets.length >= this.bullet_num) return;
        ga.play("shot");
        super.shot();
    }

    beShot(bullet) {
        if (this.invulnerable) return {destroy: false, audio: "", animations: []};

        --this.level;
        let destroy = true;
        let audio = "player_bomb";
        let animations = [new Bomb2(null, this.getCenterPoint())];
        return {destroy, audio, animations};
    }
}