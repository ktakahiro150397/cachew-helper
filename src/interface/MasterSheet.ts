export type ColorStyle = `#${string}`;

export interface CategoryItem {
    category: string;
    // color: ColorStyle | "";
}

export interface CategoryMapping {
    category: string;
    content: string;
    reason: string;
}
