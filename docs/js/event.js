/**
* Event
*/

function mouseMove(event) {
  // マウスカーソル座標の更新
  mouse.x = event.clientX - canvas.offsetLeft;
  mouse.y = event.clientY - canvas.offsetTop;
}

function mouseDown(event) {
  switch (scene) {
    case 'TITLE':
      scene = 'GAME';
      break;
    case 'GAME':
      player.move.x = 0 - player.move.x * 1.3;
      player.move.y = 0 - player.move.y * 1.3;
      break;
    case 'RESULT':
      scene = 'TITLE';
      timeCount = 0;
      life = 3;
      score = 0;
      scoreRate = 0;
      addScore = 0;
      comboFlag = false;
      comboScore = 0;
      comboCount = 0;
      comboTimer = 0;
      maxCombo = 0;
      break;
  }
}
