const fs = require('fs');
const path = require('path');

// 武器IDのリスト（src/app/tiermaker/page.tsxから抽出）
const weaponIds = [
  'mistsplitter',
  'homa',
  'thundering_pulse',
  'wolf_gravestone',
  'lost_prayer',
  'engulfing_lightning',
  'aqua_simulacra',
  'jade_cutter',
  'skyward_harp',
  'redhorn_stonethresher',
  'widsith',
  'rust',
  'sacrificial_sword',
  'dragon_bane',
  'serpent_spine',
  'favonius_lance',
  'favonius_sword',
  'favonius_greatsword',
  'favonius_warbow',
  'favonius_codex'
];

// プレースホルダアイコンを作成する関数
function createWeaponPlaceholders() {
  const weaponsDir = path.join(__dirname, '..');
  
  // 各武器IDに対してプレースホルダファイルを作成
  weaponIds.forEach(weaponId => {
    const iconFileName = `${weaponId}-icon.png`;
    const iconFilePath = path.join(weaponsDir, iconFileName);
    
    // ファイルが存在しない場合のみ作成
    if (!fs.existsSync(iconFilePath)) {
      console.log(`プレースホルダファイルを作成: ${iconFileName}`);
      
      // このコードはプレースホルダのディレクトリ構造だけを作成します
      // 実際の画像ファイルは作成しません
      fs.writeFileSync(iconFilePath, ''); // 空のファイルを作成
    } else {
      console.log(`スキップ: ${iconFileName} (既に存在します)`);
    }
  });
  
  console.log('武器アイコンのプレースホルダ作成が完了しました！');
}

// スクリプト実行
createWeaponPlaceholders(); 