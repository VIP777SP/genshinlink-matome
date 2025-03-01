// 属性・武器・レアリティ・役割の型定義
export type ElementType = 'pyro' | 'hydro' | 'anemo' | 'electro' | 'dendro' | 'cryo' | 'geo';
export type WeaponType = 'sword' | 'claymore' | 'polearm' | 'bow' | 'catalyst';
export type RarityType = 4 | 5;
export type RoleType = 'attacker' | 'supporter';

// キャラクター型
export type Character = {
  id: string;
  name: string;
  element: ElementType;
  weapon: WeaponType;
  rarity: RarityType;
  iconUrl: string; // アイコン用小さい画像
  fullImageUrl: string; // 詳細表示用大きい画像
  role: RoleType;
};

// 元素カラーのマッピング
export const elementColors: Record<ElementType, { bg: string; text: string; darkBg: string; darkText: string }> = {
  anemo: { bg: 'bg-teal-100', text: 'text-teal-800', darkBg: 'dark:bg-teal-900', darkText: 'dark:text-teal-200' },
  geo: { bg: 'bg-yellow-100', text: 'text-yellow-800', darkBg: 'dark:bg-yellow-900', darkText: 'dark:text-yellow-200' },
  electro: { bg: 'bg-purple-100', text: 'text-purple-800', darkBg: 'dark:bg-purple-900', darkText: 'dark:text-purple-200' },
  dendro: { bg: 'bg-green-100', text: 'text-green-800', darkBg: 'dark:bg-green-900', darkText: 'dark:text-green-200' },
  hydro: { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900', darkText: 'dark:text-blue-200' },
  pyro: { bg: 'bg-red-100', text: 'text-red-800', darkBg: 'dark:bg-red-900', darkText: 'dark:text-red-200' },
  cryo: { bg: 'bg-cyan-100', text: 'text-cyan-800', darkBg: 'dark:bg-cyan-900', darkText: 'dark:text-cyan-200' }
};

// 武器アイコンのマッピング
export const weaponIcons: Record<WeaponType, string> = {
  sword: 'fa-sword',
  claymore: 'fa-axe-battle',
  polearm: 'fa-khanda',
  bow: 'fa-bow-arrow',
  catalyst: 'fa-book-sparkles'
};

// 画像パス生成ヘルパー関数
export const getCharacterIconUrl = (characterId: string): string => {
  return `/images/characters/${characterId}-icon.png`;
};

export const getCharacterFullImageUrl = (characterId: string): string => {
  return `/images/characters/${characterId}.png`;
};

// キャラクターデータ
export const characters: Character[] = [
  {
    id: 'raiden-shogun',
    name: '雷電将軍',
    element: 'electro',
    weapon: 'polearm',
    rarity: 5,
    iconUrl: '/images/characters/raiden-shogun-icon.png',
    fullImageUrl: '/images/characters/raiden-shogun.png',
    role: 'supporter'
  },
  {
    id: 'kazuha',
    name: '楓原万葉',
    element: 'anemo',
    weapon: 'sword',
    rarity: 5,
    iconUrl: '/images/characters/kazuha-icon.png',
    fullImageUrl: '/images/characters/kazuha.png',
    role: 'supporter'
  },
  {
    id: 'nahida',
    name: 'ナヒーダ',
    element: 'dendro',
    weapon: 'catalyst',
    rarity: 5,
    iconUrl: '/images/characters/nahida-icon.png',
    fullImageUrl: '/images/characters/nahida.png',
    role: 'supporter'
  },
  {
    id: 'bennett',
    name: 'ベネット',
    element: 'pyro',
    weapon: 'sword',
    rarity: 4,
    iconUrl: '/images/characters/bennett-icon.png',
    fullImageUrl: '/images/characters/bennett.png',
    role: 'supporter'
  },
  {
    id: 'diluc',
    name: 'ディルック',
    element: 'pyro',
    weapon: 'claymore',
    rarity: 5,
    iconUrl: '/images/characters/diluc-icon.png',
    fullImageUrl: '/images/characters/diluc.png',
    role: 'attacker'
  },
  {
    id: 'xingqiu',
    name: '行秋',
    element: 'hydro',
    weapon: 'sword',
    rarity: 4,
    iconUrl: '/images/characters/xingqiu-icon.png',
    fullImageUrl: '/images/characters/xingqiu.png',
    role: 'supporter'
  },
  {
    id: 'zhongli',
    name: '鍾離',
    element: 'geo',
    weapon: 'polearm',
    rarity: 5,
    iconUrl: '/images/characters/zhongli-icon.png',
    fullImageUrl: '/images/characters/zhongli.png',
    role: 'supporter'
  },
  {
    id: 'ganyu',
    name: '甘雨',
    element: 'cryo',
    weapon: 'bow',
    rarity: 5,
    iconUrl: '/images/characters/ganyu-icon.png',
    fullImageUrl: '/images/characters/ganyu.png',
    role: 'attacker'
  },
  {
    id: 'xiangling',
    name: '香菱',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 4,
    iconUrl: '/images/characters/xiangling-icon.png',
    fullImageUrl: '/images/characters/xiangling.png',
    role: 'attacker'
  },
  {
    id: 'hutao',
    name: '胡桃',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 5,
    iconUrl: '/images/characters/hutao-icon.png',
    fullImageUrl: '/images/characters/hutao.png',
    role: 'attacker'
  },
  {
    id: 'ayaka',
    name: '神里綾華',
    element: 'cryo',
    weapon: 'sword',
    rarity: 5,
    iconUrl: '/images/characters/ayaka-icon.png',
    fullImageUrl: '/images/characters/ayaka.png',
    role: 'attacker'
  },
  {
    id: 'arlecchino',
    name: 'アルレッキーノ ',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 5,
    iconUrl: '/images/characters/arlecchino-icon.png',
    fullImageUrl: '/images/characters/arlecchino.png',
    role: 'attacker'
  },
  {
    id: 'mavuika',
    name: 'マーヴィカ',
    element: 'pyro',
    weapon: 'claymore',
    rarity: 5,  
    iconUrl: '/images/characters/mavuika-icon.png',
    fullImageUrl: '/images/characters/mavuika.png',
    role: 'attacker'
  },
  {
    id: 'yelan',
    name: '夜蘭',
    element: 'hydro',
    weapon: 'bow',
    rarity: 5,
    iconUrl: '/images/characters/yelan-icon.png',
    fullImageUrl: '/images/characters/yelan.png',
    role: 'supporter'
  },
  {
    id: 'ayato',
    name: '綾人 ',
    element: 'hydro',
    weapon: 'sword',
    rarity: 5,
    iconUrl: '/images/characters/ayato-icon.png',
    fullImageUrl: '/images/characters/ayato.png',
    role: 'attacker'
  },
  {
    id: 'candace',
    name: 'キャンディス',
    element: 'hydro',
    weapon: 'catalyst',
    rarity: 4,
    iconUrl: '/images/characters/candace-icon.png',
    fullImageUrl: '/images/characters/candace.png',
    role: 'supporter'
  },
  {
    id: 'mona',
    name: 'モナ',
    element: 'hydro',
    weapon: 'catalyst',
    rarity: 5,
    iconUrl: '/images/characters/mona-icon.png',
    fullImageUrl: '/images/characters/mona.png',
    role: 'supporter'
  },
  {
    id: 'sigewinne',
    name: 'シグウィン',
    element: 'hydro',
    weapon: 'bow',
    rarity: 5,
    iconUrl: '/images/characters/sigewinne-icon.png',
    fullImageUrl: '/images/characters/sigewinne.png',
    role: 'supporter'
  },
  {
    id: 'mualani',
    name: 'ムアラニ',
    element: 'dendro',
    weapon: 'catalyst',
    rarity: 5,
    iconUrl: '/images/characters/mualani-icon.png',
    fullImageUrl: '/images/characters/mualani.png',
    role: 'attacker'
  },
  {
    id: 'furina',
    name: 'フリーナ',
    element: 'hydro',
    weapon: 'sword',
    rarity: 5,
    iconUrl: '/images/characters/furina-icon.png',
    fullImageUrl: '/images/characters/furina.png',
    role: 'supporter'
  },
  {
    id: 'neuvillette',
    name: 'ヌヴィレット',
    element: 'hydro',
    weapon: 'catalyst',
    rarity: 5,
    iconUrl: '/images/characters/neuvillette-icon.png',
    fullImageUrl: '/images/characters/neuvillette.png',
    role: 'attacker'
  },
  {
    id: 'yoimiya',
    name: '宵宮',
    element: 'pyro',
    weapon: 'bow',
    rarity: 5,
    iconUrl: '/images/characters/yoimiya-icon.png',
    fullImageUrl: '/images/characters/yoimiya.png',
    role: 'attacker'
  },
  {
    id: 'kokomi',
    name: '珊瑚宮心海',
    element: 'hydro',
    weapon: 'catalyst',
    rarity: 5,
    iconUrl: '/images/characters/kokomi-icon.png',
    fullImageUrl: '/images/characters/kokomi.png',
    role: 'supporter'
  },
  {
    id: 'alhaitham',
    name: 'アルハイゼン',
    element: 'dendro',
    weapon: 'sword',
    rarity: 5,
    iconUrl: '/images/characters/alhaitham-icon.png',
    fullImageUrl: '/images/characters/alhaitham.png',
    role: 'attacker'
  },
  {
    id: 'yae',
    name: '八重神子',
    element: 'electro',
    weapon: 'catalyst',
    rarity: 5,
    iconUrl: '/images/characters/yae-icon.png',
    fullImageUrl: '/images/characters/yae.png',
    role: 'attacker'
  },
  {
    id: 'cyno',
    name: 'セノ',
    element: 'electro',
    weapon: 'polearm',
    rarity: 5,
    iconUrl: '/images/characters/cyno-icon.png',
    fullImageUrl: '/images/characters/cyno.png',
    role: 'attacker'
  },
  {
    id: 'wanderer',
    name: '放浪者',
    element: 'anemo',
    weapon: 'catalyst',
    rarity: 5,
    iconUrl: '/images/characters/wanderer-icon.png',
    fullImageUrl: '/images/characters/wanderer.png',
    role: 'attacker'
  },
  {
    id: 'baizhu',
    name: '白朮',
    element: 'dendro',
    weapon: 'catalyst',
    rarity: 5,
    iconUrl: '/images/characters/baizhu-icon.png',
    fullImageUrl: '/images/characters/baizhu.png',
    role: 'supporter'
  },
  {
    id: 'dehya',
    name: 'ディシア',
    element: 'pyro',
    weapon: 'claymore',
    rarity: 5,
    iconUrl: '/images/characters/dehya-icon.png',
    fullImageUrl: '/images/characters/dehya.png',
    role: 'attacker'
  },
  {
    id: 'eula',
    name: 'エウルア',
    element: 'cryo',
    weapon: 'claymore',
    rarity: 5,
    iconUrl: '/images/characters/eula-icon.png',
    fullImageUrl: '/images/characters/eula.png',
    role: 'attacker'
  },
  {
    id: 'citlali',
    name: 'シトラリ',
    element: 'cryo',
    weapon: 'catalyst',
    rarity: 5,
    iconUrl: '/images/characters/citlali-icon.png',
    fullImageUrl: '/images/characters/citlali.png',
    role: 'supporter'
  },
  {
    id: 'shenhe',
    name: '申鶴',
    element: 'cryo',
    weapon: 'polearm',
    rarity: 5,
    iconUrl: '/images/characters/shenhe-icon.png',
    fullImageUrl: '/images/characters/shenhe.png',
    role: 'supporter'
  },
  {
    id: 'diona',
    name: 'ディオナ',
    element: 'cryo',
    weapon: 'bow',
    rarity: 4,
    iconUrl: '/images/characters/diona-icon.png',
    fullImageUrl: '/images/characters/diona.png',
    role: 'supporter'
  },
  {
    id: 'qiqi',
    name: '七七',
    element: 'cryo',
    weapon: 'sword',
    rarity: 5,
    iconUrl: '/images/characters/qiqi-icon.png',
    fullImageUrl: '/images/characters/qiqi.png',
    role: 'supporter'
  },
  {
    id: 'aloy',
    name: 'アーロイ',
    element: 'cryo',
    weapon: 'bow',
    rarity: 5,
    iconUrl: '/images/characters/aloy-icon.png',
    fullImageUrl: '/images/characters/aloy.png',
    role: 'attacker'
  },
  {
    id: 'xiao',
    name: '魈',
    element: 'anemo',
    weapon: 'polearm',
    rarity: 5,
    iconUrl: '/images/characters/xiao-icon.png',
    fullImageUrl: '/images/characters/xiao.png',
    role: 'attacker'
  },
  {
    id: 'itto',
    name: '荒瀧一斗',
    element: 'geo',
    weapon: 'claymore',
    rarity: 5,
    iconUrl: '/images/characters/itto-icon.png',
    fullImageUrl: '/images/characters/itto.png',
    role: 'attacker'
  },
  {
    id: 'fischl',
    name: 'フィッシュル',
    element: 'electro',
    weapon: 'bow',
    rarity: 4,
    iconUrl: '/images/characters/fischl-icon.png',
    fullImageUrl: '/images/characters/fischl.png',
    role: 'supporter'
  },
  {
    id: 'sucrose',
    name: 'スクロース',
    element: 'anemo',
    weapon: 'catalyst',
    rarity: 4,
    iconUrl: '/images/characters/sucrose-icon.png',
    fullImageUrl: '/images/characters/sucrose.png',
    role: 'supporter'
  },
  {
    id: 'yaoyao',
    name: 'ヨォーヨ',
    element: 'dendro',
    weapon: 'polearm',
    rarity: 4,
    iconUrl: '/images/characters/yaoyao-icon.png',
    fullImageUrl: '/images/characters/yaoyao.png',
    role: 'supporter'
  },
  {
    id: 'kaveh',
    name: 'カーヴェ',
    element: 'dendro',
    weapon: 'claymore',
    rarity: 4,
    iconUrl: '/images/characters/kaveh-icon.png',
    fullImageUrl: '/images/characters/kaveh.png',
    role: 'attacker'
  },
  {
    id: 'kirara',
    name: 'キララ',
    element: 'dendro',
    weapon: 'sword',
    rarity: 4,
    iconUrl: '/images/characters/kirara-icon.png',
    fullImageUrl: '/images/characters/kirara.png',
    role: 'supporter'
  },
  {
    id: 'kuki-shinobu',
    name: '久岐忍',
    element: 'electro',
    weapon: 'sword',
    rarity: 4,
    iconUrl: '/images/characters/kuki-shinobu-icon.png',
    fullImageUrl: '/images/characters/kuki-shinobu.png',
    role: 'supporter'
  },
  {
    id: 'dori',
    name: 'ドリー',
    element: 'electro',
    weapon: 'claymore',
    rarity: 4,
    iconUrl: '/images/characters/dori-icon.png',
    fullImageUrl: '/images/characters/dori.png',
    role: 'supporter'
  },
  {
    id: 'collei',
    name: 'コレイ',
    element: 'dendro',
    weapon: 'bow',
    rarity: 4,
    iconUrl: '/images/characters/collei-icon.png',
    fullImageUrl: '/images/characters/collei.png',
    role: 'supporter'
  },
  {
    id: 'thoma',
    name: 'トーマ',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 4,
    iconUrl: '/images/characters/thoma-icon.png',
    fullImageUrl: '/images/characters/thoma.png',
    role: 'supporter'
  },
  {
    id: 'sayu',
    name: '早柚',
    element: 'anemo',
    weapon: 'claymore',
    rarity: 4,
    iconUrl: '/images/characters/sayu-icon.png',
    fullImageUrl: '/images/characters/sayu.png',
    role: 'supporter'
  },
  {
    id: 'nilou',
    name: 'ニィロウ',
    element: 'hydro',
    weapon: 'sword',
    rarity: 5,
    iconUrl: '/images/characters/nilou-icon.png',
    fullImageUrl: '/images/characters/nilou.png',
    role: 'attacker'
  },
  {
    id: 'lyney',
    name: 'リネ',
    element: 'pyro',
    weapon: 'bow',
    rarity: 5,
    iconUrl: '/images/characters/lyney-icon.png',
    fullImageUrl: '/images/characters/lyney.png',
    role: 'attacker'
  },
  {
    id: 'lynette',
    name: 'リネット',
    element: 'anemo',
    weapon: 'sword',
    rarity: 4,
    iconUrl: '/images/characters/lynette-icon.png',
    fullImageUrl: '/images/characters/lynette.png',
    role: 'supporter'
  },
  {
    id: 'freminet',
    name: 'フレミネ',
    element: 'cryo',
    weapon: 'claymore',
    rarity: 4,
    iconUrl: '/images/characters/freminet-icon.png',
    fullImageUrl: '/images/characters/freminet.png',
    role: 'attacker'
  },
  {
    id: 'wriothesley',
    name: 'リオセスリ',
    element: 'cryo',
    weapon: 'catalyst',
    rarity: 5,
    iconUrl: '/images/characters/wriothesley-icon.png',
    fullImageUrl: '/images/characters/wriothesley.png',
    role: 'attacker'
  },
  {
    id: 'charlotte',
    name: 'シャルロット',
    element: 'cryo',
    weapon: 'catalyst',
    rarity: 4,
    iconUrl: '/images/characters/charlotte-icon.png',
    fullImageUrl: '/images/characters/charlotte.png',
    role: 'supporter'
  },
  {
    id: 'navia',
    name: 'ナヴィア',
    element: 'geo',
    weapon: 'claymore',
    rarity: 5,
    iconUrl: '/images/characters/navia-icon.png',
    fullImageUrl: '/images/characters/navia.png',
    role: 'attacker'
  },
  {
    id: 'chevreuse',
    name: 'シュヴルーズ',
    element: 'pyro',
    weapon: 'polearm',
    rarity: 4,
    iconUrl: '/images/characters/chevreuse-icon.png',
    fullImageUrl: '/images/characters/chevreuse.png',
    role: 'supporter'
  },
  {
    id: 'gaming',
    name: 'ゲーミング',
    element: 'pyro',
    weapon: 'claymore',
    rarity: 4,
    iconUrl: '/images/characters/gaming-icon.png',
    fullImageUrl: '/images/characters/gaming.png',
    role: 'attacker'
  },
  {
    id: 'xianyun',
    name: '閑雲',
    element: 'anemo',
    weapon: 'catalyst',
    rarity: 5,
    iconUrl: '/images/characters/xianyun-icon.png',
    fullImageUrl: '/images/characters/xianyun.png',
    role: 'supporter'
  },
  {
    id: 'chiori',
    name: '千織',
    element: 'geo',
    weapon: 'sword',
    rarity: 5,
    iconUrl: '/images/characters/chiori-icon.png',
    fullImageUrl: '/images/characters/chiori.png',
    role: 'attacker'
  },
  {
    id: 'amber',
    name: 'アンバー',
    element: 'pyro',
    weapon: 'bow',
    rarity: 4,
    iconUrl: '/images/characters/amber-icon.png',
    fullImageUrl: '/images/characters/amber.png',
    role: 'attacker'
  },
  {
    id: 'kaeya',
    name: 'ガイア',
    element: 'cryo',
    weapon: 'sword',
    rarity: 4,
    iconUrl: '/images/characters/kaeya-icon.png',
    fullImageUrl: '/images/characters/kaeya.png',
    role: 'supporter'
  },
  {
    id: 'lisa',
    name: 'リサ',
    element: 'electro',
    weapon: 'catalyst',
    rarity: 4,
    iconUrl: '/images/characters/lisa-icon.png',
    fullImageUrl: '/images/characters/lisa.png',
    role: 'supporter'
  },
  {
    id: 'noelle',
    name: 'ノエル',
    element: 'geo',
    weapon: 'claymore',
    rarity: 4,
    iconUrl: '/images/characters/noelle-icon.png',
    fullImageUrl: '/images/characters/noelle.png',
    role: 'attacker'
  },
  {
    id: 'barbara',
    name: 'バーバラ',
    element: 'hydro',
    weapon: 'catalyst',
    rarity: 4,
    iconUrl: '/images/characters/barbara-icon.png',
    fullImageUrl: '/images/characters/barbara.png',
    role: 'supporter'
  },
  {
    id: 'razor',
    name: 'レザー',
    element: 'electro',
    weapon: 'claymore',
    rarity: 4,
    iconUrl: '/images/characters/razor-icon.png',
    fullImageUrl: '/images/characters/razor.png',
    role: 'attacker'
  },
  {
    id: 'rosaria',
    name: 'ロサリア',
    element: 'cryo',
    weapon: 'polearm',
    rarity: 4,
    iconUrl: '/images/characters/rosaria-icon.png',
    fullImageUrl: '/images/characters/rosaria.png',
    role: 'supporter'
  },
  {
    id: 'mika',
    name: 'ミカ',
    element: 'cryo',
    weapon: 'polearm',
    rarity: 4,
    iconUrl: '/images/characters/mika-icon.png',
    fullImageUrl: '/images/characters/mika.png',
    role: 'supporter'
  },
  {
    id: 'beidou',
    name: '北斗',
    element: 'electro',
    weapon: 'claymore',
    rarity: 4,
    iconUrl: '/images/characters/beidou-icon.png',
    fullImageUrl: '/images/characters/beidou.png',
    role: 'supporter'
  },
  {
    id: 'ningguang',
    name: '凝光',
    element: 'geo',
    weapon: 'catalyst',
    rarity: 4,
    iconUrl: '/images/characters/ningguang-icon.png',
    fullImageUrl: '/images/characters/ningguang.png',
    role: 'attacker'
  },
  {
    id: 'chongyun',
    name: '重雲',
    element: 'cryo',
    weapon: 'claymore',
    rarity: 4,
    iconUrl: '/images/characters/chongyun-icon.png',
    fullImageUrl: '/images/characters/chongyun.png',
    role: 'supporter'
  },
  {
    id: 'xinyan',
    name: '辛炎',
    element: 'pyro',
    weapon: 'claymore',
    rarity: 4,
    iconUrl: '/images/characters/xinyan-icon.png',
    fullImageUrl: '/images/characters/xinyan.png',
    role: 'attacker'
  },
  {
    id: 'yunjin',
    name: '雲菫',
    element: 'geo',
    weapon: 'polearm',
    rarity: 4,
    iconUrl: '/images/characters/yunjin-icon.png',
    fullImageUrl: '/images/characters/yunjin.png',
    role: 'supporter'
  },
  {
    id: 'yanfei',
    name: '煙緋',
    element: 'pyro',
    weapon: 'catalyst',
    rarity: 4,
    iconUrl: '/images/characters/yanfei-icon.png',
    fullImageUrl: '/images/characters/yanfei.png',
    role: 'attacker'
  },
  {
    id: 'chasca',
    name: 'チャスカ',
    element: 'pyro',
    weapon: 'bow',
    rarity: 5,
    iconUrl: '/images/characters/chasca-icon.png',
    fullImageUrl: '/images/characters/chasca.png',
    role: 'attacker'
  },
  {
    id: 'clorinde',
    name: 'クロリンデ',
    element: 'electro',
    weapon: 'sword',
    rarity: 5,
    iconUrl: '/images/characters/clorinde-icon.png',
    fullImageUrl: '/images/characters/clorinde.png',
    role: 'attacker'
  },
  {
    id: 'emilie',
    name: 'エミリエ',
    element: 'dendro',
    weapon: 'polearm',
    rarity: 5,
    iconUrl: '/images/characters/emilie-icon.png',
    fullImageUrl: '/images/characters/emilie.png',
    role: 'supporter'
  },
  {
    id: 'faruzan',
    name: 'ファルザン',
    element: 'anemo',
    weapon: 'bow',
    rarity: 4,
    iconUrl: '/images/characters/faruzan-icon.png',
    fullImageUrl: '/images/characters/faruzan.png',
    role: 'supporter'
  },
  {
    id: 'gorou',
    name: 'ゴロー',
    element: 'geo',
    weapon: 'bow',
    rarity: 4,
    iconUrl: '/images/characters/gorou-icon.png',
    fullImageUrl: '/images/characters/gorou.png',
    role: 'supporter'
  },
  {
    id: 'heizou',
    name: '平蔵',
    element: 'anemo',
    weapon: 'catalyst',
    rarity: 4,
    iconUrl: '/images/characters/heizou-icon.png',
    fullImageUrl: '/images/characters/heizou.png',
    role: 'attacker'
  },
  {
    id: 'jean',
    name: 'ジン',
    element: 'anemo',
    weapon: 'sword',
    rarity: 5,
    iconUrl: '/images/characters/jean-icon.png',
    fullImageUrl: '/images/characters/jean.png',
    role: 'supporter'
  },
  {
    id: 'kachina',
    name: 'カチーナ',
    element: 'geo',
    weapon: 'polearm',
    rarity: 4,
    iconUrl: '/images/characters/kachina-icon.png',
    fullImageUrl: '/images/characters/kachina.png',
    role: 'supporter'
  },
  {
    id: 'kinichi',
    name: 'キィニチ',
    element: 'dendro',
    weapon: 'claymore',
    rarity: 5,
    iconUrl: '/images/characters/kinichi-icon.png',
    fullImageUrl: '/images/characters/kinichi.png',
    role: 'attacker'
  },
  {
    id: 'lanyan',
    name: '藍硯',
    element: 'anemo',
    weapon: 'catalyst',
    rarity: 4,
    iconUrl: '/images/characters/lanyan-icon.png',
    fullImageUrl: '/images/characters/lanyan.png',
    role: 'supporter'
  },
  {
    id: 'layla',
    name: 'レイラ',
    element: 'cryo',
    weapon: 'sword',
    rarity: 4,
    iconUrl: '/images/characters/layla-icon.png',
    fullImageUrl: '/images/characters/layla.png',
    role: 'supporter'
  },
  {
    id: 'mizuki',
    name: 'ミズキ',
    element: 'electro',
    weapon: 'catalyst',
    rarity: 5,
    iconUrl: '/images/characters/mizuki-icon.png',
    fullImageUrl: '/images/characters/mizuki.png',
    role: 'supporter'
  },
  {
    id: 'olorun',
    name: 'オロルン',
    element: 'electro',
    weapon: 'bow',
    rarity: 4,
    iconUrl: '/images/characters/olorun-icon.png',
    fullImageUrl: '/images/characters/olorun.png',
    role: 'supporter'
  },
  {
    id: 'sara',
    name: 'サラ',
    element: 'electro',
    weapon: 'bow',
    rarity: 4,
    iconUrl: '/images/characters/sara-icon.png',
    fullImageUrl: '/images/characters/sara.png',
    role: 'supporter'
  },
  {
    id: 'setos',
    name: 'セトス',
    element: 'electro',
    weapon: 'bow',
    rarity: 4,
    iconUrl: '/images/characters/setos-icon.png',
    fullImageUrl: '/images/characters/setos.png',
    role: 'attacker'
  },
  
  {
    id: 'tartaglia',
    name: 'タルタリヤ',
    element: 'hydro',
    weapon: 'bow',
    rarity: 5,
    iconUrl: '/images/characters/tartaglia-icon.png',
    fullImageUrl: '/images/characters/tartaglia.png',
    role: 'attacker'
  },
  {
    id: 'tighnari',
    name: 'ティナリ',
    element: 'dendro',
    weapon: 'bow',
    rarity: 5,
    iconUrl: '/images/characters/tighnari-icon.png',
    fullImageUrl: '/images/characters/tighnari.png',
    role: 'attacker'
  },
  {
    id: 'venti',
    name: 'ウェンティ',
    element: 'anemo',
    weapon: 'bow',
    rarity: 5,
    iconUrl: '/images/characters/venti-icon.png',
    fullImageUrl: '/images/characters/venti.png',
    role: 'supporter'
  },
  {
    id: 'xilonen',
    name: 'シロネン',
    element: 'geo',
    weapon: 'sword',
    rarity: 5,
    iconUrl: '/images/characters/xilonen-icon.png',
    fullImageUrl: '/images/characters/xilonen.png',
    role: 'attacker'
  }
];

// IDからキャラクターを取得する便利関数
export function getCharacterById(id: string): Character | undefined {
  return characters.find(character => character.id === id);
} 
