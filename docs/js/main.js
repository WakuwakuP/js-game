/**
* Main
*/

var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;
var MAX_PASS_POINT = 7;

window.addEventListener('load', init);

var canvas;
var buffercanvas;
var effectcanvas;
var ctx;
var bufferctx;
var effectCtx;

var mouse = new Vector();
var player = new Player();
var pass = new Array(MAX_PASS_POINT);
for (i = 0; i < MAX_PASS_POINT; i++) {
  pass[i] = new PassPoint();
}

// 画面の状態を表す
var scene = 'TITLE';

// モーション用変数
var lastTimestamp = null;
var delta = 0; // 前回フレーム時間からの経過時間(単位:秒)
var timeCount = 0;
var fps = 0;

// スコア関連
var life = 3;
var score = 0;
var scoreRate = 0;
var addScore = 0;
var comboFlag = false;
var comboScore = 0;
var comboCount = 0;
var comboTimer = 0;
var maxCombo = 0;

var popFlag = false;

// アセット定義
var Asset = {};
Asset.assets = [
  //{ type: 'image', name: 'image', src: 'assets/image.png' }
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
  canvas = document.getElementById('maincanvas')
  buffercanvas = document.getElementById('buffercanvas');
  effectcanvas = document.getElementById('effectcanvas');

  ctx = canvas.getContext('2d');
  bufferCtx = buffercanvas.getContext('2d');
  effectCtx = effectcanvas.getContext('2d');

  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  buffercanvas.width = SCREEN_WIDTH;
  buffercanvas.height = SCREEN_HEIGHT;
  effectcanvas.width = SCREEN_WIDTH;
  effectcanvas.height = SCREEN_HEIGHT;

  // イベントの登録
  canvas.addEventListener('mousemove', mouseMove, true);
  canvas.addEventListener('mousedown', mouseDown, false);

  // アセットの読み込み
  Asset.loadAssets(function() {
    // アセットがすべて読み込み終わったら、
    // ゲームの更新処理を始めるようにする
    requestAnimationFrame(update);
  });
  requestAnimationFrame(update);
}

