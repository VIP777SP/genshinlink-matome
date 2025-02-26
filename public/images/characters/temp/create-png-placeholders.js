const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// 元素カラーの設定
const elementColors = {
  'pyro': { fill: '#F87B6E', stroke: '#C0412F' },     // 炎元素のカラー
  'hydro': { fill: '#4EB1E9', stroke: '#1D6EB5' },    // 水元素のカラー
  'anemo': { fill: '#7ED4BE', stroke: '#3B9A86' },    // 風元素のカラー
  'electro': { fill: '#A88BDB', stroke: '#6E44BB' },  // 雷元素のカラー
  'dendro': { fill: '#A7C64E', stroke: '#618E26' },   // 草元素のカラー
  'cryo': { fill: '#9FD6E2', stroke: '#5BA2C3' },     // 氷元素のカラー
  'geo': { fill: '#F3BD61', stroke: '#C28C31' }       // 岩元素のカラー
};

// キャラクターリスト
const characters = [
  { id: 'raiden-shogun', name: '雷電将軍', element: 'electro' },
  { id: 'kazuha', name: '楓原万葉', element: 'anemo' },
  { id: 'nahida', name: 'ナヒーダ', element: 'dendro' },
  { id: 'bennett', name: 'ベネット', element: 'pyro' },
  { id: 'xingqiu', name: '行秋', element: 'hydro' },
  { id: 'zhongli', name: '鍾離', element: 'geo' },
  { id: 'ganyu', name: '甘雨', element: 'cryo' },
  { id: 'xiangling', name: '香菱', element: 'pyro' },
  { id: 'hutao', name: '胡桃', element: 'pyro' },
  { id: 'ayaka', name: '神里綾華', element: 'cryo' },
  { id: 'xiao', name: '魈', element: 'anemo' },
  { id: 'eula', name: 'エウルア', element: 'cryo' },
  { id: 'venti', name: 'ウェンティ', element: 'anemo' },
  { id: 'yelan', name: '夜蘭', element: 'hydro' },
  { id: 'shenhe', name: '申鶴', element: 'cryo' },
  { id: 'albedo', name: 'アルベド', element: 'geo' },
  { id: 'itto', name: '荒瀧一斗', element: 'geo' },
  { id: 'yoimiya', name: '宵宮', element: 'pyro' },
  { id: 'kokomi', name: '珊瑚宮心海', element: 'hydro' },
  { id: 'mona', name: 'モナ', element: 'hydro' },
  { id: 'keqing', name: '刻晴', element: 'electro' },
  { id: 'diluc', name: 'ディルック', element: 'pyro' },
  { id: 'jean', name: 'ジン', element: 'anemo' },
  { id: 'fischl', name: 'フィッシュル', element: 'electro' },
  { id: 'ningguang', name: '凝光', element: 'geo' },
  { id: 'beidou', name: '北斗', element: 'electro' },
  { id: 'chongyun', name: '重雲', element: 'cryo' },
  { id: 'noelle', name: 'ノエル', element: 'geo' },
  { id: 'razor', name: 'レザー', element: 'electro' },
  { id: 'kuki', name: '久岐忍', element: 'electro' },
  { id: 'collei', name: 'コレイ', element: 'dendro' },
  { id: 'dori', name: 'ドリー', element: 'electro' },
  { id: 'gorou', name: 'ゴロー', element: 'geo' },
  { id: 'sayu', name: '早柚', element: 'anemo' },
  { id: 'klee', name: 'クレー', element: 'pyro' },
  { id: 'sara', name: '九条裟羅', element: 'electro' },
  { id: 'heizou', name: '鹿野院平蔵', element: 'anemo' },
  { id: 'thoma', name: 'トーマ', element: 'pyro' },
  { id: 'yunjin', name: '雲菫', element: 'geo' },
  { id: 'yanfei', name: '煙緋', element: 'pyro' },
  { id: 'faruzan', name: 'ファルザン', element: 'anemo' },
  { id: 'cyno', name: 'セノ', element: 'electro' },
  { id: 'kaveh', name: 'カーヴェ', element: 'dendro' },
  { id: 'layla', name: 'レイラ', element: 'cryo' },
  { id: 'candace', name: 'キャンディス', element: 'hydro' },
  { id: 'tighnari', name: 'ティナリ', element: 'dendro' },
  { id: 'mika', name: 'ミカ', element: 'cryo' },
  { id: 'qiqi', name: '七七', element: 'cryo' },
  { id: 'dehya', name: 'ディシア', element: 'pyro' },
  { id: 'nilou', name: 'ニィロウ', element: 'hydro' },
  { id: 'wanderer', name: '放浪者', element: 'anemo' },
  { id: 'alhaitham', name: 'アルハイゼン', element: 'dendro' },
  { id: 'freminet', name: 'フレミネ', element: 'cryo' },
  { id: 'lynette', name: 'リネット', element: 'anemo' },
  { id: 'lyney', name: 'リネ', element: 'pyro' },
  { id: 'kirara', name: '綺良々', element: 'dendro' },
  { id: 'baizhu', name: '白朮', element: 'dendro' },
  { id: 'yaoyao', name: 'ヨォーヨ', element: 'dendro' },
  { id: 'furina', name: 'フリーナ', element: 'hydro' },
  { id: 'wriothesley', name: 'ライオットスレイ', element: 'cryo' },
  { id: 'neuvillette', name: 'ヌヴィレット', element: 'hydro' },
  { id: 'charlotte', name: 'シャルロット', element: 'cryo' },
  { id: 'chevreuse', name: 'シュヴルーズ', element: 'pyro' },
  { id: 'navia', name: 'ナヴィア', element: 'geo' },
  { id: 'chiori', name: '千織', element: 'geo' },
  { id: 'clorinde', name: 'クロリンデ', element: 'electro' },
  { id: 'gaming', name: 'ゲーミング', element: 'pyro' }
];

