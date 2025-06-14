import { IntegratedSheetDataSource } from "../../enum/IntegratedSheetDataSource";

/**
 * 摘要からカードの種別を推測する仮の関数です。
 * 実際のカード会社名や明細の特徴に合わせて調整してください。
 * @param {string} cardNo - カード明細の摘要。
 * @returns {string} - 推測されるカード種別（例: '個人カード', '家族カード'）。
 */
export function determineCardTypeFromCardNo(
  cardNo: string
): IntegratedSheetDataSource {
  cardNo = cardNo.toLowerCase();

  // 小文字に直した支払い方法として扱う

  // 例: 個人カードの明細によく含まれるキーワード
  if (cardNo.includes("5334-") || cardNo.includes("6900-")) {
    return IntegratedSheetDataSource.VPASS_FAMILY;
  }

  // どちらにも該当しない場合
  return IntegratedSheetDataSource.VPASS_CARD;
}
