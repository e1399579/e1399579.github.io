class Playing extends GameState {
    constructor() {
        super(...arguments);
        this.player_num = this.config.player_num;
        this.stage = this.config.stage;

        this.stage_width = Constant.BASE_STAGE_WIDTH * Constant.ZOOM;
        this.stage_height = Constant.BASE_STAGE_HEIGHT * Constant.ZOOM;

        this.tanks = [];
        this.load_tank_num = this.player_num > 1 ? 6 : 4;
        this.ai_num = Constant.AI_NUM; // 显示用，创建之后才减
        this.ai_deduct = this.ai_num; // 校验用，预先扣除
        this.bullets = [];
        this.ghost_bullets = [];
        this.animations = [];
        this.changed_tile = [];
        this.players = [];
        this.props = [];
        this.freeze = false;
        this.running = 0;
        this.running_id = 0;
        this.stats = [];
        for (let i = 0;i < this.player_num;++i) {
            this.stats.push({
                basic: 0,
                fast: 0,
                power: 0,
                armor: 0,
                props: 0,
            });
        }

        this.factory = new StageFactory(this.stage);
        this.stage_map = this.factory.loadMap();
        this.eagle = this.stage_map[24][12];
        this.played = 0;
    }

    action() {
        this.ui.ga.forcePlay("game_begin");
        // 初始化坦克：0-左 1-上 2-右 3-下
        this.tasks = this.factory.loadTanks(this.load_tank_num);
        this.ai_deduct -= this.load_tank_num;

        // 赢了开启下一关，生命数、等级要保留
        this.players_life = this.config.players_life || [];
        let players_level = this.config.players_level || [];
        if (this.players_life.length === 0) {
            for (let i = 0;i < this.player_num;++i) {
                this.players_life.push(Constant.PLAYER_LIVES);
                this.tasks.push(...this.factory.createPlayer(i + 1));
            }
        } else {
            this.players_life.forEach((life, i) => {
                let level = players_level[i];
                this.tasks.push(...this.factory.createPlayer(i + 1, 0, level));
            });
        }
        this.players_life_total = this.players_life.sum();

        this.ui.setScene(new Play(this, this.ui));

        // 先运行动画，再运行游戏逻辑
        let animation = new OpenFrame(null, {});
        let request_id;
        let run_animation = (timestamp) => {
            request_id = requestAnimationFrame(run_animation);
            if (!animation.isComplete()) {
                animation.play(this.ui, this.ui.bg3_ctx);
            } else {
                this.running = 1;
                cancelAnimationFrame(request_id);
                this.ui.render();
            }
        }
        requestAnimationFrame(run_animation);
    }

    onKeydown(code) {
        // 暂停
        if (code === 'START' && (this.running > 0)) {
            if (1 === this.running) {
                this.running = 2;
                this.ui.ga.play("game_pause");
                this.ui.stop().then(() => {
                    this.pause = new Pause();
                    let run_animation = (timestamp) => {
                        this.running_id = requestAnimationFrame(run_animation);
                        this.pause.play(this.ui, this.ui.bg3_ctx);
                    }
                    requestAnimationFrame(run_animation);
                });
            } else {
                this.running = 1;
                cancelAnimationFrame(this.running_id);
                requestAnimationFrame((timestamp) => {
                    this.pause.finish(this.pause, this.ui.bg3_ctx);
                });
                this.ui.render();
            }

            return;
        }

        for (let player of this.players) {
            player.onKeydown(code, this.ui.ga);
        }
    }

    onKeyup(code) {
        for (let player of this.players) {
            player.onKeyup(code, this.ui.ga);
        }
    }

    isOver() {
        return this.eagle.isOver() || (this.players_life_total <= 0);
    }

    isWin() {
        return this.ai_num + this.tanks.length <= 0;
    }

    preprocess() {
        // 排序
        this.tasks.sort(TaskSchedule.compare);
        let i = 0;
        while (i < this.tasks.length) {
            let task = this.tasks[i];
            // 因为执行可能需要持续一段时间，避免重复执行
            if (task.isExecuted()) {
                if (task.isComplete()) {
                    // 完成之后再删除任务
                    this.tasks.splice(i, 1); // 后面的元素前移，下一个任务还是i
                } else {
                    // 未完成，但下一个可能已经开始，这里不break
                    ++i;
                }
            } else {
                if (task.isTime()) {
                    task.execute(this);
                    ++i;
                } else {
                    // 任务是按延时排序的，若第1个未到时间，直接退出
                    break;
                }
            }
        }
        for (let task of this.tasks) {
            task.incrFrame();
        }

        if (this.isOver()) {
            if (!this.played) {
                let animation = new GameOver();
                animation.onFinish(function() {
                    this.ui.stop().then(() => {
                        this.ui.reset();

                        this.control.setState(new Settling(this.control, this.ui, {
                            is_over: 1,
                            stage: this.stage,
                            player_num: this.player_num,
                            players_life: this.players_life,
                            stats: this.stats,
                        }));
                    });
                });
                this.animations.push(animation);
                this.played = 1;

                for (let player of this.players) {
                    player.move = false;
                }
                // 禁用按键
                this.onKeydown = () => {};
                this.onKeyup = () => {};
                // 禁用声音
                this.ui.ga.stop("player_move");
            }
        } else if (this.isWin()) {
            // 延时3000ms再结算
            if (!this.played) {
                this.tasks.push(new TaskSchedule(function () {
                    // 当前存活的加进去
                    let players_life = [...this.players_life];
                    let players_level = [];
                    for (let player of this.players) {
                        let id = player.getId();
                        ++players_life[id - 1];
                        players_level[id - 1] = player.getLevel();
                    }

                    this.ui.stop().then(() => {
                        this.ui.reset();
                        this.control.setState(new Settling(this.control, this.ui, {
                            is_over: 0,
                            stage: this.stage,
                            player_num: this.player_num,
                            players_life: players_life,
                            players_level: players_level,
                            stats: this.stats,
                        }));
                    });
                }, 180 * Constant.FRAME_FACTOR, 0));

                this.played = 1;
            }
        }
    }

    getPlayers() {
        let index = -1;
        let skating_num = 0;
        for (let tank of this.players) {
            tank.incrFrame();

            ++index;
            let is_move = tank.isMove();
            let is_skating = tank.isSkating();
            if (!(is_move || is_skating)) {
                continue;
            }

            // 道具
            let k = this.isDashProp(tank);
            if (k !== -1) {
                this.props[k].beDash(tank, this);
                this.props.splice(k, 1);
            }

            let point = tank.predictPoint(tank.getDirect());
            let size = tank.getRelativeSize();
            // 是否越界
            if (this.isOverflow(point, size)) {
                continue;
            }

            let i = this.isTankImpactTank(-1, point, size, this.tanks);
            if (i !== -1) {
                continue;
            }
            let j = this.isTankImpactTank(index, point, size, this.players);
            if (j !== -1) {
                continue;
            }

            // 是否与建筑相交
            let element = this.isTankImpactTile(point, size, tank);
            if (element) {
                continue;
            }

            tank.moveTo(point.x, point.y);
            if (is_skating) {
                ++skating_num;
            }
        }

        if (skating_num > 0) {
            this.ui.ga.alonePlay("player_skating");
        } else {
            this.ui.ga.mute("player_skating");
        }

        return this.players;
    }

    getTanks() {
        if (this.freeze) return this.tanks;

        let intersects = {};
        let must_turn = {};
        let index = -1;
        for (let tank of this.tanks) {
            tank.incrFrame();
            tank.shot(); // 发射子弹

            ++index;
            tank.incrCounter();

            let point = tank.predictPoint(tank.getDirect());
            let size = tank.getRelativeSize();

            if (intersects.hasOwnProperty(index)) {
                // 使用缓存
                if (must_turn[index]) {
                    let tank2 = this.tanks[intersects[index]];
                    this.chooseBestDirect(tank, tank2);
                }
                continue;
            } else {
                // 是否与其他坦克相交，A向下，B向右，B能动，B与A也要计算
                let i = this.isTankImpactTank(index, point, size, this.tanks);
                if (i !== -1) {
                    intersects[i] = index; // 创建另一个坦克缓存，方便下次运算
                    let tank2 = this.tanks[i];
                    let is_way = this.chooseBestDirect(tank, tank2);
                    must_turn[i] = !is_way;
                    continue;
                }
            }

            // 是否越界
            if (this.isOverflow(point, size)) {
                this.chooseRightDirect(tank, this.isOverflow);
                continue;
            }

            // 是否与建筑相交
            let element = this.isTankImpactTile(point, size, tank);
            if (element) {
                if (element.canDestroy(tank)) {
                    if (1 === Math.rand(1, 4)) {
                    } else {
                        this.chooseRightDirect(tank, this.isTankImpactTile);
                    }
                } else {
                    this.chooseRightDirect(tank, this.isTankImpactTile);
                }

                continue;
            }

            // 是否与玩家坦克相遇
            let j = this.isTankImpactTank(-1, point, size, this.players);
            // 转向瞄准
            if (j !== -1) {
                tank.turnAim(this.players[j]);
                continue;
            }

            // 确定是否转向
            if (tank.isTurn()) {
                tank.turnOther();
                continue;
            }

            tank.moveTo(point.x, point.y);
        }

        return this.tanks;
    }

    getBullets() {
        // 正常子弹
        this.bullets = [];
        for (let tank of this.tanks) {
            this.bullets.push(...tank.getBullets());
        }
        for (let tank of this.players) {
            this.bullets.push(...tank.getBullets());
        }
        this.bulletsGarbageCollection(this.bullets, function(i) {
            this.bullets[i].getTank().clearBullet(this.bullets[i]);
        });

        // 幽灵子弹单独处理
        this.bulletsGarbageCollection(this.ghost_bullets, () => {});

        this.bullets.push(...this.ghost_bullets);
        return this.bullets;
    }

    getAnimations() {
        let trash = [];
        this.animations.forEach((animation, index) => {
            if (animation.isComplete()) {
                animation.finish(this);
                trash.push(index);
            }
        });
        // trash是排序的
        // 从末尾安全删除
        while(trash.length) {
            this.animations.splice(trash.pop(), 1);
        }

        return this.animations;
    }

    getProps() {
        let trash = [];
        this.props.forEach((prop, index) => {
            prop.incrFrame();
            if (prop.isTimeout()) {
                trash.push(index);
            }
        });
        while(trash.length) {
            this.props.splice(trash.pop(), 1);
        }

        return this.props;
    }

    getChangedTile() {
        return this.changed_tile;
    }

    setChangedComplete() {
        // 删除地图上的对象
        for (let element of this.changed_tile) {
            let area = element.getArea();
            for (let [row, col] of area) {
                if (!this.stage_map[row][col]) continue; // 可能有重复的，比如2个坦克同时击中相同砖块

                if (this.stage_map[row][col].isDestroy()) {
                    this.stage_map[row][col] = null;
                }
            }
        }
        this.changed_tile = [];
    }

    getStageMap() {
        return this.stage_map;
    }

    getHUD() {
        return {
            ai_num: this.ai_num,
            players_life: this.players_life,
            stage: this.stage,
        };
    }

    hitEnemies(bullet) {
        let hit = false;
        let index = -1;
        let player_index = bullet.getTank().getId() - 1;
        for (let tank of this.tanks) {
            ++index;
            if (!this.isHitTank(bullet, tank)) continue;

            hit = true;
            let be_shot = tank.beShot(bullet);
            let destroy = be_shot.destroy;
            let prop = be_shot.prop;

            // 播放动画、声音
            this.ui.ga.play(be_shot.audio);
            this.animations.push(...be_shot.animations);
            // 道具
            if (prop) {
                // 全屏只能有一个
                this.props = [];
                this.props.push(this.factory.createProp());
            }
            if (!destroy) break;

            // 更新统计、销毁
            ++this.stats[player_index][tank.getType()];

            this.tanks.splice(index, 1); // 后面break了，所以直接在此删除

            // 坦克阵亡，收集其遗留子弹，以便后续回收，避免内存泄漏
            this.ghost_bullets.push(...tank.getBullets());

            if (this.ai_deduct > 0) {
                let list = this.factory.createEnemy(Constant.AI_NUM - this.ai_deduct, Constant.BORN_AI_NEXT_DELAY);
                this.tasks.push(...list);
                --this.ai_deduct;
            }

            break;
        }

        // 2个玩家对打无效，子弹爆炸 TODO 被打的玩家闪烁，短时间内无法行动
        let id = bullet.getTank().getId();
        for (let player of this.players) {
            if (player.getId() === id) continue;

            if (!this.isHitTank(bullet, player)) continue;
            hit = true;
            break;
        }

        return hit;
    }

    hitPlayers(bullet) {
        let hit = false;
        let index = -1;
        for (let player of this.players) {
            ++index;

            if (!this.isHitTank(bullet, player)) continue;

            hit = true;
            // 播放动画、声音
            let be_shot = player.beShot(bullet);
            let destroy = be_shot.destroy;
            let audio = be_shot.audio;
            this.ui.ga.play(audio);
            this.ui.ga.stop("player_move");
            this.animations.push(...be_shot.animations);
            if (!destroy) break;

            // 更新统计、销毁
            --this.players_life_total;
            let id = player.getId();
            this.players.splice(index, 1);

            this.ghost_bullets.push(...player.getBullets());

            // 重建
            if (this.players_life[id - 1] > 0) {
                let list = this.factory.createPlayer(id, Constant.BORN_PLAYER_NEXT_DELAY * Constant.FRAME_FACTOR);
                this.tasks.push(...list);
            }

            break;
        }

        return hit;
    }

    isHitTank(bullet, tank) {
        let range1 = bullet.getAttackRange(); // 此处增加了矩形范围，确保擦边（两个坦克相隔半个宽度）也能打到
        let p2 = tank.getPoint();
        let size2 = tank.getRelativeSize();
        return this.rectIntersect(...range1, p2, size2);
    }

    hitEnemiesBullets(bullet1, bullet_index) {
        let index = -1;
        for (let bullet2 of this.bullets) {
            ++index;
            if (index === bullet_index) continue; // 跳过自己
            if (this.isHitBullet(bullet1, bullet2)) {
                return [bullet_index, index];
            }
        }

        return null;
    }

    isHitBullet(bullet1, bullet2) {
        let p1 = bullet1.getPoint();
        let size1 = bullet1.getRelativeSize();
        let p2 = bullet2.getPoint();
        let size2 = bullet2.getRelativeSize();
        return this.rectIntersect(p1, size1, p2, size2);
    }

    oneBulletDestroyed(bullet, hit_tank_fn, hit_bullet_fn, bullet_index) {
        let point = bullet.getPoint();
        let size = bullet.getRelativeSize();
        let is_player = bullet.getRole() === "player";

        // 是否越界，简单
        if (this.isOverflow(point, size)) {
            this.animations.push(bullet.getOverAnimation());
            if (is_player) {
                this.ui.ga.play("hit_edge");
            }
            return [bullet_index];
        }

        // 是否击中子弹，普通
        let pair = hit_bullet_fn.call(this, bullet, bullet_index);
        if (pair) {
            // 无动画
            return pair;
        }

        // 是否击中砖块，普通
        let elements = this.isHitTile(point, size, bullet.getDirect());
        if (elements.length) {
            this.animations.push(bullet.getOverAnimation());
            // 标记建筑改变
            for (let element of elements) {
                let after = element.beShot(bullet, is_player);
                if (after.changed) {
                    this.changed_tile.push(element);
                }
                this.animations.push(...after.animations);

                this.ui.ga.play(after.audio);
            }
            return [bullet_index];
        }

        // 是否击中坦克，复杂（必须遍历所有坦克，且要计算重生操作）
        if (hit_tank_fn.call(this, bullet)) {
            this.animations.push(bullet.getOverAnimation());
            return [bullet_index];
        }

        // 什么也没发生，继续移动
        point = bullet.predictPoint();
        bullet.moveTo(point.x, point.y);
        return [];
    }

    rectIntersect(p1, size1, p2, size2) {
        return !(p2.x >= (p1.x + size1.w)
            || (p2.x + size2.w) <= p1.x
            || p2.y >= (p1.y + size1.h)
            || (p2.y + size2.h) <= p1.y);
    }

    isTankImpactTank(id1, p1, size1, tanks) {
        let intersect, i = -1;
        let index = -1;
        for (let tank of tanks) {
            ++index;
            if (id1 === index) continue;

            let p2 = tank.getPoint();
            let size2 = tank.getRelativeSize();
            intersect = this.rectIntersect(p1, size1, p2, size2);
            if (intersect) {
                i = index;
                break;
            }
        }

        return i;
    }

    isOverflow(p, size) {
        return (p.x < 0 || p.x + size.w > this.stage_width || p.y < 0 || p.y + size.h > this.stage_height);
    }

    isTankImpactTile(p1, size1, tank) {
        // 查找矩阵中，坦克对应的行列
        let x_center = p1.x + (size1.w >> 1); // 注意：位运算优先级低于基本运算，要加括号
        let y_center = p1.y + (size1.h >> 1);
        let row = this.searchIndex(y_center);
        let col = this.searchIndex(x_center);

        // 坦克宽度相当于2块砖，最多跨越对应方向的3块砖，因此只需要计算3块相交即可
        // 考虑到边界，可能少于3块
        let choose = [];
        let direct = tank.getDirect();
        switch (direct) {
            case Constant.DIRECT_LEFT: //左边三行：上 中 下
                choose.push([row - 1, col - 1]);
                choose.push([row, col - 1]);
                choose.push([row + 1, col - 1]);
                break;
            case Constant.DIRECT_UP: // 上边三列：左 中 右
                choose.push([row - 1, col - 1]);
                choose.push([row - 1, col]);
                choose.push([row - 1, col + 1]);
                break;
            case Constant.DIRECT_RIGHT: // 右边三行：上 中 下
                choose.push([row - 1, col + 1]);
                choose.push([row, col + 1]);
                choose.push([row + 1, col + 1]);
                break;
            case Constant.DIRECT_DOWN: // 下边三列：左 中 右
                choose.push([row + 1, col - 1]);
                choose.push([row + 1, col]);
                choose.push([row + 1, col + 1]);
                break;
        }

        let target = null;
        let is_empty = true;
        for (let [row, col] of choose) {
            if (row < 0 || row > 25) continue;
            if (col < 0 || col > 25) continue;
            let element = this.stage_map[row][col];
            if (!element) continue; // 空地

            // 森林可以穿过
            if (element.canTankThrough()) {
                element.beWalk(tank);
                is_empty = false;
                continue;
            }
            let p2 = element.getPoint();
            let size2 = element.getRelativeSize();
            // 计算矩形相交
            let intersect = this.rectIntersect(p1, size1, p2, size2);
            if (intersect) {
                target = element;
                is_empty = false;
                break;
            }
        }

        if (is_empty) tank.setNormal(); // 空地上重置滑行状态

        return target;
    }

    isHitTile(p1, size1, direct) {
        // 查找矩阵中，子弹对应的行列
        let x_center = p1.x + (size1.w >> 1);
        let y_center = p1.y + (size1.h >> 1);
        let row = this.searchIndex(y_center);
        let col = this.searchIndex(x_center);

        // 可能击中2个，是否击中2块中间，直接遍历3个
        // 有可能是坦克抵进墙面打出的子弹，初始时已进入墙内部，故追加之前的3块
        let choose = [];
        switch (direct) {
            case Constant.DIRECT_LEFT: //左边三行：上 中 下
                choose.push([row - 1, col]);
                choose.push([row, col]);
                choose.push([row + 1, col]);

                choose.push([row - 1, col - 1]);
                choose.push([row, col - 1]);
                choose.push([row + 1, col - 1]);
                break;
            case Constant.DIRECT_UP: // 上边三列：左 中 右
                choose.push([row, col - 1]);
                choose.push([row, col]);
                choose.push([row, col + 1]);

                choose.push([row - 1, col - 1]);
                choose.push([row - 1, col]);
                choose.push([row - 1, col + 1]);
                break;
            case Constant.DIRECT_RIGHT: // 右边三行：上 中 下
                choose.push([row - 1, col]);
                choose.push([row, col]);
                choose.push([row + 1, col]);

                choose.push([row - 1, col + 1]);
                choose.push([row, col + 1]);
                choose.push([row + 1, col + 1]);
                break;
            case Constant.DIRECT_DOWN: // 下边三列：左 中 右
                choose.push([row, col - 1]);
                choose.push([row, col]);
                choose.push([row, col + 1]);

                choose.push([row + 1, col - 1]);
                choose.push([row + 1, col]);
                choose.push([row + 1, col + 1]);
                break;
        }

        let elements = [];
        for (let [row, col] of choose) {
            if (row < 0 || row > 25) continue;
            if (col < 0 || col > 25) continue;
            if (elements.length >= 2) continue;

            let element = this.stage_map[row][col];
            if (!element) continue; // 空地

            // 森林、冰、河流可以穿过
            if (element.canBulletThrough()) continue;

            let p2 = element.getPoint();
            let size2 = element.getRelativeSize();
            let intersect = this.rectIntersect(p1, size1, p2, size2);
            if (intersect) elements.push(element);
        }

        return elements;
    }

    searchIndex(val) {
        // 二分查找
        let left = 0;
        let right = 26;
        let square_size = 8 * Constant.ZOOM;
        while(left <= right) {
            let mid = (left + right) >> 1;
            let v1 = square_size * mid; // 最左边/上边坐标
            let v2 = v1 + square_size;
            if (v1 <= val && val <= v2) return mid; // 找到了
            else if (val < v1) right = mid - 1; // 在左边
            else left = mid + 1; // 在右边
        }

        return -1;
    }

    bulletsGarbageCollection(bullets, trash_fn) {
        let hit_tank_map = {
            player: this.hitEnemies,
            enemy: this.hitPlayers,
        };
        let hit_bullet_map = {
            player: this.hitEnemiesBullets,
            enemy: () => {return null;},
        };
        let index = -1;
        let trash = [];
        // TODO 子弹中保留有坦克引用，可能导致内存泄漏，需要排查
        for (let bullet of bullets) {
            ++index;
            let role = bullet.getRole();
            let index_list = this.oneBulletDestroyed(bullet, hit_tank_map[role], hit_bullet_map[role], index);
            // ！！禁止在遍历时删除元素，以免出现不可预知的情况
            trash.push(...index_list);
        }
        // 因为删除后下标可能会变，故先排序，再从末尾删除
        trash.sort();
        while(trash.length) {
            let i = trash.pop();
            if (!bullets[i]) continue; // 可能有重复的index

            trash_fn.call(this, i);
            bullets.splice(i, 1);
        }
    }

    isDashProp(player) {
        let p1 = player.getPoint();
        let size1 = player.getRelativeSize();
        let index = -1;
        for (let prop of this.props) {
            ++index;
            let rect = prop.getRect();
            if (this.rectIntersect(p1, size1, {x:rect[0], y:rect[1]}, {w:rect[2], h:rect[3]})) {
                return index;
            }
        }

        return -1;
    }

    getWeightDirects() {
        let directs = [3];
        let part = [0, 2];
        part.shuffle();
        directs.push(...part, 1);
        return directs;
    }

    chooseRightDirect(tank, check_fn) {
        if (tank.isLimit()) return false;
        let directs = this.getWeightDirects();
        let d = tank.getDirect();
        for (let direct of directs) {
            if (d === direct) continue;

            let p = tank.predictPoint(direct);
            let size = tank.getRelativeSize();
            if (check_fn.call(this, p, size, tank)) continue;
            tank.turn(direct);
            // tank.moveTo(p.x, p.y);
            break;
        }
    }

    getCenterDistance(p1, size1, p2, size2) {
        let x1 = p1.x + (size1.w / 2);
        let x2 = p2.x + (size2.w / 2);
        let y1 = p1.y + (size1.h / 2);
        let y2 = p2.y + (size2.h / 2);
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
        // return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
    }

    chooseBestDirect(tank1, tank2) {
        if (tank1.isLimit()) return false;
        let directs = this.getWeightDirects();
        // 计算2个坦克中心点的距离（平方），寻找tank1远离（拉大距离）的方向
        let p1 = tank1.getPoint();
        let size1 = tank1.getRelativeSize();
        let p2 = tank2.getPoint();
        let size2 = tank2.getRelativeSize();
        let dist1 = this.getCenterDistance(p1, size1, p2, size2);
        for (let direct of directs) {
            p1 = tank1.predictPoint(direct);
            size1 = tank1.getRelativeSize();
            if (this.isOverflow(p1, size1)) continue;
            if (this.isTankImpactTile(p1, size1, tank1)) continue;

            let dist2 = this.getCenterDistance(p1, size1, p2, size2);
            if (dist2 > dist1) {
                tank1.turn(direct);
                if (direct === tank1.getDirect()) tank1.moveTo(p1.x, p1.y);

                return true;
            }
        }

        return false;
    }

    /**
     * 直接弹开坦克，可以有效避免死锁问题
     * @param x
     * @param y
     * @param w
     * @param h
     * @param directs
     */
    flickTanks(x, y, w, h, directs) {
        // 解决死锁问题：出生时弹开有交集的坦克
        let p1 = {x, y};
        let size1 = {w, h};
        for (let tank of [...this.tanks, ...this.players]) {
            let p2 = tank.getPoint();
            let size2 = tank.getRelativeSize();
            if (!this.rectIntersect(p1, size1, p2, size2)) continue;

            let d = tank.getDirect();
            let allows = directs.intersect([d]);
            let move_direct = allows.length ? d : (d + 2) % 4;
            let p1_p2_horizontal = p1.x < p2.x; // p1 p2左右排列
            // let p1_p2_vertical = p1.y < p2.y; // p1 p2上下排列
            let move_w, move_h;
            // AI'是碍事的
            switch (move_direct) {
                case Constant.DIRECT_LEFT: // 碍事坦克向左平移，AI与AI'，玩家与AI'
                    move_w = p1_p2_horizontal ? (p2.x - p1.x + size2.w) : (p2.x + size2.w - p1.x);
                    p2.x -= move_w;
                    break;
                case Constant.DIRECT_RIGHT: // 碍事坦克向右平移，AI与AI'，玩家与AI'
                    move_w = p1_p2_horizontal ? (p1.x + size1.w - p2.x) : (p1.x - p2.x + size1.w);
                    p2.x += move_w;
                    break;
                case Constant.DIRECT_DOWN:// 碍事坦克向下平移，AI与AI'
                    move_h = p1.y + size1.h - p2.y;
                    p2.y += move_h;
                    break;
                case Constant.DIRECT_UP: // 碍事坦克向上平移，玩家与AI'
                    move_h = p2.y + size2.h - p1.y;
                    p2.y -= move_h;
                    break;
            }
            tank.moveTo(p2.x, p2.y);
        }
    }
}
