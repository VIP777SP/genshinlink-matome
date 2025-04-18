#!/bin/bash

# 元素カラーの設定
declare -A element_colors
element_colors["pyro"]="#F87B6E,#C0412F"     # 炎元素のカラー
element_colors["hydro"]="#4EB1E9,#1D6EB5"    # 水元素のカラー
element_colors["anemo"]="#7ED4BE,#3B9A86"    # 風元素のカラー
element_colors["electro"]="#A88BDB,#6E44BB"  # 雷元素のカラー
element_colors["dendro"]="#A7C64E,#618E26"   # 草元素のカラー
element_colors["cryo"]="#9FD6E2,#5BA2C3"     # 氷元素のカラー
element_colors["geo"]="#F3BD61,#C28C31"      # 岩元素のカラー

# キャラクターリスト
characters=(
    "raiden-shogun,雷電将軍,electro"
    "kazuha,楓原万葉,anemo"
    "nahida,ナヒーダ,dendro"
    "bennett,ベネット,pyro"
    "xingqiu,行秋,hydro"
    "zhongli,鍾離,geo"
    "ganyu,甘雨,cryo"
    "xiangling,香菱,pyro"
    "hutao,胡桃,pyro"
    "ayaka,神里綾華,cryo"
    "xiao,魈,anemo"
    "eula,エウルア,cryo"
    "venti,ウェンティ,anemo"
    "yelan,夜蘭,hydro"
    "shenhe,申鶴,cryo"
    "albedo,アルベド,geo"
    "itto,荒瀧一斗,geo"
    "yoimiya,宵宮,pyro"
    "kokomi,珊瑚宮心海,hydro"
    "mona,モナ,hydro"
    "keqing,刻晴,electro"
    "diluc,ディルック,pyro"
    "jean,ジン,anemo"
    "fischl,フィッシュル,electro"
    "ningguang,凝光,geo"
    "beidou,北斗,electro"
    "chongyun,重雲,cryo"
    "noelle,ノエル,geo"
    "razor,レザー,electro"
    "kuki,久岐忍,electro"
    "collei,コレイ,dendro"
    "dori,ドリー,electro"
    "gorou,ゴロー,geo"
    "sayu,早柚,anemo"
    "klee,クレー,pyro"
    "sara,九条裟羅,electro"
    "heizou,鹿野院平蔵,anemo"
    "thoma,トーマ,pyro"
    "yunjin,雲菫,geo"
    "yanfei,煙緋,pyro"
    "faruzan,ファルザン,anemo"
    "cyno,セノ,electro"
    "kaveh,カーヴェ,dendro"
    "layla,レイラ,cryo"
    "candace,キャンディス,hydro"
    "tighnari,ティナリ,dendro"
    "mika,ミカ,cryo"
    "qiqi,七七,cryo"
    "dehya,ディシア,pyro"
    "nilou,ニィロウ,hydro"
    "wanderer,放浪者,anemo"
    "alhaitham,アルハイゼン,dendro"
    "freminet,フレミネ,cryo"
    "lynette,リネット,anemo"
    "lyney,リネ,pyro"
    "kirara,綺良々,dendro"
    "baizhu,白朮,dendro"
    "yaoyao,ヨォーヨ,dendro"
    "furina,フリーナ,hydro"
    "wriothesley,ライオットスレイ,cryo"
    "neuvillette,ヌヴィレット,hydro"
    "charlotte,シャルロット,cryo"
    "chevreuse,シュヴルーズ,pyro"
    "navia,ナヴィア,geo"
    "chiori,千織,geo"
    "clorinde,クロリンデ,electro"
    "gaming,ゲーミング,pyro"
)

