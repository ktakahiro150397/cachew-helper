/**
 * 統合データに記載するデータソース
 *
 * @export
 * @enum {number}
 */
export enum IntegratedSheetDataSource {
  VPASS_CARD = "vpass_card",
  VPASS_FAMILY = "vpass_family",
  SMBC = "SMBC",
  SBI_BANK = "SBI",
  OTHER = "other", // その他のデータソース
}

export function getAccountName(dataSource: IntegratedSheetDataSource): string {
  switch (dataSource) {
    case IntegratedSheetDataSource.VPASS_CARD:
      return "SMBC";
    case IntegratedSheetDataSource.VPASS_FAMILY:
      return "SMBC_共有";
    case IntegratedSheetDataSource.SMBC:
      return "SMBC";
    case IntegratedSheetDataSource.SBI_BANK:
      return "SBI";
    case IntegratedSheetDataSource.OTHER:
      return "その他";
    default:
      return "不明";
  }
}
