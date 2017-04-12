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