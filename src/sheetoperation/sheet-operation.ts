/**
 * シート操作に関するユーティリティ関数
 */

/**
 * 指定されたシートの内容をクリアします。
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - クリアするシートオブジェクト。
 */
export function clearSheet(sheet: GoogleAppsScript.Spreadsheet.Sheet): void {
  sheet.clearContents();
  sheet.clearFormats();

  // sheet.clearDataValidations();
  const range = sheet.getDataRange();
  if (range.getNumRows() > 0 && range.getNumColumns() > 0) {
    range.clearDataValidations();
  }

  Logger.log(`シート "${sheet.getName()}" の内容をクリアしました。`);
}
