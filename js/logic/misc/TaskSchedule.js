class TaskSchedule {
    constructor(fn, delay, keep = 0) {
        this.fn = fn;
        this.delay = delay;
        this.keep = keep;
        this.executed = false;
        this.frame = 0;
    }

    incrFrame() {
        ++this.frame;
    }

    isExecuted() {
        return this.executed;
    }

    isTime() {
        return this.frame >= this.delay;
    }

    execute() {
        this.fn.call(...arguments); // 指定this为调用方
        this.executed = true;
    }

    isComplete() {
        return this.frame >= this.keep + this.delay;
    }

    getDelay() {
        return this.delay; // 方便按delay排序
    }

    static compare(a, b) {
        let n1 = a.getDelay();
        let n2 = b.getDelay();
        return n1 - n2;
    }
}