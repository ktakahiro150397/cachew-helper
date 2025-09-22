import { IdealSheetRow } from "../../interface/IdealSheet";

/**
 * IdealDataRowへの変換を行うインターフェース
 */
export interface IIdealDataConverter {
    convertToIdealDataRow(): Array<IdealSheetRow>;
}