/**
* 更新
*/
function update(timestamp) {
  if (lastTimestamp != null) {
    delta = (timestamp - lastTimestamp) / 1000; // ミリ秒を1000で割ると秒になる(1000ミリ秒÷1000は1秒)
    fps = Math.round(1 / delta);
  }
  lastTimestamp = timestamp;

  // プレイヤーの移動
  player.movement(delta);

  // 通過点の更新
  for (i = 0; i < MAX_PASS_POINT; i++) {
    pass[i].setPoint();
  }

  if (scene == 'GAME'){
    // 時間計測
    timeCount += delta;
    if (0 < comboTimer){
      comboTimer -= delta;
    }

    // プレイヤーと通過点の当たり判定
    for (i = 0; i < MAX_PASS_POINT; i++) {
      if (player.dist(pass[i]) <= player.size + pass[i].size) {
        pass[i].alive = false;

        // スコア加算
        scoreRate = 1 + comboCount / 50;
        comboScore += 500 * scoreRate;

        // コンボ数増加
        comboCount += 1;

        // コンボフラグ
        comboFlag = true;

        // コンボ可能時間リセット
        comboTimer += 0.5 + 1 / comboCount * 3;
        if (5 < comboTimer){
          comboTimer = 5;
        }
      }
    }
  }

  // コンボリセット
  if (comboTimer < 0 && comboCount != 0) {
    comboCount = 0;
    addScore += comboScore;
    comboScore = 0;
    comboFlag = false;
    life -= 1;
  }

  // 最大コンボ数の計算
  if (maxCombo < comboCount) {
    maxCombo = comboCount;
  }

  // 加算時のスコア変動
  if (0 < addScore) {
    var ad = '3';
    for (i = 1; i < String(addScore).length - 1; i++) {
      ad += '3';
    }
    ad = Number(ad);
    if (ad <= addScore){
      addScore -= ad;
      score += ad;
    } else {
      score += addScore;
      addScore = 0;
    }
  }
  if (life <= 0 && addScore <= 0) {
    scene = 'RESULT';
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bufferCtx.clearRect(0, 0, buffercanvas.width, buffercanvas.height);

  // エフェクト
  effectCtx.globalAlpha = 0.3;
  effectCtx.fillStyle = '#fafafa';
  effectCtx.fillRect(0, 0, effectcanvas.width, effectcanvas.height);
  effectCtx.globalAlpha = 1;

  switch (scene) {
    case 'GAME':
      // スコア表示
      effectCtx.font = '18px "Arial"';
      effectCtx.textAlign = 'end';
      effectCtx.fillStyle = "#00F";
      effectCtx.fillText("SCORE:", 310, 20);

      effectCtx.font = '18px "Arial"';
      effectCtx.textAlign = 'end';
      effectCtx.fillStyle = "#00F";
      effectCtx.fillText(score, 450, 20);

      // スコア加算エフェクト
      if (0 < addScore) {
        effectCtx.font = '18px "Arial"';
        effectCtx.textAlign = 'end';
        effectCtx.fillStyle = "#00F";
        effectCtx.fillText(addScore, 450, 40);
      }
    default:
      // Player表示
      player.render();
  }

  // エフェクトをバッファに描画
  bufferCtx.drawImage(effectcanvas, 0, 0);

  switch (scene) {
    case 'TITLE':
      // スタート画面
      // タイトル
      bufferCtx.font = '80px "Arial"';
      bufferCtx.textAlign = 'center';
      bufferCtx.fillStyle = "#00F";
      bufferCtx.fillText("TITLE", 400, 200);

      bufferCtx.font = '40px "Arial"';
      bufferCtx.textAlign = 'center';
      bufferCtx.fillStyle = "#00F";
      bufferCtx.fillText("Click to Start", 400, 400);
      break;
    case 'GAME':
      // ゲーム中
      // 通過点の表示
      for (i = 0; i < MAX_PASS_POINT; i++) {
        pass[i].render();
      }

      // fps表示
      bufferCtx.font = '18px "Arial"';
      bufferCtx.textAlign = 'end';
      bufferCtx.fillStyle = "#00F";
      bufferCtx.fillText("FPS:" + fps, 800, 600);

      // 経過時間表示
      bufferCtx.font = '18px "Arial"';
      bufferCtx.textAlign = 'start';
      bufferCtx.fillStyle = "#00F";
      bufferCtx.fillText("TIME:" + Math.floor(timeCount), 700, 20);

      // 最大コンボ数の表示
      bufferCtx.font = '18px "Arial"';
      bufferCtx.textAlign = 'end';
      bufferCtx.fillStyle = "#00F";
      bufferCtx.fillText("MAX COMBO:", 610, 20);

      bufferCtx.font = '18px "Arial"';
      bufferCtx.textAlign = 'end';
      bufferCtx.fillStyle = "#00F";
      bufferCtx.fillText(maxCombo, 680, 20);

      // ライフの表示
      bufferCtx.font = '18px "Arial"';
      bufferCtx.textAlign = 'start';
      bufferCtx.fillStyle = '#00F';
      bufferCtx.fillText('LIFE: ' + life, 20, 20)

      // コンボ継続時
      if (1 < comboCount) {
        // コンボ表示
        bufferCtx.font = '40px "Arial"';
        bufferCtx.textAlign = 'start';
        bufferCtx.fillStyle = "#00F";
        bufferCtx.fillText(comboCount + "Combo!!", 20, 100);

        // コンボ可能時間の表示
        bufferCtx.font = '20px "Arial"';
        bufferCtx.textAlign = 'start';
        bufferCtx.fillStyle = "#00F";
        bufferCtx.fillText(floatFormat(comboTimer, 2).toFixed(2) + 's', 30, 120);

        // スコア倍率の表示
        bufferCtx.font = '20px "Arial"';
        bufferCtx.textAlign = 'start';
        bufferCtx.fillStyle = "#00F";
        bufferCtx.fillText('x' + floatFormat(scoreRate, 2).toFixed(2), 100, 120);
      }

      // コンボ時に稼いだスコアを表示
      if (comboFlag) {
        bufferCtx.font = '18px "Arial"';
        bufferCtx.textAlign = 'end';
        bufferCtx.fillStyle = "#00F";
        bufferCtx.fillText("COMBO SCORE:", 310, 60);

        bufferCtx.font = '18px "Arial"';
        bufferCtx.textAlign = 'end';
        bufferCtx.fillStyle = "#00F";
        bufferCtx.fillText(comboScore, 450, 60);
      }
      break;
    case 'RESULT':
      // RESULT画面
      bufferCtx.font = '80px "Arial"';
      bufferCtx.textAlign = 'center';
      bufferCtx.fillStyle = "#00F";
      bufferCtx.fillText("GAME OVER", 400, 200);

      bufferCtx.font = '40px "Arial"';
      bufferCtx.textAlign = 'center';
      bufferCtx.fillStyle = "#00F";
      bufferCtx.fillText("RESULT", 400, 300);

      bufferCtx.font = '30px "Arial"';
      bufferCtx.textAlign = 'end';
      bufferCtx.fillStyle = "#00F";
      bufferCtx.fillText("SCORE:", 380, 340);

      bufferCtx.font = '30px "Arial"';
      bufferCtx.textAlign = 'start';
      bufferCtx.fillStyle = "#00F";
      bufferCtx.fillText(score, 420, 340);

      bufferCtx.font = '30px "Arial"';
      bufferCtx.textAlign = 'end';
      bufferCtx.fillStyle = "#00F";
      bufferCtx.fillText("COMBO:", 380, 370);

      bufferCtx.font = '30px "Arial"';
      bufferCtx.textAlign = 'start';
      bufferCtx.fillStyle = "#00F";
      bufferCtx.fillText(maxCombo, 420, 370);

      bufferCtx.font = '30px "Arial"';
      bufferCtx.textAlign = 'end';
      bufferCtx.fillStyle = "#00F";
      bufferCtx.fillText("PLAY TIME:", 380, 400);

      bufferCtx.font = '30px "Arial"';
      bufferCtx.textAlign = 'start';
      bufferCtx.fillStyle = "#00F";
      bufferCtx.fillText(Math.floor(timeCount) + 's', 420, 400);
      break;
  }


  // フリップ
  ctx.drawImage(buffercanvas, 0, 0);
}
