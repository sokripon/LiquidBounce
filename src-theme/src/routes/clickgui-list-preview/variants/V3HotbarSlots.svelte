<!--
  Variant 3 — Hotbar Slots
  Minecraft hotbar inspired. Fixed-size square slots in a horizontal row,
  prominent icon, slot number overlay top-left. Empty `+` slot at the end.
  Hover reveals name tooltip + remove button. Drag a slot to reorder.
-->
<script lang="ts">
    import type {NamedItem} from "../../../integration/types";
    import {createDragReorder} from "../dragReorder.svelte";

    import {filterItems} from "../filterItems";

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

    const dnd = createDragReorder({onreorder, axis: "horizontal"});

    let chooserOpen = $state(false);
    let query = $state("");
    let inputEl = $state<HTMLInputElement>();
    const filtered = $derived(filterItems(availableItems, query));

    $effect(() => {
        if (chooserOpen) inputEl?.focus();
    });

    function pick(value: string) {
        onselect(value);
        query = "";
    }

    function handleKey(e: KeyboardEvent) {
        if (e.key === "Escape") {
            e.preventDefault();
            chooserOpen = false;
            query = "";
        } else if (e.key === "Enter" && filtered.length > 0) {
            e.preventDefault();
            pick(filtered[0].value);
        }
    }

</script>

<div class="hotbar" role="list">
    {#each items as item, index (item.value)}
        <div class="slot"
             role="listitem"
             title={item.name}
             class:dragging={dnd.draggingIndex === index}
             class:drop-before={dnd.dropIndex === index && dnd.draggingIndex !== index && dnd.draggingIndex !== index - 1}
             class:drop-after={dnd.dropIndex === index + 1 && dnd.draggingIndex !== index && dnd.draggingIndex !== index + 1}
             draggable="true"
             ondragstart={(e) => dnd.handleDragStart(index, e)}
             ondragover={(e) => dnd.handleDragOver(index, e)}
             ondrop={dnd.handleDrop}
             ondragend={dnd.handleDragEnd}>
            <span class="number">{index + 1}</span>
            {#if item.icon}
                <img class="icon" src={item.icon} alt={item.name}/>
            {:else}
                <span class="placeholder">?</span>
            {/if}
            <button class="remove" title="Remove {item.name}"
                    onclick={() => onremove(item.value)}>×</button>
        </div>
    {/each}
    <button class="slot add" onclick={() => { chooserOpen = !chooserOpen; }} title={addLabel} class:active={chooserOpen}>+</button>
</div>
{#if chooserOpen}
    <div class="palette">
        <div class="palette-header">
            <input class="search" type="text" placeholder="Search items…"
                   bind:this={inputEl} bind:value={query} onkeydown={handleKey}
                   spellcheck="false"/>
            <button class="close" title="Close" onclick={() => { chooserOpen = false; query = ""; }}>×</button>
        </div>
        <div class="palette-grid">
            {#if filtered.length === 0}
                <div class="empty">{availableItems.length === 0 ? "All items added" : "No matches"}</div>
            {:else}
                {#each filtered as item (item.value)}
                    <button class="palette-slot" title={item.name} onclick={() => pick(item.value)}>
                        {#if item.icon}
                            <img class="icon" src={item.icon} alt={item.name}/>
                        {:else}
                            <span class="placeholder">?</span>
                        {/if}
                    </button>
                {/each}
            {/if}
        </div>
    </div>
{/if}

<style lang="scss">
    .hotbar {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 6px;
        background: color-mix(in srgb, #000 35%, transparent);
        border-radius: 4px;
        border: 1px solid color-mix(in srgb, var(--accent-color) 20%, transparent);
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
        transition: border-color 0.15s, transform 0.1s, opacity 0.15s;
        outline-offset: -2px;

        &:hover {
            border-color: var(--accent-color);
            transform: translateY(-1px);
        }
        &:active { cursor: grabbing; }
        &.dragging { opacity: 0.4; }
        &.drop-before { outline: 2px solid var(--accent-color); outline-offset: -4px; }
        &.drop-after { outline: 2px solid var(--accent-color); outline-offset: -4px; }
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

    .icon {
        width: 26px;
        height: 26px;
        image-rendering: pixelated;
    }

    .placeholder {
        color: color-mix(in srgb, var(--clickgui-text-color) 40%, transparent);
        font-size: 18px;
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

        .icon {
            width: 26px;
            height: 26px;
            image-rendering: pixelated;
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
