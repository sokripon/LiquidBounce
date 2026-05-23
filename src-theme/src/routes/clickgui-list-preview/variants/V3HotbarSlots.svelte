<!--
  Variant 3 — Hotbar Slots
  Minecraft hotbar inspired. Fixed-size square slots in a horizontal row,
  prominent icon, slot number overlay top-left. Empty `+` slot at the end.
  Hover reveals name tooltip + remove button. Drag a slot to reorder.
-->
<script lang="ts">
    import type {NamedItem} from "../../../integration/types";
    import {SortableList} from "@jhubbardsf/svelte-sortablejs";
    import {createItemChooser} from "../../clickgui/setting/list/itemChooser.svelte";
    import ItemIcon from "../../clickgui/setting/list/ItemIcon.svelte";

    interface Props {
        items: NamedItem[];
        availableItems: NamedItem[];
        addLabel?: string;
        onmove: (value: string, delta: number) => void;
        onreorder: (fromIndex: number, toIndex: number) => void;
        onremove: (value: string) => void;
        onselect: (value: string) => void;
    }

    let {items, availableItems, addLabel = "Add", onmove: _onmove, onreorder, onremove, onselect}: Props = $props();

    function handleSort(e: any) {
        const from = e.oldIndex, to = e.newIndex;
        if (typeof from === "number" && typeof to === "number" && from !== to) {
            onreorder(from, to);
        }
    }

    let inputEl: HTMLInputElement | undefined = $state();
    const chooser = createItemChooser({
        availableItems: () => availableItems,
        inputEl: () => inputEl,
        onselect: (value) => onselect(value),
    });
</script>

<div class="hotbar-wrap">
    <div class="sortable-role-wrap" role="list">
    <SortableList class="hotbar-slots-list" onSort={handleSort} animation={150}
                  forceFallback={true} direction="horizontal" draggable=".slot">
        {#each items as item, index (item.value)}
            <div class="slot" role="listitem" title={item.name}>
                <span class="number">{index + 1}</span>
                <ItemIcon src={item.icon} alt={item.name} size={26} placeholder/>
                <button class="remove" title="Remove {item.name}"
                        onclick={() => onremove(item.value)}>×</button>
            </div>
        {/each}
    </SortableList>
    </div>
    <button class="slot add" class:active={chooser.open} title={addLabel}
            onclick={chooser.toggle}>+</button>
</div>
{#if chooser.open}
    <div class="palette">
        <div class="palette-header">
            <input class="search" type="text" placeholder="Search items…"
                   bind:this={inputEl}
                   value={chooser.query}
                   oninput={(e) => chooser.setQuery(e.currentTarget.value)}
                   onkeydown={chooser.handleKey}
                   spellcheck="false"/>
            <button class="close" title="Close" onclick={chooser.hide}>×</button>
        </div>
        <div class="palette-grid">
            {#if chooser.filtered.length === 0}
                <div class="empty">{chooser.emptyMessage}</div>
            {:else}
                {#each chooser.filtered as item (item.value)}
                    <button class="palette-slot" title={item.name} onclick={() => chooser.pick(item.value)}>
                        <ItemIcon src={item.icon} alt={item.name} size={26} placeholder/>
                    </button>
                {/each}
            {/if}
        </div>
    </div>
{/if}

<style lang="scss">
    .hotbar-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 6px;
        background: color-mix(in srgb, #000 35%, transparent);
        border-radius: 4px;
        border: 1px solid color-mix(in srgb, var(--accent-color) 20%, transparent);
    }

    .sortable-role-wrap { display: contents; }

    :global(.hotbar-slots-list) {
        display: contents;
    }

    .slot {
        position: relative;
        width: 40px;
        height: 40px;
        background: color-mix(in srgb, #000 55%, transparent);
        border: 2px solid color-mix(in srgb, var(--accent-color) 30%, transparent);
        border-radius: 2px;
        cursor: grab;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.15s, transform 0.1s;

        &:hover {
            border-color: var(--accent-color);
            transform: translateY(-1px);
        }
        &:active { cursor: grabbing; }
    }

    .number {
        position: absolute;
        top: 2px;
        left: 3px;
        font-size: 9px;
        font-weight: 700;
        color: white;
        text-shadow: 1px 1px 0 #000;
        pointer-events: none;
    }

    .remove {
        position: absolute;
        top: -6px;
        right: -6px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: var(--clickgui-selection-chip-remove-color);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 12px;
        line-height: 1;
        padding: 0;
        opacity: 0;
        transition: opacity 0.15s;
    }

    .slot:hover .remove { opacity: 1; }

    .add {
        background-color: var(--clickgui-button-background-color);
        color: var(--accent-color);
        font-size: 20px;
        border: 2px solid color-mix(in srgb, var(--accent-color) 30%, transparent);
        cursor: pointer;
        transition: background-color 0.2s ease, border-color 0.15s;

        &:hover { background-color: var(--clickgui-button-hover-background-color); }
        &.active {
            background-color: color-mix(in srgb, var(--accent-color) 25%, var(--clickgui-button-background-color));
            border-color: var(--accent-color);
        }
    }

    .palette {
        margin-top: 8px;
        background-color: var(--clickgui-input-background-color);
        border-bottom: 1px solid var(--accent-color);
        border-radius: 3px;
        padding: 6px;
    }

    .palette-header {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 6px;
    }

    .search {
        flex: 1;
        background: transparent;
        border: none;
        color: var(--clickgui-text-color);
        font-family: "Inter", sans-serif;
        font-size: 12px;
        padding: 4px 6px;
        outline: none;

        &::placeholder { color: var(--clickgui-text-dimmed-color); }
    }

    .close {
        background: none;
        border: none;
        color: var(--clickgui-text-dimmed-color);
        font-size: 16px;
        line-height: 1;
        padding: 0 6px;
        cursor: pointer;
        transition: color 0.15s;

        &:hover { color: var(--clickgui-text-color); }
    }

    .palette-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, 40px);
        gap: 4px;
        max-height: 160px;
        overflow-y: auto;
    }

    .palette-slot {
        width: 40px;
        height: 40px;
        background: color-mix(in srgb, #000 55%, transparent);
        border: 2px solid color-mix(in srgb, var(--accent-color) 30%, transparent);
        border-radius: 2px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        transition: border-color 0.12s, transform 0.1s;

        &:hover {
            border-color: var(--accent-color);
            transform: translateY(-1px);
        }
    }

    .empty {
        grid-column: 1 / -1;
        font-size: 11px;
        opacity: 0.6;
        padding: 6px;
        text-align: center;
    }
</style>
