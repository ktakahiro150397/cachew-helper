/**
 * 摘要からカードの種別を推測する仮の関数です。
 * 実際のカード会社名や明細の特徴に合わせて調整してください。
 * @param {string} description - カード明細の摘要。
 * @returns {string} - 推測されるカード種別（例: '個人カード', '家族カード'）。
 */
export function determineCardTypeFromDescription(description: string): "個人カード" | "家族カード" | "不明なカード" {
  description = description.toLowerCase();

  // 小文字に直した支払い方法として扱う
  // TODO : 実データに応じて変更する
  
  // 例: 個人カードの明細によく含まれるキーワード
  if (description.includes('visa') || description.includes('mastercard') || description.includes('jcb')) {
    return '個人カード';
  }
  // 例: 家族カードの明細によく含まれるキーワード
  if (description.includes('family card') || description.includes('kazoku')) {
    return '家族カード';
  }
  // どちらにも該当しない場合
  return '不明なカード';
}
