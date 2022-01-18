class RisingNumber extends Animation {
    constructor(total, config = {}, delay = 0) {
        let frame_num = 8 * Constant.FRAME_FACTOR;
        let line_stay_num = 30 * Constant.FRAME_FACTOR;
        let last_stay_num = 106 * Constant.FRAME_FACTOR;
        let progress = [];
        let total_step = 0;
        for (let line of config.lines) {
            line.sort((a, b) => {
                let factor1 = a[0][1] > 0 ? a[0][0] / a[0][1] : 0;
                let factor2 = b[0][1] > 0 ?b[0][0] / b[0][1] : 0;
                return factor2 - factor1; // 倒序排列
            });
            let first_number = line[0];
            let max_step = first_number[0][1] > 0 ? first_number[0][0] / first_number[0][1] : 0; // 每一行使用的时间，以该行渲染需要的最大步骤为准
            total_step += max_step;
            progress.push([1, max_step]); // index0-当前步骤，index1-最大步骤
        }
        total = total_step * frame_num + config.lines.length * line_stay_num + last_stay_num;
        super(total, config, delay);

        this.line_stay_num = line_stay_num;
        this.last_stay_num = last_stay_num;
        this.line_no = 0;
        this.progress = progress;
        this.stay = this.wait(0);
        this.every = this.every(frame_num);
    }

    doPlay(ui, ctx) {
        if (!this.stay.next().done) return;
        if (!this.every.next().value) return;

        ctx.textAlign = "right";
        // 每行是三维数组，单个数值结构：[[最大值，步长]，[坐标x,y]]
        // line = [
        //     [[400, 100], [x, y]],
        //     [[4, 1], [x, y]],
        // ];
        let line = this.config.lines[this.line_no];
        let progress = this.progress[this.line_no];
        let height = Constant.BASE_FONT_SIZE * Constant.ZOOM;
        let sound = false;
        for (let val of line) {
            let max = val[0][0]; // 最大值
            let step = val[0][1]; // 步长
            let point = val[1]; // 坐标
            let curr = progress[0] * step; // 当前值：当前步骤*步长

            // 0特殊处理，因为第1步就会跳过不显示了
            if (0 === max && 1 === progress[0]) {
                let width = Constant.BASE_FONT_SIZE * Constant.ZOOM + 1;
                ctx.clearRect(point[0] - width, point[1], width, height);
                ctx.fillStyle = "black";
                ctx.fillRect(point[0] - width, point[1], width, height);
                ctx.fillStyle = "white";
                ctx.fillText("0", ...point);
                continue;
            }

            if (curr > max) continue;
            sound = true;
            let width = max.toString().length * Constant.BASE_FONT_SIZE * Constant.ZOOM + 1; // 多1个像素防止擦除出现残留的白线
            ctx.clearRect(point[0] - width, point[1], width, height);
            ctx.fillStyle = "black";
            ctx.fillRect(point[0] - width, point[1], width, height);
            ctx.fillStyle = "white";
            ctx.fillText(curr.toString(), ...point);
        }
        if (sound) ui.ga.play("settle");

        if (this.progress[this.line_no][0]++ >= progress[1]) {
            if (this.line_no < this.config.lines.length) {
                let stay_num = this.line_stay_num;
                if (this.line_no === this.config.lines.length - 1) stay_num += this.last_stay_num; // 本行+最后帧数，共136
                this.stay = this.wait(stay_num);
            }

            if (this.line_no < this.config.lines.length - 1) ++this.line_no;
        }
    }

    *wait(n) {
        for (let i = 0;i < n;++i) {
            yield;
        }
    }

    *every(n) {
        while(1) {
            yield true; // eg. 10=1*true + 9*false
            for (let i = 0;i < n - 1;++i) {
                yield false;
            }
        }
    }
}