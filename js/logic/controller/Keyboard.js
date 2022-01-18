class Keyboard {
    constructor(state) {
        this.state = state;
    }

    setState(state) {
        this.stop();
        this.state = state;
    }

    listen() {
        let key_map = {
            'Enter': 'START',
            ' ': 'SELECT',

            'w': 'L-UP',
            's': 'L-DOWN',
            'a': 'L-LEFT',
            'd': 'L-RIGHT',
            'j': 'A',
            'k': 'B',

            'ArrowUp': 'R-UP',
            'ArrowDown': 'R-DOWN',
            'ArrowLeft': 'R-LEFT',
            'ArrowRight': 'R-RIGHT',
            '1': 'X',
            '2': 'Y',
        };
        this.f1 = (event) => {
            let key = event.key;
            let code = key_map.hasOwnProperty(key) ? key_map[key] : 'ABORT';
            this.state.onKeydown(code);
        };
        this.f2 = (event) => {
            let key = event.key;
            let code = key_map.hasOwnProperty(key) ? key_map[key] : 'ABORT';
            this.state.onKeyup(code);
        };
        addEventListener("keydown", this.f1);
        addEventListener("keyup", this.f2);
    }

    stop() {
        removeEventListener("keydown", this.f1);
        removeEventListener("keyup", this.f2);
    }
}