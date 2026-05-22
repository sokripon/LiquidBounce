<script lang="ts">
    import type {NamedItem} from "../../../../integration/types";
    import VirtualList from "./VirtualList.svelte";
    import SelectableListItem from "./SelectableListItem.svelte";
    import {filterItems} from "./filterItems";

    interface Props {
        items: NamedItem[];
        placeholder?: string;
        onselect: (detail: {value: string}) => void;
        onclose?: () => void;
    }

    let {items, placeholder = "Search", onselect, onclose}: Props = $props();

    let searchQuery = $state("");
    let searchInput = $state<HTMLInputElement>();

    const filteredItems = $derived(filterItems(items, searchQuery));

    $effect(() => {
        searchInput?.focus();
    });

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            event.preventDefault();
            onclose?.();
        }
    }
</script>

<div class="chooser">
    <input type="text" {placeholder} class="search-input"
           bind:this={searchInput} bind:value={searchQuery}
           onkeydown={handleKeydown}
           spellcheck="false">
    <div class="results">
        {#if filteredItems.length === 0}
            <div class="empty">{items.length === 0 ? "No items available" : "No matches"}</div>
        {:else}
            <VirtualList items={filteredItems} resetScrollOnItemsChange={false} let:item>
                <SelectableListItem value={item.value} name={item.name} icon={item.icon} {onselect}/>
            </VirtualList>
        {/if}
    </div>
</div>

<style lang="scss">
    .chooser {
        .search-input {
            width: 100%;
            border: none;
            border-bottom: solid 1px var(--accent-color);
            font-family: "Inter", sans-serif;
            font-size: 12px;
            padding: 5px;
            color: var(--clickgui-text-color);
            margin-bottom: 5px;
            background-color: var(--clickgui-input-background-color);
        }

        .results {
            height: 200px;
            overflow-y: auto;
            overflow-x: hidden;
            min-height: 100px;
            max-height: 500px;
            position: relative;
        }

        .empty {
            color: var(--clickgui-text-color);
            font-size: 12px;
            opacity: 0.6;
            padding: 10px 5px;
            text-align: center;
        }
    }
</style>
