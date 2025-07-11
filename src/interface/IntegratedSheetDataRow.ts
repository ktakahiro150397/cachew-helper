import {
  getAccountName,
  IntegratedSheetDataSource,
} from "../enum/IntegratedSheetDataSource";
import { TransactionType } from "../enum/TransactionType";
import { TransferSource } from "../enum/TransferSource";
import { SpreadsheetRowData } from "../types/spreadsheet-types";

export class IntegratedSheetDataRow {
  /**
   *
   * @param date 日付
   * @param account 勘定科目
   * @param category カテゴリ
   * @param amount 金額
   * @param description 摘要
   * @param paymentMethod 支払い方法
   * @param transferFrom 振替元口座
   * @param transferTo 振替先口座
   * @param transactionType 取引種別
   */
  constructor(
    public date: Date,
    public account: string,
    public category: string,
    public amount: number,
    public description: string,
    public paymentMethod: string,
    public transferFrom: TransferSource,
    public transferTo: TransferSource,
    public transactionType: TransactionType,
    public note: string,
    public dataSource: IntegratedSheetDataSource
  ) {}

  static create(data: {
    date: Date;
    account: string;
    category: string;
    amount: number;
    description: string;
    paymentMethod: string;
    transferFrom: TransferSource;
    transferTo: TransferSource;
    transactionType: TransactionType;
    note: string;
    dataSource: IntegratedSheetDataSource;
  }): IntegratedSheetDataRow {
    return new IntegratedSheetDataRow(
      data.date,
      data.account,
      data.category,
      data.amount,
      data.description,
      data.paymentMethod,
      data.transferFrom,
      data.transferTo,
      data.transactionType,
      data.note,
      data.dataSource
    );
  }

  getWriteData(): SpreadsheetRowData {
    return [
      this.date,
      this.account,
      this.category,
      this.amount,
      this.description,
      this.paymentMethod,
      this.transferFrom,
      this.transferTo,
      this.transactionType,
      this.note,
      getAccountName(this.dataSource),
    ];
  }

  toString(): string {
    return `IntegratedSheetDataRow(date=${this.date.toISOString()}, account=${
      this.account
    }, category=${this.category}, amount=${this.amount}, description=${
      this.description
    }, paymentMethod=${this.paymentMethod}, transferFrom=${
      this.transferFrom
    }, transferTo=${this.transferTo}, transactionType=${
      this.transactionType
    }, note=${this.note}, dataSource=${this.dataSource})`;
  }
}
