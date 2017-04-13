/**
 * Common
 */
class Vector {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}
/**
 * Player class
 */
class Player extends Vector {
    constructor() {
        super();
        this.move = new Vector();
        this.alive = true;
    }

    dist(Vector) {
            var x2 = (aPoint.x - this.x) * (aPoint.x - this.x);
            var y2 = (aPoint.y - this.y) * (aPoint.y - this.y);
            return Math.sqrt(x2 + y2);
        }
        // Playerの移動量を決定する
    movement(delta) {
            this.move.x += ((mouse.x - this.x) - (6 * this.move.x)) / 5 * delta;
            this.move.y += ((mouse.y - this.y) - (6 * this.move.y)) / 5 * delta;
            this.x += this.move.x;
            this.y += this.move.y;
        }
        // Playerの表示をする
    render() {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 255, 0.75)';
        ctx.arc(player.x, player.y, 10, 0, Math.PI * 2, false);
        ctx.fill();
    }
}
/**
 * Enemy class
 */
class Enemy extends Vector {
    constructor() {
        super();
        this.move = new Vector();
        this.level = 1;
        this.alive = true;
    }

    // Enemyの移動量
    movement(delta) {
        switch (level) {
            case 1:
                //ここにlevel01の行動を書く
                break;
            default:
                break;
        }
    }

    // Enemyの表示
    render() {
        ctx.biginPath();
        ctx.fillStyle = 'rgba(255, 0, 0, 0.75)';
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, false);
        ctx.fill();
    }
}

/**
 * Text class
 */
class Text {
    constructor(x, y, txt) {
        var x = x;
        var y = y;
        var str = txt;
        var color = 'rgba(0, 0, 0, 0.75)';
    }

    update(txt) {
        this.str = txt;
    }

    // textの表示
    render() {
        ctx.font = 'normal 40px "Arial"';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillText(this.str, this.x, this.y);
    }
}

function speedLimit(dist) {
    if (dist > 0) {
        if (dist > 20) {
            dist = 20;
        }
    } else {
        if (-20 > dist) {
            dist = -20;
        }
    }
    return dist;
}