for character in "${characters[@]}"; do
    IFS=',' read -r id name element <<< "$character"
    colors="${element_colors[$element]}"
    IFS=',' read -r fill_color stroke_color <<< "$colors"
    
    # アイコン用プレースホルダー作成
    cat > "${id}-icon.svg" << EOF
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" rx="128" fill="${fill_color}" fill-opacity="0.6"/>
  <path d="M128 76C142.366 76 154 65.9116 154 53.5C154 41.0884 142.366 31 128 31C113.634 31 102 41.0884 102 53.5C102 65.9116 113.634 76 128 76Z" fill="${fill_color}"/>
  <path d="M128 76C142.366 76 154 65.9116 154 53.5C154 41.0884 142.366 31 128 31C113.634 31 102 41.0884 102 53.5C102 65.9116 113.634 76 128 76Z" stroke="${stroke_color}" stroke-width="2"/>
  <path d="M102 128C102 102.595 113.222 76 128 76C142.778 76 154 102.595 154 128C154 153.405 142.778 180 128 180C113.222 180 102 153.405 102 128Z" fill="${fill_color}"/>
  <path d="M102 128C102 102.595 113.222 76 128 76C142.778 76 154 102.595 154 128C154 153.405 142.778 180 128 180C113.222 180 102 153.405 102 128Z" stroke="${stroke_color}" stroke-width="2"/>
  <path d="M88 170C88 152.327 106.118 138 128.5 138C150.882 138 169 152.327 169 170C169 187.673 150.882 202 128.5 202C106.118 202 88 187.673 88 170Z" fill="${fill_color}"/>
  <path d="M88 170C88 152.327 106.118 138 128.5 138C150.882 138 169 152.327 169 170C169 187.673 150.882 202 128.5 202C106.118 202 88 187.673 88 170Z" stroke="${stroke_color}" stroke-width="2"/>
  <path d="M128 225L152 180H104L128 225Z" fill="${fill_color}"/>
  <path d="M128 225L152 180H104L128 225Z" stroke="${stroke_color}" stroke-width="2"/>
  <circle cx="128" cy="128" r="96" stroke="${stroke_color}" stroke-width="4" stroke-dasharray="8 8"/>
  <text x="128" y="240" text-anchor="middle" font-family="Arial" font-size="14" fill="${stroke_color}">${name}</text>
</svg>
EOF

    # キャラクター画像用プレースホルダー作成
    cat > "${id}.svg" << EOF
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="500" height="800" viewBox="0 0 500 800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="800" fill="${fill_color}" fill-opacity="0.4"/>
  
  <!-- 背景のデザイン要素 -->
  <rect x="50" y="50" width="400" height="700" rx="20" stroke="${stroke_color}" stroke-width="4" stroke-dasharray="15 10" fill="none"/>
  <circle cx="250" cy="200" r="150" fill="${fill_color}" fill-opacity="0.6" stroke="${stroke_color}" stroke-width="3"/>
  
  <!-- キャラクターのシルエット表現 -->
  <path d="M250 200C277.614 200 300 177.614 300 150C300 122.386 277.614 100 250 100C222.386 100 200 122.386 200 150C200 177.614 222.386 200 250 200Z" fill="${fill_color}" stroke="${stroke_color}" stroke-width="2"/>
  <path d="M200 350C200 294.772 220.147 250 250 250C279.853 250 300 294.772 300 350C300 405.228 279.853 450 250 450C220.147 450 200 405.228 200 350Z" fill="${fill_color}" stroke="${stroke_color}" stroke-width="2"/>
  <path d="M180 550C180 494.772 211.34 450 250 450C288.66 450 320 494.772 320 550C320 605.228 288.66 650 250 650C211.34 650 180 605.228 180 550Z" fill="${fill_color}" stroke="${stroke_color}" stroke-width="2"/>
  
  <!-- 元素シンボル表現 -->
  <circle cx="250" cy="350" r="30" fill="white" fill-opacity="0.7" stroke="${stroke_color}" stroke-width="2"/>
  <text x="250" y="355" text-anchor="middle" font-family="Arial" font-size="18" fill="${stroke_color}" font-weight="bold">${element}</text>
  
  <!-- テキスト情報 -->
  <text x="250" y="710" text-anchor="middle" font-family="Arial" font-size="32" fill="${stroke_color}" font-weight="bold">${name}</text>
  <text x="250" y="750" text-anchor="middle" font-family="Arial" font-size="24" fill="${stroke_color}">プレースホルダー</text>
  <text x="250" y="780" text-anchor="middle" font-family="Arial" font-size="16" fill="${stroke_color}" opacity="0.8">画像準備中</text>
</svg>
EOF

    echo "Created placeholders for ${name} (${id})"
done

echo "全てのプレースホルダが作成されました" 