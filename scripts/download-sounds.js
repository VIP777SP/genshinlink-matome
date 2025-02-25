/**
 * 音声ファイルダウンロードスクリプト
 * 
 * このスクリプトは、必要な音声ファイルをダウンロードして
 * public/soundsディレクトリに保存します。
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ダウンロード先ディレクトリ
const DOWNLOAD_DIR = path.join(__dirname, '../public/sounds');

// ダウンロードする音声ファイルのリスト
// フリー素材サイトからの音声効果をURLで指定
// 注意: 実際の使用時には、適切なライセンスを持つ音声ファイルを使用してください
const SOUND_FILES = [
  {
    name: 'hover.mp3',
    url: 'https://example.com/hover.mp3', // 実際のURLに置き換えてください
  },
  {
    name: 'click.mp3',
    url: 'https://example.com/click.mp3', // 実際のURLに置き換えてください
  },
  {
    name: 'typing.mp3',
    url: 'https://example.com/typing.mp3', // 実際のURLに置き換えてください
  },
  {
    name: 'favorite-add.mp3',
    url: 'https://example.com/favorite-add.mp3', // 実際のURLに置き換えてください
  },
  {
    name: 'favorite-remove.mp3',
    url: 'https://example.com/favorite-remove.mp3', // 実際のURLに置き換えてください
  },
  {
    name: 'theme-toggle.mp3',
    url: 'https://example.com/theme-toggle.mp3', // 実際のURLに置き換えてください
  },
];

// ディレクトリがなければ作成
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
  console.log(`ディレクトリを作成しました: ${DOWNLOAD_DIR}`);
}

// ファイルをダウンロード
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
        console.log(`ダウンロード完了: ${dest}`);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // 不完全なファイルを削除
      reject(err);
      console.error(`ダウンロード失敗: ${url}`, err);
    });
  });
}

// すべてのファイルをダウンロード
async function downloadAllFiles() {
  console.log('音声ファイルのダウンロードを開始します...');
  
  for (const file of SOUND_FILES) {
    const destPath = path.join(DOWNLOAD_DIR, file.name);
    
    try {
      await downloadFile(file.url, destPath);
    } catch (error) {
      console.error(`${file.name} のダウンロードに失敗しました:`, error);
    }
  }
  
  console.log('すべてのファイルのダウンロードが完了しました！');
}

// スクリプトを実行
downloadAllFiles().catch(console.error); 