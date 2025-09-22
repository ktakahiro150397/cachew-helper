import { IIdealDataConverter } from "../core/converter/convertData";
import { SBINetBankIdealDataConverter } from "../core/converter/convertSBINetBankData";
import { SMBCBankIdealDataConverter } from "../core/converter/convertSMBCBankData";
import { VpassIdealDataConverter } from "../core/converter/convertVpassData";
import { ExpenseFrom, IdealSheetRow } from "../interface/IdealSheet";
import { clearSheet } from "../sheetoperation/sheet-operation";

export function convertDataToIdealSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const ideal = ss.getSheetByName("集計結果");
  const smbc = ss.getSheetByName("SMBC");
  const sbi = ss.getSheetByName("SBI");
  const vpass = ss.getSheetByName("Vpass");
  const family_smbc = ss.getSheetByName("共有SMBC");
  const family_vpass = ss.getSheetByName("共有Vpass");

  if (!ideal || !smbc || !sbi || !vpass || !family_smbc || !family_vpass) {
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

    {
      // データの取得・書き込み
      const smbcSheetValues = smbc.getDataRange().getValues();
      const smbcConverter = new SMBCBankIdealDataConverter(
        smbcSheetValues,
        ExpenseFrom.Takahiro_SMBC
      );
      addDataToIdealSheet(ideal, smbcConverter);
    }

    {
      const sbiSheetValues = sbi.getDataRange().getValues();
      const sbiConverter = new SBINetBankIdealDataConverter(
        sbiSheetValues,
        ExpenseFrom.Takahiro_SBINetBank
      );
      addDataToIdealSheet(ideal, sbiConverter);
    }

    {
      const vpassSheetValues = vpass.getDataRange().getValues();
      const vpassConverter = new VpassIdealDataConverter(
        vpassSheetValues,
        ExpenseFrom.Takahiro_Vpass
      );
      addDataToIdealSheet(ideal, vpassConverter);
    }
    
    {
      const familySmbcSheetValues = family_smbc.getDataRange().getValues();
      const familySmbcConverter = new SMBCBankIdealDataConverter(
        familySmbcSheetValues,
        ExpenseFrom.Family_SMBC
      );
      addDataToIdealSheet(ideal, familySmbcConverter);
    }

    {
      const familyVpassSheetValues = family_vpass.getDataRange().getValues();
      const familyVpassConverter = new VpassIdealDataConverter(
        familyVpassSheetValues,
        ExpenseFrom.Family_Vpass
      );
      addDataToIdealSheet(ideal, familyVpassConverter);
    }
    
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

function addDataToIdealSheet(
  ideal: GoogleAppsScript.Spreadsheet.Sheet,
  converter: IIdealDataConverter
) {
  const convertedData = converter.convertToIdealDataRow();

  if (convertedData.length === 0) {
    Logger.log("変換されたデータがありません。");
    return;
  }

  const dataToWrite = convertedData.map((row) => row.getWriteData());

  ideal
    .getRange(
      ideal.getLastRow() + 1,
      1,
      dataToWrite.length,
      dataToWrite[0].length
    )
    .setValues(dataToWrite);
}
