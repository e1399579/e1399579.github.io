class Player1 extends PlayerTank {
    constructor() {
        super(...arguments);
        this.color = ["yellow"];
        this.id = 1;
    }

    onKeydown(code, ga) {
        // 检测边界、碰撞由控制器完成
        switch (code) {
            case 'A':
            case 'B':
                this.shot(ga);
                break;
            case 'L-UP':
                this.setDirect(Constant.DIRECT_UP);
                super.onKeydown(ga);
                break;
            case 'L-DOWN':
                this.setDirect(Constant.DIRECT_DOWN);
                super.onKeydown(ga);
                break;
            case 'L-LEFT':
                this.setDirect(Constant.DIRECT_LEFT);
                super.onKeydown(ga);
                break;
            case 'L-RIGHT':
                this.setDirect(Constant.DIRECT_RIGHT);
                super.onKeydown(ga);
                break;
        }
    }

    onKeyup(code, ga) {
        switch (code) {
            case 'L-UP':
            case 'L-DOWN':
            case 'L-LEFT':
            case 'L-RIGHT':
                super.onKeyup(ga);
                break;
        }
    }
}