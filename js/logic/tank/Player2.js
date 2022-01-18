class Player2 extends PlayerTank {
    constructor() {
        super(...arguments);
        this.color = ["green"];
        this.id = 2;
    }

    onKeydown(code, ga) {
        // 检测边界、碰撞由控制器完成
        switch (code) {
            case 'X':
            case 'Y':
                this.shot(ga);
                break;
            case 'R-UP':
                this.setDirect(Constant.DIRECT_UP);
                super.onKeydown(ga);
                break;
            case 'R-DOWN':
                this.setDirect(Constant.DIRECT_DOWN);
                super.onKeydown(ga);
                break;
            case 'R-LEFT':
                this.setDirect(Constant.DIRECT_LEFT);
                super.onKeydown(ga);
                break;
            case 'R-RIGHT':
                this.setDirect(Constant.DIRECT_RIGHT);
                super.onKeydown(ga);
                break;
        }
    }

    onKeyup(code, ga) {
        switch (code) {
            case 'R-UP':
            case 'R-DOWN':
            case 'R-LEFT':
            case 'R-RIGHT':
                super.onKeyup(ga);
                break;
        }
    }
}