import { IntegratedSheetDataSource } from "./IntegratedSheetDataSource";

export enum TransferSource {
  SMBC = "SMBC", // 三井住友銀行
  SBI_BANK = "SBI_BANK", // SBI銀行
  REAL_WALLET = "REAL_WALLET", // 実際の財布（現金）
  VPASS_CARD = "VPASS_CARD", // Vpassカード
  CHILD_ACCOUNT = "CHILD_ACCOUNT", // 子供口座
  NONE = "", // 振替元なし
}

export function getIntegratedSheetTransferSourceName(
  source: TransferSource
): IntegratedSheetDataSource {
  switch (source) {
    case TransferSource.SMBC:
      return IntegratedSheetDataSource.SMBC;
    case TransferSource.SBI_BANK:
      return IntegratedSheetDataSource.SBI_BANK;
    case TransferSource.REAL_WALLET:
      return IntegratedSheetDataSource.REAL_WALLET;
    case TransferSource.VPASS_CARD:
      return IntegratedSheetDataSource.VPASS_CARD;
    case TransferSource.CHILD_ACCOUNT:
      return IntegratedSheetDataSource.CHILD_ACCOUNT;
    case TransferSource.NONE:
      return IntegratedSheetDataSource.OTHER;
  }
}
