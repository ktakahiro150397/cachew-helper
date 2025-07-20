const income = ["給料振込", "普通預金利息", "振込　", "利息"];

const insurance = [
  "プルデンシャル生命保険",
  "PGBSﾌﾟﾙﾃﾞﾝｼﾔﾙ",
  "トウキヨウカイジヨウニチドウカサイホ",
  "ﾄｳｷﾖｳｶｲｼﾞﾖｳﾆﾁﾄ",
  "ＪＡＦ会費",
];

const investment = ["ＳＢＩ証券投信積立サービス", "DF.ｳｴﾙｽﾅﾋﾞ"];

// 投機
const spelulation = [
  "EZASIA ", // Vantage FX
];

const tax = ["PE ﾋﾖｳｺﾞｹﾝｱｶｼｼ", "PE ﾆｼﾉﾐﾔｼｹｲｼﾞﾄﾞｳｼﾔｾﾞｲ", "地方税", "国税"];

const sending = [
  "パソコン振込 ",
  "ﾍﾟｲﾍﾟｲ",
  "りぼん",
  "振込手数料",
  "パソコン振替",
  "普通　円　アルストロメリア",
  "振込＊",
  "ことら送金",
  "ＳＢＩハイブリッド預金",
  "SMBC(ｽﾐｼﾝSBIﾈﾂ",
];

const receiving = ["CT "];

const loan = ["ﾐﾂｲｽﾐﾄﾓC(ｾﾝﾄﾗﾙF", "ﾆﾎﾝｶﾞｸｾｲｼｴﾝｷｺｳ", "ｼﾞﾔﾂｸｽ"];

const subscription = [
  "ＧＯＯＧＬＥ　ＰＬＡＹ　ＪＡＰＡＮ",
  "ＧＯＯＧＬＥ  ＰＬＡＹ  ＪＡＰＡＮ",
  "ＧＯＯＧＬＥ　ＹＯＵＴＵＢＥＰＲＥＭＩＵ",
  "ＰＡＹＰＡＬ　＊ＧＯＯＧＬＥ　ＹＯＵＴＵ",
  "ＡＰＰＬＥ　ＣＯＭ　ＢＩＬＬ",
  "Ａｍａｚｏｎプライム会費",
  "GITHUB, INC. (GITHUB.COM )",
  "ユーネクストサービス利用料",
  "振込＊カ）サカグチモータース",
  "振込＊ド）　キンリヨウ",
];

const transport = [
  "モバイルＩＣＯＣＡ",
  "ＥＴＣ",
  "神戸公社　ＥＴＣ",
  "カンサイマースケイハンバスコウツウ",
  "ＪＲ西日本",
];

// 食費・日用品
const foodAndDailyNecessities = [
  "マルハチ",
  "イオン　マツクスバリユ",
  "ダイコクドラッグ",
  "ダイソー",
  "スギ薬局",
  "ウエルシア",
  "イズミヤ",
  "万代",
  "金引青果",
  "西松屋チェーン",
  "オカノヤツキヨク",
  "１３３１マツモトキヨシアスピア明石",
  "ピオレ",
  "サンドラッグ",
  "ゴダイドラッグ",
  "三杉屋",
];

// コンビニ
const convenienceStore = [
  "セブン−イレブン",
  "セブンイレブン",
  "ローソン",
  "ロ—ソン",
  "ファミリーマート",
  "フアミリ—マ—ト",
  "ミニストップ",
  "デイリーヤマザキ",
];

// 外食
const diningOut = [
  "マクドナルド",
  "すき家",
  "吉野家",
  "ラー麺ずんどう屋",
  "コメダ珈琲店",
  "デリカフェ・キッチン",
  "来来亭",
  "ドトールコーヒー",
  "ＫＯＨＹＯ　淀屋橋",
  "スシロー",
  "かっぱ寿司",
  "ちゃんぽん亭総本家",
  "バーガーキング",
  "松のや",
  "まるせん",
  "モスのネット注文",
  "ニューミュンヘン",
  "丸源ラーメン",
  "大津サービスエリア下り線",
  "小谷ＳＡ上り",
  "福山ＳＡ下り",
  "珈琲館",
  "一風堂",
  "ｉＤ／神戸源氏",
  "上島珈琲店",
  "ふく流らーめん",
  "スターバックス",
];

