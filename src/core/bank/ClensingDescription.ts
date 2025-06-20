
/**
 * クレンジング処理を行い、整形された説明文を返します。
 * @param description 
 */
export function getClensingDescription(description: string): string {
  let retDescription = description.trim();

  // "V\d{6} (?*)"に一致する場合、前半の"V"と数字を削除
  const regex = /^V\d{6}[　| ](.*)/;
  const match = retDescription.match(regex);
  if (match) {
    retDescription = match[1];
  }

  if(retDescription === "") {
    // 空文字列の場合は元データを返す
    return description;
  }

  return retDescription;
}