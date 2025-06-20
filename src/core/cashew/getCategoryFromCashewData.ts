import { SpreadsheetRowData } from "../../types/spreadsheet-types";

/**
 * Cashew出力データの摘要から、カテゴリ名を取得します。
 * @param sourceData
 */
export function getCategoryFromCashewData(description: string): string {
  if (description.startsWith("給料振込")) {
    return "所得";
  }

  if (description.startsWith("プルデンシャル生命保険")) {
    return "生命保険";
  }

  if (description.startsWith("ＳＢＩ証券投信積立サービス")) {
    return "投資";
  }

  if (description.startsWith("ﾐﾂｲｽﾐﾄﾓC(ｾﾝﾄﾗﾙF")) {
    return "ローン";
  }

  if (description.startsWith("ﾆﾎﾝｶﾞｸｾｲｼｴﾝｷｺｳ")) {
    return "ローン";
  }

  if (description.startsWith("ＧＯＯＧＬＥ　ＰＬＡＹ　ＪＡＰＡＮ")) {
    return "サブスクリプション";
  }

  if (description.startsWith("ＡＰＰＬＥ　ＣＯＭ　ＢＩＬＬ")) {
    return "サブスクリプション";
  }

  if (description.startsWith("GITHUB, INC. (GITHUB.COM )")) {
    return "サブスクリプション";
  }

  if (description.startsWith("モバイルＩＣＯＣＡ")) {
    return "交通費";
  }

  if (description.startsWith("ＥＴＣ　関西支社")) {
    return "交通費";
  }

  return "【未分類】";
}
