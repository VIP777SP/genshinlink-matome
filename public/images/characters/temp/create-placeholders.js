const fs = require('fs');
const path = require('path');

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

// 各キャラクターのプレースホルダー作成
characters.forEach(({ id, name, element }) => {
  const { fill, stroke } = elementColors[element] || elementColors['pyro']; // デフォルトは炎元素

  // アイコン用プレースホルダー作成
  const iconSvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" rx="128" fill="${fill}" fill-opacity="0.6"/>
  <path d="M128 76C142.366 76 154 65.9116 154 53.5C154 41.0884 142.366 31 128 31C113.634 31 102 41.0884 102 53.5C102 65.9116 113.634 76 128 76Z" fill="${fill}"/>
  <path d="M128 76C142.366 76 154 65.9116 154 53.5C154 41.0884 142.366 31 128 31C113.634 31 102 41.0884 102 53.5C102 65.9116 113.634 76 128 76Z" stroke="${stroke}" stroke-width="2"/>
  <path d="M102 128C102 102.595 113.222 76 128 76C142.778 76 154 102.595 154 128C154 153.405 142.778 180 128 180C113.222 180 102 153.405 102 128Z" fill="${fill}"/>
  <path d="M102 128C102 102.595 113.222 76 128 76C142.778 76 154 102.595 154 128C154 153.405 142.778 180 128 180C113.222 180 102 153.405 102 128Z" stroke="${stroke}" stroke-width="2"/>
  <path d="M88 170C88 152.327 106.118 138 128.5 138C150.882 138 169 152.327 169 170C169 187.673 150.882 202 128.5 202C106.118 202 88 187.673 88 170Z" fill="${fill}"/>
  <path d="M88 170C88 152.327 106.118 138 128.5 138C150.882 138 169 152.327 169 170C169 187.673 150.882 202 128.5 202C106.118 202 88 187.673 88 170Z" stroke="${stroke}" stroke-width="2"/>
  <path d="M128 225L152 180H104L128 225Z" fill="${fill}"/>
  <path d="M128 225L152 180H104L128 225Z" stroke="${stroke}" stroke-width="2"/>
  <circle cx="128" cy="128" r="96" stroke="${stroke}" stroke-width="4" stroke-dasharray="8 8"/>
  <text x="128" y="240" text-anchor="middle" font-family="Arial" font-size="14" fill="${stroke}">${name}</text>
</svg>`;

  // フルイメージ用プレースホルダー作成
  const fullSvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="500" height="800" viewBox="0 0 500 800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="800" fill="${fill}" fill-opacity="0.4"/>
  
  <!-- 背景のデザイン要素 -->
  <rect x="50" y="50" width="400" height="700" rx="20" stroke="${stroke}" stroke-width="4" stroke-dasharray="15 10" fill="none"/>
  <circle cx="250" cy="200" r="150" fill="${fill}" fill-opacity="0.6" stroke="${stroke}" stroke-width="3"/>
  
  <!-- キャラクターのシルエット表現 -->
  <path d="M250 200C277.614 200 300 177.614 300 150C300 122.386 277.614 100 250 100C222.386 100 200 122.386 200 150C200 177.614 222.386 200 250 200Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  <path d="M200 350C200 294.772 220.147 250 250 250C279.853 250 300 294.772 300 350C300 405.228 279.853 450 250 450C220.147 450 200 405.228 200 350Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  <path d="M180 550C180 494.772 211.34 450 250 450C288.66 450 320 494.772 320 550C320 605.228 288.66 650 250 650C211.34 650 180 605.228 180 550Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
  
  <!-- 元素シンボル表現 -->
  <circle cx="250" cy="350" r="30" fill="white" fill-opacity="0.7" stroke="${stroke}" stroke-width="2"/>
  <text x="250" y="355" text-anchor="middle" font-family="Arial" font-size="18" fill="${stroke}" font-weight="bold">${element}</text>
  
  <!-- テキスト情報 -->
  <text x="250" y="710" text-anchor="middle" font-family="Arial" font-size="32" fill="${stroke}" font-weight="bold">${name}</text>
  <text x="250" y="750" text-anchor="middle" font-family="Arial" font-size="24" fill="${stroke}">プレースホルダー</text>
  <text x="250" y="780" text-anchor="middle" font-family="Arial" font-size="16" fill="${stroke}" opacity="0.8">画像準備中</text>
</svg>`;

  try {
    // ファイル保存
    fs.writeFileSync(path.join(outputDir, `${id}-icon.svg`), iconSvg);
    fs.writeFileSync(path.join(outputDir, `${id}.svg`), fullSvg);
    console.log(`Created placeholders for ${name} (${id})`);
  } catch (err) {
    console.error(`Error creating placeholders for ${id}:`, err);
  }
});

console.log('全てのプレースホルダが作成されました'); 