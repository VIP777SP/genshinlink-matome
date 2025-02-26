// キャラクターガイド情報の型定義
export type UsageSection = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  additionalInfo?: string;
};

export type QAItem = {
  question: string;
  answer: string;
};

export type TipItem = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

export type VideoItem = {
  title: string;
  channelName: string;
  description: string;
  views: string;
  duration: string;
  thumbnailUrl?: string;
};

export type WeaponItem = {
  id: string;
  name: string;
  rarity: number;
  imageUrl: string;
  priority: 'best' | 'good' | 'alternative';
  description: string;
};

export type ArtifactSet = {
  id: string;
  name: string;
  priority: 'best' | 'good' | 'alternative';
  pieces: number[];
  bonus: string[];
  notes: string;
};

export type TeamComp = {
  id: string;
  name: string;
  characters: string[];
  description: string;
};

export type CharacterGuide = {
  usage?: {
    intro?: string;
    sections: UsageSection[];
    comboCycle?: {
      steps: {
        title: string;
        description: string;
      }[];
    };
  };
  qa?: QAItem[];
  tips?: TipItem[];
  recommendedVideos?: VideoItem[];
  weapons?: WeaponItem[];
  artifacts?: ArtifactSet[];
  teams?: TeamComp[];
  constellationRatings?: Record<number, number>;
};

export type CharacterGuides = {
  [characterId: string]: CharacterGuide;
};

