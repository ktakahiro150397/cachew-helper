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
      return "Vpass";
    case IntegratedSheetDataSource.VPASS_FAMILY:
      return "Vpass_共有";
    case IntegratedSheetDataSource.SMBC:
      return "SMBC";
    case IntegratedSheetDataSource.SBI_BANK:
      return "SBI_BANK";
    case IntegratedSheetDataSource.REAL_WALLET:
      return "現金";
    case IntegratedSheetDataSource.CHILD_ACCOUNT:
      return "子供口座";
    case IntegratedSheetDataSource.OTHER:
      return "その他";
    default:
      return "不明";
  }
}
