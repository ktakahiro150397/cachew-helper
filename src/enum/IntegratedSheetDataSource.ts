/**
 * 統合データに記載するデータソース
 *
 * @export
 * @enum {number}
 */
export enum IntegratedSheetDataSource {
  VPASS_CARD = "VPASS_CARD",
  VPASS_FAMILY = "VPASS_FAMILY",
  SMBC = "SMBC",
  SBI_BANK = "SBI_BANK",
  REAL_WALLET = "REAL_WALLET", // 実際の財布（現金）
  CHILD_ACCOUNT = "CHILD_ACCOUNT", // 子供口座
  OTHER = "OTHER", // その他のデータソース
}

export function getAccountName(dataSource: IntegratedSheetDataSource): string {
  switch (dataSource) {
    case IntegratedSheetDataSource.VPASS_CARD:
      return "nVpass";
    case IntegratedSheetDataSource.VPASS_FAMILY:
      return "nVpass_共有";
    case IntegratedSheetDataSource.SMBC:
      return "nSMBC";
    case IntegratedSheetDataSource.SBI_BANK:
      return "nSBI_BANK";
    case IntegratedSheetDataSource.REAL_WALLET:
      return "n現金";
    case IntegratedSheetDataSource.CHILD_ACCOUNT:
      return "n子供口座";
    case IntegratedSheetDataSource.OTHER:
      return "nその他";
    default:
      return "n不明";
  }
}
