/**
 * 日付オブジェクトまたは日付文字列をYYYY-MM-DD形式の文字列にフォーマットします。
 * @param {any} dateValue - 日付を表す値。
 * @returns {string} - YYYY-MM-DD形式の日付文字列。
 */
export function formatDate(dateValue: any): string {
  if (!dateValue) return '';
  let date;
  if (dateValue instanceof Date) {
    date = dateValue;
  } else {
    // スプレッドシートから取得した日付は数値の場合がある
    date = new Date(dateValue);
    // 日付として無効な場合は空文字列を返す
    if (isNaN(date.getTime())) {
      try {
        // 'YYYY/MM/DD' 形式を想定してパースを試みる
        const parts = String(dateValue).split(/[\/\-]/);
        if (parts.length === 3) {
          date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          if (isNaN(date.getTime())) {
            return String(dateValue); // パース失敗、元の値をそのまま返す
          }
        } else {
          return String(dateValue); // 日付として解釈できない場合、元の文字列を返す
        }
      } catch (e) {
        return String(dateValue); // エラーの場合、元の文字列を返す
      }
    }
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}