import { SBIBankIdealDataConverter } from "../core/converter/convertSBIBankData";
import { ExpenseFrom } from "../interface/IdealSheet";
import { clearSheet } from "../sheetoperation/sheet-operation";


export function convertDataToIdealSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const ideal = ss.getSheetByName("集計結果");
    const smbc = ss.getSheetByName("SMBC");

    if (!ideal || !smbc) {
        Browser.msgBox(
            "エラー",
            "必要なシートが見つかりません。シート名が正しいか確認してください。（SMBC）",
            Browser.Buttons.OK
        );
        Logger.log("必要なシートが見つかりません。処理を中止します。");
        return;
    }

    try {
        // 初期化処理
        clearSheet(ideal);

        // データの取得・書き込み
        const smbcSheetValues = smbc.getDataRange().getValues();
        const smbcConverter = new SBIBankIdealDataConverter(smbcSheetValues, ExpenseFrom.Takahiro_SMBC);
        const idealDataToWrite = smbcConverter.convertToIdealDataRow().map(row => row.getWriteData());

        // データの書き込み
        ideal.getRange(ideal.getLastRow() + 1, 1, idealDataToWrite.length, idealDataToWrite[0].length).setValues(idealDataToWrite);

        Logger.log(`SMBCデータの処理が完了しました。${idealDataToWrite.length} 行を追加しました。`);
    } catch (error) {
        Logger.log("エラーが発生しました: " + (error as Error).message);
        Browser.msgBox(
            "エラー",
            "処理中にエラーが発生しました。ログを確認してください。",
            Browser.Buttons.OK
        );
    }
    
    Logger.log("convertDataToIdealSheet finished at " + new Date().toISOString());
}