import { CashewCategory } from "../enum/cashew-category";
import { CashewAccount } from "../enum/cashew-account";
import { SpreadsheetRowData } from "../types/spreadsheet-types";

/*
    Cashewエクスポートの行を表すインターフェース
*/
export class CashewExportRow {
  /**
   *
   * @param Date
   * @param Amount
   * @param Category
   * @param Title
   * @param Note
   * @param Account
   */
  constructor(
    public Date: Date,
    public Amount: number,
    public Category: CashewCategory,
    public Title: string,
    public Note: string,
    public Account: CashewAccount
  ) {}

  static create(data: {
    Date: Date;
    Amount: number;
    Category: CashewCategory;
    Title: string;
    Note: string;
    Account: CashewAccount;
  }): CashewExportRow {
    return new CashewExportRow(
      data.Date,
      data.Amount,
      data.Category,
      data.Title,
      data.Note,
      data.Account
    );
  }

  getWriteData(): SpreadsheetRowData {
    return [
      this.Date,
      this.Amount,
      this.Category,
      this.Title,
      this.Note,
      this.Account,
    ];
  }

  toString(): string {
    return `CashewExportRow(Date: ${this.Date}, Amount: ${this.Amount}, Category: ${this.Category}, Title: ${this.Title}, Note: ${this.Note}, Account: ${this.Account})`;
  }
}
