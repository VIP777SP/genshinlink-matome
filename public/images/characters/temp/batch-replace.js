const fs = require('fs');
const path = require('path');

/**
 * 画像ファイル一括置き換えスクリプト
 * 元のフォルダにある画像をすべて、同じファイル名で置き換えます
 */

// 設定
const sourceFolder = 'C:\\Users\\today\\Desktop\\character_images'; // 元画像フォルダ
const targetFolder = path.join(__dirname, '..'); // キャラクター画像フォルダ

// フォルダが存在するか確認
if (!fs.existsSync(sourceFolder)) {
  console.error(`元フォルダが見つかりません: ${sourceFolder}`);
  process.exit(1);
}

// 元フォルダからファイル一覧を取得
let files;
try {
  files = fs.readdirSync(sourceFolder);
} catch (error) {
  console.error('ファイル一覧取得エラー:', error);
  process.exit(1);
}

// PNG画像のみフィルタ
const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));
console.log(`${pngFiles.length}個のPNG画像が見つかりました`);

// 置き換え処理
let successCount = 0;
let errorCount = 0;

pngFiles.forEach(fileName => {
  const sourcePath = path.join(sourceFolder, fileName);
  const targetPath = path.join(targetFolder, fileName);
  
  try {
    // ファイルをコピー
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`置き換え成功: ${fileName}`);
    successCount++;
  } catch (error) {
    console.error(`置き換え失敗: ${fileName}`);
    console.error(error);
    errorCount++;
  }
});

console.log('画像置き換え処理が完了しました');
console.log(`成功: ${successCount}件, 失敗: ${errorCount}件`);

// 変更をGitに追加するかどうかを提案
console.log('変更をGitに追加するには、以下のコマンドを実行してください:');
console.log('git add public/images/characters/*.png');
console.log('git commit -m "キャラクター画像を更新"'); 