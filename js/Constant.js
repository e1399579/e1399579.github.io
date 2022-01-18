class Constant {
    static ZOOM = 3; // 战场缩放，控制元素实际尺寸，类似于设备宽度
    static FPS = 60; // 帧率，与屏幕刷新率相对应
    static BASE_SCREEN_WIDTH = 256;
    static BASE_SCREEN_HEIGHT = 240;
    static BASE_STAGE_WIDTH = 208;
    static BASE_STAGE_HEIGHT = 208;
    static BASE_STAGE_OFFSET = 16;
    static BASE_FONT_SIZE = 8;
    static FONT_FAMILY = '"Press Start 2P"';
    static FRAME_FACTOR = Constant.FPS / 60;

    // 速度：距离/帧数，单位：像素/帧
    static BASE_PLAYER_SPEED = 0.75; // 大约256帧走完1个边界，其中坦克大约16px，(208-16)/256=0.75
    static BASE_AI_SPEED = 0.5; // 大约384帧走完1个边界，其中坦克大约16px，(208-16)/384=0.5
    // static BASE_AI_SPEED = 2;
    static BASE_BULLET_SPEED = 2; // 大约96帧走完1个边界，其中坦克大约16px，(208-16)/96=2
    static AI_NUM = 20; // AI的数量
    static PLAYER_LIVES = 3; // 玩家生命数
    static AI_WITH_PROP_LIST = [4, 11, 18]; // 第4 11 18个AI有道具

    // 重生相关帧数
    static BORN_PLAYER_TOTAL_FRAME = 36; // 重生动画帧数（十字星星）
    static BORN_PLAYER_INVULNERABLE = 136; // 玩家无敌动画时长（围绕动画）
    static BORN_PLAYER_NEXT_DELAY = 28;
    static BORN_AI_TOTAL_FRAME = 56; // AI的和玩家不一样
    static BORN_AI_DELAY = 188; // 下一次延时（过一会才创建下一辆）
    static BORN_AI_NEXT_DELAY = 148; // 被玩家打掉后下一辆延时

    // 方向
    static DIRECT_LEFT = 0;
    static DIRECT_UP = 1;
    static DIRECT_RIGHT = 2;
    static DIRECT_DOWN = 3;

    // 地图
    static MAP_EMPTY = 0; // 空地
    static MAP_FOREST = 1; // 森林
    static MAP_ICE = 2; // 冰
    static MAP_BRICK = 3; // 砖块
    static MAP_RIVER = 4; // 河流
    static MAP_STEEL = 5; // 钢
    static MAP_EAGER = 6; // 老鹰
    static MAP_EAGER_ = 7;

    // 红色砖块：4个小部分 1-左上 2-右上 3-左下 4-右下
    static WALL_FULL = 0b1111;
    static WALL_1 = 0b0001;
    static WALL_2 = 0b0010;
    static WALL_3 = 0b0100;
    static WALL_4 = 0b1000;

    // 分数
    static SCORE_BASIC = 100;
    static SCORE_FAST = 200;
    static SCORE_POWER = 300;
    static SCORE_ARMOR = 400;
    static SCORE_PROPS = 500;
    static SCORE_DICTIONARY = {
        basic: 100,
        fast: 200,
        power: 300,
        armor: 400,
        props: 500,
    };
}