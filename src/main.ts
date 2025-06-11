import { sample } from "./sample";
import { CashewExportRow } from "./interface/cashew-export";
import { CashewCategory } from "./enum/cashew-category";
import { CashewAccount } from "./enum/cashew-account";

(global as any).sample = sample;
(global as any).CashewCategory = CashewCategory;
(global as any).CashewAccount = CashewAccount;

const record: CashewExportRow = {
    Date: new Date(),
    Amount: 0,
    Category: CashewCategory.Groceries,
    Title: "",
    Note: "",
    Account: CashewAccount.SMBC_Main,
};

console.log(record);
