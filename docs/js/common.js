/**
 * Common
 */
class Vector {
  constructor(){
    this.x = 0;
    this.y = 0;
  }
}

class Player extends Vector {
  constructor() {
    super();
    this.move = new Vector();
    this.alive = true;
  }

   dist(Vector){
    var x2 = (aPoint.x - this.x) * (aPoint.x - this.x);
    var y2 = (aPoint.y - this.y) * (aPoint.y - this.y);
    return Math.sqrt(x2 + y2);
  }
}


function speedLimit(dist) {
  if (dist > 0) {
    if (dist > 20){
      dist = 20;
    }
  } else {
    if (-20 > dist) {
      dist = -20;
    }
  }
  return dist;
}
