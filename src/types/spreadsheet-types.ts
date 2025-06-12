/**
 * スプレッドシート関連の型定義
 */

// スプレッドシートの1行分のデータを表す型
export type SpreadsheetRowData = Array<any>;

// スプレッドシートの全データ（複数行）を表す型
export type SpreadsheetData = Array<SpreadsheetRowData>;
