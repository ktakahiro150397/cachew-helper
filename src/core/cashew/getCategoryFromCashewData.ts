const income = [
  "給料振込",
  "普通預金利息",
  "振込　",
]

const lifeInsurance = [
  "プルデンシャル生命保険",
]

const investment = [
  "ＳＢＩ証券投信積立サービス",
]

const tax = [
  "PE ﾋﾖｳｺﾞｹﾝｱｶｼｼ",
]

const sending = [
  "パソコン振込 "
]

const receiving = [
  "CT ",
]

const loan = [
  "ﾐﾂｲｽﾐﾄﾓC(ｾﾝﾄﾗﾙF",
  "ﾆﾎﾝｶﾞｸｾｲｼｴﾝｷｺｳ",
]

const subscription = [
  "ＧＯＯＧＬＥ　ＰＬＡＹ　ＪＡＰＡＮ",
  "ＡＰＰＬＥ　ＣＯＭ　ＢＩＬＬ",
  "GITHUB, INC. (GITHUB.COM )",
]

const transport = [
  "モバイルＩＣＯＣＡ",
  "ＥＴＣ　関西支社",
]

// 食費・日用品
const foodAndDailyNecessities = [
  "マルハチ",
  "イオン　マツクスバリユ",
  "ダイコクドラッグ",
  "ダイソー",
  "スギ薬局",
  "ウエルシア",
  "ピオレ明石",
  "イズミヤ",
]

// コンビニ
const convenienceStore = [
  "セブン−イレブン",
  "セブンイレブン",
  "ローソン",
  "ロ—ソン",
  "ファミリーマート",
  "フアミリ—マ—ト",
  "ミニストップ",
]

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
]

// 買い物
const shopping = [
  "マルチメディア",
  "ヨドバシカメラ",
  "神戸ハーバーランド　ｕｍｉｅ",
  "ＡＭＡＺＯＮ　ＷＥＢ　ＳＥＲＶＩＣＥＳ",
]

// 娯楽
const entertainment = [
  "ＯＳシネマズ",
  "ＥＸＰＯ２０２５",
]

/**
 * Cashew出力データの摘要から、カテゴリ名を取得します。
 * @param sourceData
 */
export function getCategoryFromCashewData(description: string): string {
  if (income.some(prefix => description.startsWith(prefix))) {
    return "所得";
  }

  if (lifeInsurance.some(prefix => description.startsWith(prefix))) {
    return "生命保険";
  }

  if (tax.some(prefix => description.startsWith(prefix))) {
    return "税金";
  }

  if (sending.some(prefix => description.startsWith(prefix))) {
    return "送金";
  }

  if (receiving.some(prefix => description.startsWith(prefix))) {
    return "受取";
  }

  if (investment.some(prefix => description.startsWith(prefix))) {
    return "投資";
  }

  if (loan.some(prefix => description.startsWith(prefix))) {
    return "ローン";
  }

  if (subscription.some(prefix => description.startsWith(prefix))) {
    return "サブスクリプション";
  }

  if (transport.some(prefix => description.startsWith(prefix))) {
    return "交通費";
  }

  if (foodAndDailyNecessities.some(prefix => description.startsWith(prefix))) {
    return "食費・日用品";
  }

  if (convenienceStore.some(prefix => description.startsWith(prefix))) {
    return "コンビニ";
  }

  if (diningOut.some(prefix => description.startsWith(prefix))) {
    return "外食";
  }

  if (shopping.some(prefix => description.startsWith(prefix))) {
    return "買い物";
  }

  if (entertainment.some(prefix => description.startsWith(prefix))) {
    return "娯楽";
  }

  // 上記のどれにも該当しない場合は「未分類」として返す
  return "【未分類】";
}
