import type {NamedItem} from "../../integration/types";

export function filterItems(items: NamedItem[], query: string): NamedItem[] {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return items;
    return items.filter(item => {
        const nameLower = item.name.toLowerCase();
        return words.every(word => nameLower.includes(word));
    });
}