// キャラクターガイドデータ
export const characterGuides: Record<string, CharacterGuide> = {
  'raiden-shogun': {
    usage: {
      intro: '雷電将軍は強力なサブアタッカー兼サポートキャラで、チームの元素エネルギー回復を加速させることができます。戦闘の運び方を理解して、効率的にダメージと回復を両立させましょう。',
      sections: [
        {
          id: 'skill',
          title: '元素スキル：神変・悪曜開眼',
          description: '稲光を放ち、近くの敵に雷ダメージを与え、味方に「悪曜の目」効果を付与します。この効果は、味方キャラクターの元素爆発ダメージをアップさせる重要なバフです。',
          imageUrl: '/images/gameplay/raiden-skill.png'
        },
        {
          id: 'eye-effect',
          title: '悪曜の目の効果',
          description: '悪曜の目を持つキャラクターは、元素爆発ダメージがアップします。また、元素爆発を使用すると、雷電将軍の「願力」を獲得できます。',
          imageUrl: '/images/gameplay/raiden-eye-effect.png'
        },
        {
          id: 'resolve',
          title: '願力システム',
          description: 'チームメンバーの元素爆発使用で「願力」を獲得し、最大60スタックまで蓄積できます。スタック数に応じて、雷電将軍の元素爆発ダメージがアップします。',
          imageUrl: '/images/gameplay/raiden-resolve.png'
        },
        {
          id: 'burst',
          title: '元素爆発：奥義・夢想真説',
          description: '強力な斬撃を繰り出し、「太刀抜刀の型」に入ります。この状態では通常攻撃が雷元素ダメージに変換され、攻撃時に敵の元素エネルギーを吸収して味方全員に還元します。',
          imageUrl: '/images/gameplay/raiden-burst.png'
        },
        {
          id: 'energy',
          title: 'エネルギー循環システム',
          description: '元素爆発状態での攻撃はチーム全体にエネルギーを還元します。これにより、味方キャラクターの元素爆発を素早く再使用可能にし、チーム全体の火力を底上げします。',
          imageUrl: '/images/gameplay/raiden-energy.png'
        }
      ],
      comboCycle: {
        steps: [
          {
            title: '元素スキル発動',
            description: '戦闘開始時にまず元素スキルを使用し、チーム全員に「悪曜の目」効果を付与します。'
          },
          {
            title: 'チームメンバーのスキル/爆発',
            description: '他のキャラクターを切り替えて、元素スキルや元素爆発を使用し、ダメージを与えつつ雷電将軍の「願力」を蓄積します。'
          },
          {
            title: '雷電将軍の元素爆発',
            description: '願力が十分に蓄積したら、雷電将軍に切り替えて元素爆発を発動し、強力な一太刀と続く太刀抜刀の型での攻撃で大ダメージを与えます。'
          },
          {
            title: 'エネルギー回復',
            description: '太刀抜刀の型の間、通常攻撃でチーム全体の元素エネルギーを回復させます。'
          },
          {
            title: 'サイクル再開',
            description: '太刀抜刀の型が終了したら、再び他のキャラクターに切り替えてサイクルを繰り返します。'
          }
        ]
      }
    },
    qa: [
      {
        question: '雷電将軍は無凸でも使えますか？',
        answer: '無凸でも十分に使えます。C2は大幅な火力アップですが、無凸でもエネルギー回復サポーターとして優秀です。むしろチームのサポート性能は凸数に関わらず発揮できます。'
      },
      {
        question: '雷電将軍にはどのような武器が適していますか？',
        answer: '専用武器「草薙の稲光」が最適ですが、「薙草」や「喜多院十文字」などの星4武器も実用的です。エネルギー回復や元素チャージ効率がアップする武器が相性が良いです。'
      },
      {
        question: '聖遺物のステータスはどのように優先すべきですか？',
        answer: '砂は「元素チャージ効率%」、杯は「雷元素ダメージ%」、冠は「会心率%/会心ダメージ%」が基本構成です。サブステータスは「元素チャージ効率% → 会心率% → 会心ダメージ% → 攻撃力%」の順で優先しましょう。'
      },
      {
        question: '雷電将軍は誰と相性が良いですか？',
        answer: '高エネルギー消費のキャラクターと特に相性が良いです。「行秋」「香菱」「ベネット」「申鶴」「夜蘭」などと組むと強力なパーティになります。また、雷電国家チーム（雷電将軍+行秋+香菱+ベネット）は特に人気のある編成です。'
      },
      {
        question: 'C2とC3はどのくらい強いですか？',
        answer: 'C2は敵の防御力を約40%無視できるため、ダメージが大幅に上昇します（約40%アップ）。C3は元素爆発のレベルを+3するため、さらにダメージが向上します。どちらも非常に強力な凸効果で、メタでも重視されています。'
      }
    ],
    tips: [
      {
        id: 'cancel',
        title: '元素爆発アニメーションのキャンセル',
        description: '元素爆発発動後、ダッシュでアニメーションの一部をキャンセルすることで、より早く通常攻撃に移行できます。特に複数の敵がいる状況で時間を節約できます。'
      },
      {
        id: 'underwater',
        title: '水中でのエネルギー回復',
        description: '水中でも元素スキル（悪曜の目）効果は発動し続けるため、長時間の水中戦闘や探索でもチームのエネルギー管理がしやすくなります。'
      },
      {
        id: 'bennett',
        title: 'ベネットとの相性',
        description: 'ベネットの元素爆発の攻撃力バフは雷電将軍の元素爆発中にも適用されるため、特に相性が良いです。ベネットの円の中で元素爆発を使うことで、大幅なダメージアップが見込めます。'
      },
      {
        id: 'dendro',
        title: '草元素との反応',
        description: '超開花反応（雷+草）は高倍率のダメージを与えられるため、ナヒーダやティナリといった草元素キャラクターとの相性も良好です。元素熟知を高めることで、この反応のダメージをさらに高められます。'
      }
    ],
    recommendedVideos: [
      {
        title: '【原神】雷電将軍 完全攻略ガイド：運用方法・聖遺物・武器比較',
        channelName: '原神攻略Lab',
        description: '雷電将軍の基本的な使い方から上級テクニックまで解説',
        views: '50万回視聴',
        duration: '15:42'
      },
      {
        title: '【原神】最強雷電将軍の作り方 - 聖遺物厳選のポイント',
        channelName: 'Genshin Guide',
        description: '雷電将軍の聖遺物選びと厳選のコツを詳しく解説',
        views: '32万回視聴',
        duration: '10:15'
      },
      {
        title: '【原神】雷電国家チーム解説 - アビス12層攻略',
        channelName: 'Abyss Masters',
        description: '人気の雷電国家チームでアビスを攻略する方法',
        views: '28万回視聴',
        duration: '13:21'
      },
      {
        title: '【原神】雷電将軍C0とC2の差は？引く価値はあるのか',
        channelName: 'Teyvat Times',
        description: '無凸と2凸の雷電将軍を徹底比較',
        views: '45万回視聴',
        duration: '11:38'
      }
    ],
    weapons: [
      {
        id: 'engulfing-lightning',
        name: '草薙の稲光',
        rarity: 5,
        imageUrl: '/images/weapons/engulfing-lightning.png',
        priority: 'best',
        description: '雷電将軍の専用武器。元素チャージ効率をさらに攻撃力に変換する効果があり、元素爆発のダメージを大幅に向上させます。'
      },
      {
        id: 'the-catch',
        name: '漁獲',
        rarity: 4,
        imageUrl: '/images/weapons/the-catch.png',
        priority: 'good',
        description: '無課金・低課金者向けの最適な武器。元素爆発のダメージと会心率が上昇し、雷電将軍の元素爆発の火力を大きく引き上げます。'
      },
      {
        id: 'wavebreakers-fin',
        name: '断浪長鰭',
        rarity: 4,
        imageUrl: '/images/weapons/wavebreakers-fin.png',
        priority: 'alternative',
        description: 'チーム全体の元素爆発コストに応じて、元素爆発のダメージが上昇します。雷電ナショナルなど元素爆発コストの高いチームと相性が良いです。'
      }
    ],
    artifacts: [
      {
        id: 'emblem-of-severed-fate',
        name: '絶縁の旗印',
        priority: 'best',
        pieces: [4],
        bonus: [
          '元素チャージ効率+20%',
          '元素チャージ効率の25%分、元素爆発のダメージがアップする（最大75%）'
        ],
        notes: '元素チャージ効率が最も重要なステータスです。砂は元素チャージ効率%、杯は雷元素ダメージボーナス%、冠は会心率/会心ダメージを選びましょう。'
      },
      {
        id: 'thundering-fury-noblesse',
        name: '雷のような怒り（2）+ 旧貴族のしつらえ（2）',
        priority: 'good',
        pieces: [2, 2],
        bonus: [
          '雷元素ダメージ+15%',
          '元素爆発のダメージ+20%'
        ],
        notes: '絶縁の旗印がない場合の代替セットです。雷元素ダメージと元素爆発ダメージを両方強化できます。'
      }
    ],
    teams: [
      {
        id: 'national',
        name: '雷電ナショナル',
        characters: ['raiden-shogun', 'xiangling', 'xingqiu', 'bennett'],
        description: '最も人気のある編成の一つ。香菱の炎元素爆発と行秋の水元素攻撃、雷電将軍の雷元素攻撃で複数の元素反応を連鎖的に発生させます。ベネットはチームの攻撃力を上げつつ、香菱のエネルギー回復をサポートします。'
      },
      {
        id: 'hypercarry',
        name: 'ハイパーキャリー雷電',
        characters: ['raiden-shogun', 'sara', 'kazuha', 'bennett'],
        description: '雷電将軍の火力を最大化するための編成。九条裟羅と楓原万葉、ベネットがそれぞれバフとデバフを提供し、雷電将軍の元素爆発ダメージを極限まで高めます。C6の九条裟羅があると特に強力です。'
      }
    ],
    constellationRatings: {
      1: 2,
      2: 5,
      3: 4,
      4: 2,
      5: 2,
      6: 4
    }
  },
  'ganyu': {
    usage: {
      intro: '甘雨は強力な氷元素アタッカーで、主に重撃を中心とした戦術が求められます。遠距離から高い火力を連発できることが特徴です。',
      sections: [
        {
          id: 'charge-attack',
          title: '通常攻撃と重撃：流天射術',
          description: '甘雨の主要なダメージソースは霜華満開（重撃2段）です。照準状態でチャージし、霜華の矢を放つと2段のダメージを与えます。',
          imageUrl: '/images/gameplay/ganyu-charge.png'
        },
        {
          id: 'charge-aoe',
          title: '霜華の矢の範囲ダメージ',
          description: '1段目は単体ダメージ、2段目は命中位置で小範囲の氷元素ダメージを与えます。この範囲ダメージが非常に強力です。',
          imageUrl: '/images/gameplay/ganyu-charge-aoe.png',
          additionalInfo: '霜華満開は非常に高い倍率（Lv.10で約370%）、範囲攻撃で複数敵に同時ダメージ、チャージ中も移動可能、氷元素共鳴との相性が良く会心率が上がりやすいといった特徴があります。'
        },
        {
          id: 'skill',
          title: '元素スキル：山泽麟迹',
          description: '元素スキルを使うと、甘雨は後方に素早く退き、その場に氷蓮を設置します。',
          imageUrl: '/images/gameplay/ganyu-skill.png'
        },
        {
          id: 'skill-taunt',
          title: '氷蓮の挑発効果',
          description: '氷蓮は周囲の敵を挑発し、攻撃されると爆発して氷元素ダメージを与えます。自分が攻撃されるリスクを下げながら、重撃に集中できます。',
          imageUrl: '/images/gameplay/ganyu-skill-taunt.png'
        },
        {
          id: 'burst',
          title: '元素爆発：降衆天華',
          description: '元素爆発を使うと、指定位置に広範囲の氷の結晶が降り注ぐ領域を作り出します。',
          imageUrl: '/images/gameplay/ganyu-burst.png'
        },
        {
          id: 'burst-effect',
          title: '継続的な氷元素ダメージ',
          description: '広範囲に継続的な氷元素ダメージを与え、元素反応を引き起こしやすくなります。C4の場合は敵の氷元素耐性も下げます。',
          imageUrl: '/images/gameplay/ganyu-burst-effect.png'
        }
      ],
      comboCycle: {
        steps: [
          {
            title: '元素スキル使用',
            description: '元素スキルを使って氷蓮を設置し、敵の注意を引く'
          },
          {
            title: '元素爆発展開',
            description: '安全な位置まで後退し、元素爆発で広範囲に継続ダメージを与える'
          },
          {
            title: '重撃連続放射',
            description: '重撃を連続で放ち、高いダメージを与える'
          },
          {
            title: '距離の確保',
            description: '敵が接近してきたら、再度元素スキルで距離を取り、サイクルを繰り返す'
          }
        ]
      }
    },
    qa: [
      {
        question: '甘雨は無凸でも使えますか？',
        answer: 'はい、甘雨は無凸でも非常に強力です。甘雨の最大の武器である「霜華満開」のダメージは凸数に依存しないため、基本性能だけでもトップクラスのDPSを発揮します。C1は使いやすさ、C6は火力が大幅に向上しますが、必須ではありません。'
      },
      {
        question: '甘雨にはどのような武器が適していますか？',
        answer: '最適なのは「天空の翼」や「アモスの弓」などの★5武器です。特に「アモスの弓」は甘雨の重撃と完璧にシナジーし、ダメージが大幅に上昇します。★4武器では「試作澹月」が無課金でも作りやすく、強力な選択肢となります。「黒岩の戦弓」も会心ダメージ副ステータスがあり、優秀な代替武器です。'
      },
      {
        question: '聖遺物のステータスはどのように優先すべきですか？',
        answer: 'メインステータスは「砂=攻撃力%」「杯=氷元素ダメージ%」「冠=会心ダメージ%」が基本です。サブステータスは「会心率% > 会心ダメージ% > 攻撃力% > 元素チャージ効率%」の順で優先しましょう。氷元素共鳴と甘雨の固有天賦により会心率が上がるため、会心ダメージの方が重要になることが多いです。'
      },
      {
        question: '甘雨はどのようなパーティ編成が最適ですか？',
        answer: '甘雨は大きく分けて「溶解パーティ」と「凍結パーティ」の2つの編成で活躍します。溶解パーティでは「ベネット」「香菱」などの炎キャラと組み、重撃のダメージを最大化します。凍結パーティでは「モナ」「ディオナ」「ウェンティ」などと組み、敵を凍結状態に保ちながら安全に攻撃を続けられます。'
      },
      {
        question: '甘雨は操作が難しいと聞きましたが、コツはありますか？',
        answer: '甘雨の操作の難しさは主に照準と移動の両立です。モバイルでは特に難しく感じる場合があります。コツとしては、①敵に近づきすぎない ②元素スキルで距離を作る ③シールドキャラを編成に入れる ④チャージ中も常に移動する、といった点に気をつけましょう。慣れるまでは難しく感じるかもしれませんが、上手く扱えるようになると非常に強力なDPSになります。'
      }
    ],
    tips: [
      {
        id: 'cancel',
        title: '重撃キャンセル術',
        description: '重撃の後、すぐにダッシュすることで、射撃後のモーションをキャンセルできます。これにより、連続で重撃を放つ際のDPSが向上します。特に狭い空間で敵に囲まれている場合に、素早く次の重撃に移行できる重要なテクニックです。'
      },
      {
        id: 'burst-usage',
        title: '元素爆発の使い分け',
        description: '甘雨の元素爆発は、実はサポート用途でも非常に優秀です。特に胡桃やクレーなどの近接アタッカーのサポートとして使用すると、継続的に元素反応を発生させることができます。メインアタッカーとして使う場合は重撃を優先し、サブアタッカーとして使う場合は元素爆発を積極的に活用するという使い分けが効果的です。'
      },
      {
        id: 'freeze',
        title: '凍結反応の最大活用',
        description: '甘雨と水元素キャラを組み合わせることで、敵を凍結状態に保ち続けることができます。これにより、「氷風を彷徨う勇士」4セットの効果で会心率が大幅に上昇します。また、凍結された敵は動きを封じられるため、重撃を当てやすくなります。この戦略は特にアビスなどの難関コンテンツで有効です。'
      },
      {
        id: 'terrain',
        title: '地形を活用した戦闘術',
        description: '甘雨は弓キャラクターなので、高所から攻撃することで敵に攻撃されにくくなります。特に野外での戦闘では、岩や丘の上に登って戦うことで、より安全に戦闘を進められます。また、元素爆発の範囲は地形に合わせて設置されるため、敵の動きを予測して効果的な位置に配置すると良いでしょう。'
      }
    ],
    recommendedVideos: [
      {
        title: '【原神】甘雨 最強アタッカー解説：溶解パーティの組み方',
        channelName: '原神攻略Lab',
        description: '甘雨を中心とした溶解パーティの組み方と運用法',
        views: '76万回視聴',
        duration: '14:23'
      },
      {
        title: '【原神】甘雨 凍結パーティの極意',
        channelName: 'Genshin Guide',
        description: '甘雨凍結パーティのメカニズムと運用戦略',
        views: '58万回視聴',
        duration: '12:45'
      },
      {
        title: '【原神】甘雨の重撃テクニックマスター',
        channelName: 'Genshin Tactics',
        description: '甘雨の重撃を極限まで活用するためのテクニック解説',
        views: '38万回視聴',
        duration: '10:17'
      },
      {
        title: '【原神】アビス12層 甘雨ソロクリア',
        channelName: 'Abyss Masters',
        description: '甘雨一人で深境螺旋をクリアする驚きのプレイ',
        views: '29万回視聴',
        duration: '18:34'
      }
    ],
    weapons: [
      {
        id: 'amos-bow',
        name: 'アモスの弓',
        rarity: 5,
        imageUrl: '/images/weapons/amos-bow.png',
        priority: 'best',
        description: '甘雨の専用武器とも言える性能。通常攻撃と重撃のダメージがアップし、矢が放たれてから命中するまでの時間に応じて更にダメージが上昇します。溶解編成でも凍結編成でも最強の選択肢です。'
      },
      {
        id: 'polar-star',
        name: '極星',
        rarity: 5,
        imageUrl: '/images/weapons/polar-star.png',
        priority: 'good',
        description: '会心率のサブステータスと、スキル使用時のダメージボーナスが優秀です。特に凍結編成で会心率が重要な場合に輝きます。'
      },
      {
        id: 'prototype-crescent',
        name: '試作澹月',
        rarity: 4,
        imageUrl: '/images/weapons/prototype-crescent.png',
        priority: 'alternative',
        description: '無課金・低課金者向けの最適な武器。弱点（頭部など）への命中で攻撃力が大幅に上昇します。精錬を重ねるほど効果が高まります。'
      }
    ],
    artifacts: [
      {
        id: 'blizzard-strayer',
        name: '氷風を彷徨う勇士',
        priority: 'best',
        pieces: [4],
        bonus: [
          '氷元素ダメージ+15%',
          '氷元素の影響を受けた敵への会心率+20%、凍結状態の敵への会心率+20%'
        ],
        notes: '凍結パーティーで使用する場合の最適セット。会心率が最大40%上昇するため、会心ダメージに特化した聖遺物を選ぶと良いでしょう。'
      },
      {
        id: 'wanderers-troupe',
        name: '大地を流浪する楽団',
        priority: 'good',
        pieces: [4],
        bonus: [
          '元素熟知+80',
          '重撃のダメージ+35%'
        ],
        notes: '溶解パーティーで使用する場合の最適セット。重撃ダメージが大幅に上昇し、元素熟知も強化されるため溶解反応の威力も高まります。'
      }
    ],
    teams: [
      {
        id: 'morgana',
        name: 'モルガナ（凍結パーティー）',
        characters: ['ganyu', 'mona', 'venti', 'diona'],
        description: '最強の凍結パーティー。モナの水元素適用とウェンティの集敵で広範囲の敵を凍結状態にし、甘雨の範囲ダメージを最大化します。ディオナはシールド、回復、氷元素共鳴のために採用されています。'
      },
      {
        id: 'melt',
        name: '溶解パーティー',
        characters: ['ganyu', 'xiangling', 'bennett', 'zhongli'],
        description: '単体火力特化の編成。香菱の炎元素適用と甘雨の重撃を組み合わせて溶解反応（1.5倍ダメージ）を発生させます。鍾離のシールドで中断されないように保護し、ベネットは攻撃力バフと回復、そして香菱のエネルギー回復をサポートします。'
      }
    ],
    constellationRatings: {
      1: 3,
      2: 2,
      3: 3,
      4: 2,
      5: 3,
      6: 4
    }
  }
}; 
