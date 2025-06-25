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
  const dataRange = cashewImportSheet.getRange("A:H");
  const dataValues = dataRange.getValues();

  // バックアップシートのA:Hのうちどれかにデータが入っている最終行を取得
  const backupValues = backupSheet.getRange("A:H").getValues();
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

    // H列のバックアップキーが存在する場合は対象外とする
    const backupKeys = backupValues.map((row) => row[7]); // H列の値を取得

    // データ書き込みはA:G列のみ
    const newData = dataValues
        .slice(1)
        .filter((row) => !backupKeys.includes(row[7]))
        .map((row) => row.slice(0, 7)); // H列を除外

    if (newData.length === 0) {
      Logger.log("新しいデータはありません。バックアップは行われませんでした。");
      return;
    }

    backupSheet
      .getRange(lastRow + 1, 1, newData.length, newData[0].length)
      .setValues(newData);
    Logger.log(
      `バックアップシートに ${newData.length} 行のデータを追記しました。`
    );
  } else {
    Logger.log(
      "CashewImportシートにはデータがありません。バックアップは行われませんでした。"
    );
  }
}
