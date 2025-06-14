export function writeIntegratedSheetHeader(
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): void {
  // ヘッダー行を設定
  const headers = [
    "日付",
    "勘定科目",
    "カテゴリ",
    "金額",
    "摘要",
    "支払い方法",
    "振替元口座",
    "振替先口座",
    "取引種別",
    "メモ",
    "口座",
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  Logger.log(`シート "${sheet.getName()}" のヘッダーを設定しました。`);
}
