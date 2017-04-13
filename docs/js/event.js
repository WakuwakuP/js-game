/**
 * Event
 */

function mouseMove(event) {
    // マウスカーソル座標の更新
    mouse.x = event.clientX - canvas.offsetLeft;
    mouse.y = event.clientY - canvas.offsetTop;
}

function mouseDown(event) {
    player.move.x = 0 - player.move.x * 1.3;
    player.move.y = 0 - player.move.y * 1.3;
}