// 買い物
const shopping = [
  "マルチメディア",
  "ヨドバシカメラ",
  "神戸ハーバーランド　ｕｍｉｅ",
  "ＡＭＡＺＯＮ　ＷＥＢ　ＳＥＲＶＩＣＥＳ",
  "ＡＭＡＺＯＮ  ＷＥＢ  ＳＥＲＶＩＣＥＳ",
  "ＡＭＡＺＯＮ．ＣＯ．ＪＰ",
  "Ｊｏｓｈｉｎ",
  "上新電機",
  "スポ−ツ　デポ",
  "自販機",
  "日本コンラックス　自動販売機",
  "飲料自販機",
  "アスピア明石",
  "トーヨーベンディング株式会社",
  "ココカラファイン",
  "GPﾏ-ｹﾃｲﾝｸﾞ",
  "ＤＣＭ",
  "ジュンク堂書店",
  "神戸三田プレミアム・アウトレット",
  "モンベル",
  "オートバックス",
  "マツヤデンキ明石店",
  "ニトリ",
  "神戸阪急",
  "阪急三番街",
  "阪急百貨店",
  "イオン　ＲＯＵ神戸ハーバーランド",
  "ＢＯＯＫＯＦＦ",
  "希望軒",
  "シャトレ−ゼ",
];

// ガソリン
const gas = ["ＥＮＥＯＳ", "イデミツ"];

// 娯楽
const entertainment = [
  "ＯＳシネマズ",
  "ＴＯＨＯシネマズ",
  "ＥＸＰＯ２０２５",
  "OPENAI",
  "STEAMGAMES.COM",
  "STEAM PURCHASE",
  "ＳＴＥＡＭＧＡＭＥＳ．ＣＯＭ",
  "アソビストア",
  "ＡＦ明石駅前",
  "オナマエドツトコムドメイン",
  "ＧＯＯＧＬＥ＊ＣＬＯＵＤ",
  "ＡＳＯＢＩ　ＴＩＣＫＥＴ",
  "福井和泉スキー場",
  "ＤＭＭ",
  "ＰＡＹＰＡＬ　＊ＫＩＮＧＵＩＮＤＩＧＩ",
  "ＰＬＡＹＳＴＡＴＩＯＮ　ＮＥＴＷＯＲ",
  "２りんかんイエローハット",
  "フモツフノオミセ",
];

// 資格
const qualification = ["ＣＢＴＳ受験申込サイト", "ＴＯＥＩＣ　Ｌ＆Ｒ"];

// 医療費
const medical = ["医療法人朋愛会", "大阪医療センター"];

/**
 * Cashew出力データの摘要から、カテゴリ名を取得します。
 * @param sourceData
 */
export function getCategoryFromCashewData(description: string): string {
  if (income.some((prefix) => description.startsWith(prefix))) {
    return "所得";
  }

  if (insurance.some((prefix) => description.startsWith(prefix))) {
    return "保険";
  }

  if (tax.some((prefix) => description.startsWith(prefix))) {
    return "税金";
  }

  if (subscription.some((prefix) => description.startsWith(prefix))) {
    return "サブスクリプション";
  }

  if (sending.some((prefix) => description.startsWith(prefix))) {
    return "送金";
  }

  if (receiving.some((prefix) => description.startsWith(prefix))) {
    return "受取";
  }

  if (investment.some((prefix) => description.startsWith(prefix))) {
    return "投資";
  }

  if (loan.some((prefix) => description.startsWith(prefix))) {
    return "ローン";
  }

  if (transport.some((prefix) => description.startsWith(prefix))) {
    return "交通費";
  }

  if (
    foodAndDailyNecessities.some((prefix) => description.startsWith(prefix))
  ) {
    return "食費・日用品";
  }

  if (convenienceStore.some((prefix) => description.startsWith(prefix))) {
    return "コンビニ";
  }

  if (diningOut.some((prefix) => description.startsWith(prefix))) {
    return "外食";
  }

  if (shopping.some((prefix) => description.startsWith(prefix))) {
    return "買い物";
  }

  if (entertainment.some((prefix) => description.startsWith(prefix))) {
    return "娯楽";
  }

  if (gas.some((prefix) => description.startsWith(prefix))) {
    return "ガソリン";
  }

  if (spelulation.some((prefix) => description.startsWith(prefix))) {
    return "投機";
  }

  if (qualification.some((prefix) => description.startsWith(prefix))) {
    return "資格";
  }

  if (medical.some((prefix) => description.startsWith(prefix))) {
    return "医療費";
  }

  // 上記のどれにも該当しない場合は「未分類」として返す
  return "【未分類】";
}
