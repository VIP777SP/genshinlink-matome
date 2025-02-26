const fs = require('fs');
const path = require('path');

// 武器IDのリスト（src/app/tiermaker/page.tsxから抽出）
const weaponIds = [
  'mistsplitter',
  'homa',
  'thundering-pulse',
  'wolf-gravestone',
  'lost-prayer',
  'engulfing-lightning',
  'aqua-simulacra',
  'jade-cutter',
  'skyward-harp',
  'redhorn-stonethresher',
  'skyward-blade',
  'skyward-spine',
  'skyward-pride',
  'skyward-atlas',
  'primordial-jade-winged-spear',
  'amos-bow',
  'polar-star',
  'memory-of-dust',
  'unforged',
  'freedom-sworn',
  'widsith',
  'rust',
  'sacrificial-sword',
  'dragon-bane',
  'serpent-spine',
  'favonius-lance',
  'favonius-sword',
  'favonius-greatsword',
  'favonius-warbow',
  'favonius-codex',
  'lions-roar',
  'rainslasher',
  'stringless',
  'eye-of-perception',
  'sacrificial-greatsword',
  'sacrificial-bow',
  'sacrificial-fragments',
  'deathmatch',
  'black-sword',
  'royal-greatsword',
  'alley-hunter',
  'blackcliff-amulet',
  'prototype-crescent',
  'white-tassel',
  'thrilling-tales-of-dragon-slayers',
  'harbinger-of-dawn',
  'slingshot',
  'debate-club',
  'black-tassel',
  'magic-guide',
  'cool-steel',
  'raven-bow',
  'bloodtainted-greatsword'
];

// プレースホルダアイコンを作成する関数
function createWeaponPlaceholders() {
  const weaponsDir = path.join(__dirname, '..');
  
  // 各武器IDに対してプレースホルダファイルを作成
  weaponIds.forEach(weaponId => {
    const iconFileName = `${weaponId}-icon.png`;
    const iconFilePath = path.join(weaponsDir, iconFileName);
    
    // アンダースコアバージョンのパスも作成してチェック（既存の古いファイル形式）
    const oldStyleFileName = iconFileName.replace(/-/g, '_');
    const oldStyleFilePath = path.join(weaponsDir, oldStyleFileName);
    
    // ファイルが存在しない場合のみ作成（どちらの形式でも存在しないことを確認）
    if (!fs.existsSync(iconFilePath) && !fs.existsSync(oldStyleFilePath)) {
      console.log(`プレースホルダファイルを作成: ${iconFileName}`);
      
      // プレースホルダファイルを作成
      fs.writeFileSync(iconFilePath, ''); // 空のファイルを作成
    } else {
      if (fs.existsSync(oldStyleFilePath)) {
        console.log(`スキップ: ${oldStyleFileName} (古い形式で既に存在します)`);
      } else {
        console.log(`スキップ: ${iconFileName} (既に存在します)`);
      }
    }
  });
  
  console.log('武器アイコンのプレースホルダ作成が完了しました！');
}

// スクリプト実行
createWeaponPlaceholders(); 
