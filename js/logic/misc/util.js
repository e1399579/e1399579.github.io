Math.rand = (min, max) => {
    return Math.random() * (max - min + 1) | 0 + min;
};

Array.prototype.intersect = function(arr) {
    return this.filter((n) => {
        return arr.includes(n);
    });
};

Array.prototype.diff = function(arr) {
    return this.filter((n) => {
        return !arr.includes(n);
    });
};

Array.prototype.sum = function() {
    return this.reduce((acc, curr) => {
        return acc + curr;
    }, 0);
}

Array.prototype.shuffle = function() {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.random() * (i + 1) | 0;
        [this[i], this[j]] = [this[j], this[i]];
    }
}