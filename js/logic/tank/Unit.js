class Unit {
    isVertical() {
        return this.direct & 1; // 奇数为垂直方向
    }

    getRelativeSize() {
        let w, h;
        if (this.isVertical()) {
            w = this.width;
            h = this.height;
        } else {
            w = this.height;
            h = this.width;
        }

        return {w, h};
    }

    getPoint() {
        return {x: this.x, y: this.y};
    }

    getDirects() {
        return [0, 1, 2, 3];
    }

    getHeadPoint(point, direct) {
        let x = point.x;
        let y = point.y;
        switch (direct) {
            case Constant.DIRECT_LEFT:
                y += (this.width >> 1);
                break;
            case Constant.DIRECT_UP:
                x += (this.width >> 1);
                break;
            case Constant.DIRECT_RIGHT:
                x += this.height;
                y += (this.width >> 1);
                break;
            case Constant.DIRECT_DOWN:
                x += (this.width >> 1);
                y += this.height;
                break;
        }

        return {x, y};
    }
}
