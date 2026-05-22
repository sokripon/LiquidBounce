import type {NamedItem} from "../../../../integration/types";
import {filterItems} from "./filterItems";

/**
 * Reusable inline item-picker state for ordered list editors.
 *
 * Bundles the `open / query / filtered / pick / handleKey` block that every
 * AutoCrafter list variant otherwise duplicates verbatim. The consumer owns
 * the search-input element (via `bind:this`) and exposes it through the
 * `inputEl` accessor so the chooser can focus it whenever it opens.
 *
 * `availableItems` is read lazily through a getter so the chooser always
 * sees the freshest source list as the parent's reactive state updates.
 */
export interface ItemChooserHandle {
    readonly open: boolean;
    readonly query: string;
    readonly filtered: NamedItem[];
    readonly emptyMessage: string;
    setQuery: (value: string) => void;
    show: () => void;
    hide: () => void;
    toggle: () => void;
    pick: (value: string) => void;
    handleKey: (event: KeyboardEvent) => void;
}

export function createItemChooser(opts: {
    availableItems: () => NamedItem[];
    inputEl?: () => HTMLInputElement | undefined;
    onselect: (value: string) => void;
    emptyAllAdded?: string;
    emptyNoMatches?: string;
}): ItemChooserHandle {
    const emptyAllAdded = opts.emptyAllAdded ?? "All items added";
    const emptyNoMatches = opts.emptyNoMatches ?? "No matches";

    let open = $state(false);
    let query = $state("");

    const filtered = $derived(filterItems(opts.availableItems(), query));
    const emptyMessage = $derived(
        opts.availableItems().length === 0 ? emptyAllAdded : emptyNoMatches,
    );

    $effect(() => {
        if (open) opts.inputEl?.()?.focus();
    });

    function pick(value: string) {
        opts.onselect(value);
        query = "";
    }

    function handleKey(event: KeyboardEvent) {
        if (event.key === "Escape") {
            event.preventDefault();
            hide();
        } else if (event.key === "Enter" && filtered.length > 0) {
            event.preventDefault();
            pick(filtered[0].value);
        }
    }

    function show() {
        open = true;
    }

    function hide() {
        open = false;
        query = "";
    }

    function toggle() {
        if (open) hide();
        else show();
    }

    return {
        get open() { return open; },
        get query() { return query; },
        get filtered() { return filtered; },
        get emptyMessage() { return emptyMessage; },
        setQuery(value: string) { query = value; },
        show,
        hide,
        toggle,
        pick,
        handleKey,
    };
}