// 出力ディレクトリ
const outputDir = path.join(__dirname, '..');

// ディレクトリが存在するか確認し、なければ作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// キャラクターアイコン用のプレースホルダー作成
function createIconPlaceholder(id, name, element) {
  const { fill, stroke } = elementColors[element] || elementColors['pyro']; // デフォルトは炎元素
  
  // キャンバス作成
  const width = 256;
  const height = 256;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // 背景を描画
  ctx.fillStyle = fill;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;
  
  // 輪郭 (点線の円)
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.arc(width/2, height/2, 96, 0, Math.PI * 2);
  ctx.stroke();
  
  // キャラクターシルエット（頭部）
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(128, 53.5, 26, 22.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.stroke();
  
  // キャラクターシルエット（胴体）
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(128, 128, 26, 52, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // キャラクターシルエット（下部）
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(128.5, 170, 40.5, 32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // キャラクターシルエット（裾）
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(128, 225);
  ctx.lineTo(152, 180);
  ctx.lineTo(104, 180);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // テキスト（キャラクター名）
  ctx.fillStyle = stroke;
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, width/2, 240);
  
  // PNGとして保存
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, `${id}-icon.png`), buffer);
}

// キャラクター全身画像用のプレースホルダー作成
function createFullPlaceholder(id, name, element) {
  const { fill, stroke } = elementColors[element] || elementColors['pyro']; // デフォルトは炎元素
  
  // キャンバス作成
  const width = 500;
  const height = 800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // 背景を描画
  ctx.fillStyle = fill;
  ctx.globalAlpha = 0.4;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1.0;
  
  // 外枠を描画
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 4;
  ctx.setLineDash([15, 10]);
  ctx.strokeRect(50, 50, 400, 700);
  ctx.setLineDash([]);
  
  // 丸い背景
  ctx.fillStyle = fill;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.arc(250, 200, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // キャラクターシルエット（頭部）
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(250, 150, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // キャラクターシルエット（胴体）
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(250, 350, 50, 100, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // キャラクターシルエット（下部）
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(250, 550, 70, 100, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 元素シンボルの円
  ctx.fillStyle = 'white';
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.arc(250, 350, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 元素タイプのテキスト
  ctx.fillStyle = stroke;
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(element, 250, 350);
  
  // キャラクター名のテキスト
  ctx.fillStyle = stroke;
  ctx.font = 'bold 32px Arial';
  ctx.fillText(name, 250, 710);
  
  // プレースホルダーのテキスト
  ctx.font = '24px Arial';
  ctx.fillText('プレースホルダー', 250, 750);
  
  // 画像準備中のテキスト
  ctx.globalAlpha = 0.8;
  ctx.font = '16px Arial';
  ctx.fillText('画像準備中', 250, 780);
  ctx.globalAlpha = 1.0;
  
  // PNGとして保存
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, `${id}.png`), buffer);
}

// 各キャラクターのプレースホルダー画像を作成
characters.forEach(({ id, name, element }) => {
  try {
    createIconPlaceholder(id, name, element);
    createFullPlaceholder(id, name, element);
    console.log(`Created PNG placeholders for ${name} (${id})`);
  } catch (err) {
    console.error(`Error creating placeholders for ${id}:`, err);
  }
});

console.log('全てのPNGプレースホルダが作成されました'); 