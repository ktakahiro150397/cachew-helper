/**
 * CashewImportシートの内容をバックアップ用シートに追記します。
 */
export function exportBackup(): void {
  Logger.log("exportBackup called at " + new Date().toISOString());

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const cashewImportSheet = ss.getSheetByName("CashewImport");
  const backupSheet = ss.getSheetByName("Backup_CashewImport");

  if (!cashewImportSheet || !backupSheet) {
    Browser.msgBox(
      "エラー",
      "必要なシートが見つかりません。シート名が正しいか確認してください。（CashewImport, Backup_CashewImport）",
      Browser.Buttons.OK
    );
    Logger.log("必要なシートが見つかりません。処理を中止します。");
    return;
  }

  // CashewImportシートのデータを取得
  const dataRange = cashewImportSheet.getRange("A:G");
  const dataValues = dataRange.getValues();

  // バックアップシートのA:Hのうちどれかにデータが入っている最終行を取得
  const backupValues = backupSheet.getRange("A:G").getValues();
  let lastRow = 0;
  for (let i = 0; i < backupValues.length; i++) {
    if (backupValues[i].some((cell) => cell !== "" && cell !== null)) {
      lastRow = i + 1; // 1-indexed
    }
  }

  Logger.log(`バックアップシートの最終行: ${lastRow}`);

  // バックアップシートにデータを追記
  if (dataValues.length > 1) {
    // ヘッダー行を除くため、1行以上のデータがある場合のみ追記
    backupSheet
      .getRange(lastRow + 1, 1, dataValues.length - 1, dataValues[0].length)
      .setValues(dataValues.slice(1));
    Logger.log(
      `バックアップシートに ${dataValues.length - 1} 行のデータを追記しました。`
    );
  } else {
    Logger.log(
      "CashewImportシートにはデータがありません。バックアップは行われませんでした。"
    );
  }
}
