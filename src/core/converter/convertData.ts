import { ExpenseFrom, IdealSheetRow } from "../../interface/IdealSheet";
import { SpreadsheetData } from "../../types/spreadsheet-types";

/**
 * IdealDataRowへの変換を行うインターフェース
 */
export interface IIdealDataConverter {
    convertToIdealDataRow(): Array<IdealSheetRow>;
}

export abstract class IdealDataConverterBase implements IIdealDataConverter {
    constructor(
        protected readonly bankData: SpreadsheetData,
        protected readonly expenceFrom: ExpenseFrom,
    ){};

    abstract convertToIdealDataRow(): Array<IdealSheetRow>;
    
    protected distinctIdealDataRows(rows: Array<IdealSheetRow>): Array<IdealSheetRow> {
        const map = new Map<string, IdealSheetRow>();
        for (const row of rows) {
            map.set(row.getHashKey(), row);
        }
        return Array.from(map.values());
    }
}