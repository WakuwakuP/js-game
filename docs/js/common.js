/**
* Common
*/
class Vector {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  // 距離を計算
  dist(aPoint) {
    var x2 = (aPoint.x - this.x) * (aPoint.x - this.x);
    var y2 = (aPoint.y - this.y) * (aPoint.y - this.y);
    return Math.sqrt(x2 + y2);
  }
}
/**
* Player class
*/
class Player extends Vector {
  constructor() {
    super();
    this.move = new Vector();
    this.size = 10;
    this.alive = true;
    this.resistance = 6;
  }

  // Playerの移動量を決定する
  movement(delta) {
    this.move.x += ((mouse.x - this.x) - (this.resistance * this.move.x)) / 5 * delta;
    this.move.y += ((mouse.y - this.y) - (this.resistance * this.move.y)) / 5 * delta;
    this.x += this.move.x;
    this.y += this.move.y;
  }

  // Playerの表示をする
  render() {
    effectCtx.beginPath();
    effectCtx.fillStyle = 'rgba(0, 0, 255, 0.75)';
    effectCtx.arc(player.x, player.y, player.size, 0, Math.PI * 2, false);
    effectCtx.fill();
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
* PassPoint class
* 通過点を管理する。
*/
class PassPoint extends Vector {
  constructor() {
    super();
    this.size = 20;
    this.alive = false;
  }

  // 座標をランダムで指定
  setPoint() {
    if (this.alive == false) {
      this.alive = true;
      this.x = Math.floor(Math.random() * 701) + 50;
      this.y = Math.floor(Math.random() * 501) + 50;
    }
  }

  // 表示
  render() {
    if (this.alive == true) {
      bufferCtx.beginPath();
      bufferCtx.fillStyle = 'rgba(0, 255, 0, 0.75)';
      bufferCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      bufferCtx.fill();
    }
  }
}

/**
* 四捨五入用関数
*/
function floatFormat( number, n ) {
  var _pow = Math.pow( 10 , n ) ;

  return Math.round( number * _pow ) / _pow ;
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
