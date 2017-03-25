/**
 * Event
 */

function mouseMove(event){
    // マウスカーソル座標の更新
    mouse.x = event.clientX - canvas.offsetLeft;
    mouse.y = event.clientY - canvas.offsetTop;
}
