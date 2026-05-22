<script lang="ts">
    import type {NamedItem} from "../../../../integration/types";
    import VirtualList from "./VirtualList.svelte";
    import SelectableListItem from "./SelectableListItem.svelte";

    interface Props {
        items: NamedItem[];
        placeholder?: string;
        onselect: (detail: {value: string}) => void;
    }

    let {items, placeholder = "Search", onselect}: Props = $props();

    let searchQuery = $state("");

    const filteredItems = $derived.by(() => {
        const words = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
        if (words.length === 0) return items;
        return items.filter(item => {
            const nameLower = item.name.toLowerCase();
            return words.every(word => nameLower.includes(word));
        });
    });
</script>

<div class="chooser">
    <input type="text" {placeholder} class="search-input"
           bind:value={searchQuery} spellcheck="false">
    <div class="results">
        <VirtualList items={filteredItems} let:item>
            <SelectableListItem value={item.value} name={item.name} icon={item.icon} {onselect}/>
        </VirtualList>
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
            height: 150px;
            overflow-y: auto;
            overflow-x: hidden;
            min-height: 100px;
            max-height: 300px;
            position: relative;
        }
    }
</style>
