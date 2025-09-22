import { SpreadsheetRowData } from "../types/spreadsheet-types";

/**
 * 支出元を表す列挙型
 */
export enum ExpenseFrom {
    Takahiro_SMBC = "Takahiro SMBC",
    Takahiro_SBINetBank = "Takahiro SBINet",
    Takahiro_Vpass = "Takahiro Vpass",
    Family_SMBC = "共有 SMBC",
    Family_Vpass = "共有 Vpass",
    Tomo_SMBC = "智也 SMBC",
}

/**
 * 最終的に出力するデータシートの行を表すインターフェース
 */
export interface IIdealSheetRow {
    /**
     * 明細の日付
     */
    date: Date;

    /**
     * 支出元
     */
    account: ExpenseFrom;

    /**
     * カテゴリ
     */
    category: string;

    /**
     * 摘要
     */
    content: string;

    /**
     * 金額（収入は負の値）
     */
    amount: number;

    /**
     * 備考
     */
    note: string;
}

export class IdealSheetRow implements IIdealSheetRow {
    constructor(
        public date: Date,
        public account: ExpenseFrom,
        public category: string,
        public content: string,
        public amount: number,
        public note: string
    ) {
        if (note === undefined) {
            this.note = "";
        }
    };

    getWriteData(): SpreadsheetRowData {
        return [
            this.date,
            this.account,
            this.category,
            this.content,
            this.amount,
            this.note
        ]
    }

    getHashKey(): string {
        return `${this.date.toISOString()}|${this.account}|${this.category}|${this.content}|${this.amount}|${this.note}`;
    }
}