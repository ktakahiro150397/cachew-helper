/**
 * シート操作に関するユーティリティ関数
 */

/**
 * 指定されたシートの1行目（ヘッダー）を残して、2行目以降のデータを全てクリアします。
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - クリアするシートオブジェクト。
 */
export function clearSheet(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  delColumn: number = -1
): void {
  const dataRange = sheet.getDataRange();
  const numRows = dataRange.getNumRows();

  // データが2行以上ある場合のみクリア処理を実行
  if (numRows > 1) {
    let numColumns = delColumn;
    if (numColumns === -1) {
      // delColumnが指定されていない場合、シートの最大列数を取得
      numColumns = sheet.getMaxColumns();
    }

    // 2行目から最後の行までのデータをクリア
    const clearRange = sheet.getRange(2, 1, numRows - 1, numColumns);
    clearRange.clearContent();
    clearRange.clearFormat();
    clearRange.clearDataValidations();

    Logger.log(
      `シート "${sheet.getName()}" の2行目以降のデータをクリアしました。（${
        numRows - 1
      }行をクリア）`
    );
  } else {
    Logger.log(
      `シート "${sheet.getName()}" にはヘッダー行のみが存在するため、クリア処理をスキップしました。`
    );
  }
}
