import { ExpenseFrom, IdealSheetRow } from "../../interface/IdealSheet";
import { SpreadsheetData } from "../../types/spreadsheet-types";
import { formatDate } from "../util/dateformat";
import { IdealDataConverterBase, IIdealDataConverter } from "./convertData";


/**
 * SMBC CSVデータのIdealSheetRowへのコンバータクラス
 */
export class SMBCBankIdealDataConverter extends IdealDataConverterBase {

    convertToIdealDataRow(): Array<IdealSheetRow> {
        if (this.bankData.length <= 1) return [];

        Logger.log(`SMBCBankIdealDataConverter: Converting ${this.bankData.length - 1} rows of data.`);

        const idealDataRows: Array<IdealSheetRow> = [];
        for (let i = 1; i < this.bankData.length; i++) {
            const row = this.bankData[i];

            const date = formatDate(row[0]);
            const amount_out = parseFloat(row[1]);
            const amount_in = parseFloat(row[2]);
            const description = String(row[3]).trim();
            const note = String(row[5] || "").trim();

            let amount = 0;
            if (!isNaN(amount_out)) {
                amount = amount_out;
            } else if (!isNaN(amount_in)) {
                amount = amount_in * -1;
            } else {
                // 金額が不明な場合はスキップ
                continue;
            }

            const idealRow = new IdealSheetRow(
                new Date(date),
                this.expenceFrom,
                "",
                description,
                amount,
                note
            );
            idealDataRows.push(idealRow);
        }

        return super.distinctIdealDataRows(idealDataRows);
    }
}
