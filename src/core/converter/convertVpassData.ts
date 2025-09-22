import { ExpenseFrom, IdealSheetRow } from "../../interface/IdealSheet";
import { SpreadsheetData } from "../../types/spreadsheet-types";
import { formatDate } from "../util/dateformat";
import { IdealDataConverterBase, IIdealDataConverter } from "./convertData";


/**
 * Vpass CSVデータのIdealSheetRowへのコンバータクラス
 */
export class VpassIdealDataConverter extends IdealDataConverterBase {
    convertToIdealDataRow(): Array<IdealSheetRow> {
        if (this.bankData.length <= 1) return [];

        Logger.log(`convertVpassData: Converting ${this.bankData.length - 1} rows of data.`);

        const idealDataRows: Array<IdealSheetRow> = [];
        for (let i = 1; i < this.bankData.length; i++) {
            const row = this.bankData[i];

            const date = formatDate(row[0]);
            const description = String(row[1]).trim();
            const amount_out = parseFloat(row[2]);
            const note = String(row[6]).trim();

            let amount = 0;
            if (!isNaN(amount_out)) {
                amount = amount_out;
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
