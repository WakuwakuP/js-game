/**
 * Main
 */

var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;
var MAX_PASS_POINT = 5;

window.addEventListener('load', init);

var canvas1;
var ctx1;

var mouse = new Vector();
var player = new Player();
var pass = new Array(MAX_PASS_POINT);
for (i = 0; i < MAX_PASS_POINT; i++) {
    pass[i] = new PassPoint();
}


// モーション用変数
var lastTimestamp = null;
var delta = 0; // 前回フレーム時間からの経過時間(単位:秒)
var timeCount = 0;

var score = 0;

// アセット定義
var Asset = {};
Asset.assets = [
    { type: 'image', name: 'back', src: 'assets/back.png' },
    { type: 'image', name: 'box', src: 'assets/box.png' }
];

// 画像
Asset.images = {};

/**
 * アセットの読み込み
 */
Asset.loadAssets = function(onComplete) {
    var total = Asset.assets.length;
    var loadCount = 0;

    // アセットが読み込み終わった時に呼ばれるコールバック
    var onLoad = function() {
        loadCount++;
        if (loadCount >= total) {
            onComplete();
        }
    };

    // すべてのアセットを読み込む
    Asset.assets.forEach(function(asset) {
        switch (asset.type) {
            case 'image':
                Asset._loadImage(asset, onLoad);
                break;
        }
    });
};

/**
 * 画像の読み込み
 */
Asset._loadImage = function(asset, onLoad) {
    var image = new Image();
    image.src = asset.src;
    image.onload = onLoad;
    Asset.images[asset.name] = image;
}

/**
 * 初期化
 */
function init() {
    // スクリーンの初期化
    canvas1 = document.getElementById('maincanvas');
    canvas2 = document.getElementById('buffercanvas');
    ctx1 = canvas1.getContext('2d');
    ctx2 = canvas2.getContext('2d');
    canvas1.width = SCREEN_WIDTH;
    canvas1.height = SCREEN_HEIGHT;
    canvas2.width = SCREEN_WIDTH;
    canvas2.height = SCREEN_HEIGHT;

    // イベントの登録
    canvas1.addEventListener('mousemove', mouseMove, true);
    canvas1.addEventListener('mousedown', mouseDown, false);

    // アセットの読み込み
    Asset.loadAssets(function() {
        // アセットがすべて読み込み終わったら、
        // ゲームの更新処理を始めるようにする
        requestAnimationFrame(update);
    });
}

/**
 * 更新
 */
function update(timestamp) {
    if (lastTimestamp != null) {
        delta = (timestamp - lastTimestamp) / 1000; // ミリ秒を1000で割ると秒になる(1000ミリ秒÷1000は1秒)
    }
    lastTimestamp = timestamp;

    // プレイヤーの移動
    player.movement(delta);

    // 通過点の更新
    for (i = 0; i < MAX_PASS_POINT; i++) {
        pass[i].setPoint();
    }

    // プレイヤーと通過点の当たり判定
    for (i = 0; i < MAX_PASS_POINT; i++) {
        if (player.dist(pass[i]) <= player.size + pass[i].size) {
            pass[i].alive = false;
            score += 100;
        }
    }

    // ここまで
    requestAnimationFrame(update);
    render();
}

/**
 * 描画
 */
function render() {
    // 表示クリア
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);

    // バッファ描画
    // エフェクト
    ctx2.globalAlpha = 0.3;
    ctx2.fillStyle = '#fafafa';
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
    ctx2.globalAlpha = 1;

    // テキスト表示
    ctx2.font = '20px "Arial"';
    ctx2.fillStyle = "#00F";
    ctx2.fillText("SCORE:" + score, 320, 20);

    // Player表示
    player.render();

    // フリップ
    ctx1.drawImage(buffercanvas, 0, 0);

    // 通過点の表示
    for (i = 0; i < MAX_PASS_POINT; i++) {
        pass[i].render();
    }
}