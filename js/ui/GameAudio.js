class GameAudio {
    constructor() {
        this.keys = [
            "bonus",
            "claim_powerup",
            "claim_tank_life",
            "eagle_bomb",
            "enemy_bomb",
            "enemy_move",
            "game_begin",
            "game_over",
            "game_pause",
            "armor_be_shot",
            "hit_brick",
            "hit_edge",
            "player_bomb",
            "player_move",
            "player_skating",
            "powerup_tank_be_shot",
            "settle",
            "shot",
        ];
        this.audios = {};
        this.key = "game_begin";
        this.interruptible = false;
    }

    load() {
        let promises = [];
        for (let key of this.keys) {
            promises.push(new Promise((resolve) => {
                let audio = new Audio("./sound/" + key + ".mp3");
                audio.onloadeddata = () => {
                    audio.key = key;
                    resolve(audio);
                };
            }));
        }

        return Promise.all(promises).then((values) => {
            for (let audio of values) {
                this.audios[audio.key] = audio;
                delete audio.key;
            }
        });
    }

    play(key) {
        if (!key) return;
        if (!this.interruptible) return;
        this.audios[this.key].muted = true;
        this.audios[key].muted = false;
        this.audios[key].currentTime = 0;
        this.audios[key].play();
        this.key = key;
    }

    forcePlay(key) {
        this.audios[key].muted = false;
        this.audios[key].currentTime = 0;
        this.audios[key].play();
        this.audios[key].addEventListener("ended", () => {
            this.interruptible = true;
        });
    }

    alonePlay(key) {
        if (!this.interruptible) return;
        this.audios[key].muted = false;
        if (this.audios[key].currentTime <= 0) {
            this.audios[key].play();
        } else if (this.audios[key].ended) {
            this.audios[key].currentTime = 0;
            this.audios[key].play();
        }
    }

    mute(key) {
        this.audios[key].muted = true;
    }

    stop(key) {
        this.audios[key].pause();
        this.audios[key].currentTime = 0;
    }
}