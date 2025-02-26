const fs = require('fs');
const path = require('path');

/**
 * 画像ファイル置き換えスクリプト
 * 使用方法:
 * 1. sourceFolderに元画像のフォルダパスを設定
 * 2. targetFolderはキャラクター画像フォルダ
 * 3. 置き換えたいファイル名の配列を設定
 * 4. node replace-images.js を実行
 */

// 設定
const sourceFolder = 'C:\\Users\\today\\Desktop\\character_images'; // 元画像フォルダ
const targetFolder = path.join(__dirname, '..'); // キャラクター画像フォルダ

// 置き換えたいファイル名の配列（例）
const filesToReplace = [
  'hutao.png',
  'hutao-icon.png',
  // 追加のファイル名をここに列挙
];

// ファイル置き換え処理
filesToReplace.forEach(fileName => {
  const sourcePath = path.join(sourceFolder, fileName);
  const targetPath = path.join(targetFolder, fileName);
  
  // 元ファイルが存在するか確認
  if (!fs.existsSync(sourcePath)) {
    console.error(`元ファイルが見つかりません: ${sourcePath}`);
    return;
  }
  
  try {
    // ファイルをコピー
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`置き換え成功: ${fileName}`);
  } catch (error) {
    console.error(`置き換え失敗: ${fileName}`);
    console.error(error);
  }
});

console.log('画像置き換え処理が完了しました'); 