import type {NamedItem} from "../../../../integration/types";

/**
 * Case-insensitive multi-word substring filter for {@link NamedItem} lists.
 * Each whitespace-separated word in `query` must appear in the item's name.
 */
export function filterItems(items: NamedItem[], query: string): NamedItem[] {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return items;
    return items.filter(item => {
        const nameLower = item.name.toLowerCase();
        return words.every(word => nameLower.includes(word));
    });
}
