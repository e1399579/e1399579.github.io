class Animation {
    constructor(total, config = {}, delay = 0) {
        this.total = total;
        this.config = config;
        this.delay = delay;
        this.fn = () => {};
        this.is_complete = false;
        this.frame = 0;
    }

    getLayer() {
        return 0;
    }

    isComplete() {
        return this.is_complete || (this.is_complete = this.frame >= this.total + this.delay);
    }

    onFinish(fn) {
        this.fn = fn;
    }

    finish() {
        this.fn.call(...arguments);
    }

    play(ui, ctx) {
        ++this.frame;
        this.doPlay(ui, ctx);
    }

    doPlay(ui, ctx) {}

    skip(ui, ctx) {}
}