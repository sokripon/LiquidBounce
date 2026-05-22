<!--
  Variant 2 — Compact Chips
  Items flow as inline chips that wrap. Each chip shows ordinal + icon + name
  with an integrated remove. Smallest possible footprint; great when AutoCrafter
  sequences get long. Drag a chip to reorder.
-->
<script lang="ts">
    import type {NamedItem} from "../../../integration/types";
    import {createDragReorder} from "../../clickgui/setting/list/dragReorder.svelte";
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
    // onmove intentionally unused — chips rely on DnD only.

    const dnd = createDragReorder({onreorder, axis: "horizontal"});
    let inputEl: HTMLInputElement | undefined = $state();
    const chooser = createItemChooser({
        availableItems: () => availableItems,
        inputEl: () => inputEl,
        onselect,
        emptyAllAdded: "No more items to add",
    });

</script>

<div class="chips" role="list">
    {#each items as item, index (item.value)}
        <div class="chip {dnd.classesFor(index)}"
             role="listitem"
             {...dnd.attrs(index)}>
            <span class="ordinal">{index + 1}</span>
            {#if item.icon}
                <ItemIcon src={item.icon} size={14}/>
            {/if}
            <span class="name">{item.name}</span>
            <button class="remove" title="Remove" onclick={() => onremove(item.value)}>×</button>
        </div>
    {/each}
    {#if chooser.open}
        <div class="chip search-chip" role="listitem">
            <span class="ordinal">+</span>
            <input class="search" type="text" placeholder="Search…"
                   bind:this={inputEl}
                   value={chooser.query}
                   oninput={(e) => chooser.setQuery(e.currentTarget.value)}
                   onkeydown={chooser.handleKey}
                   spellcheck="false"/>
            <button class="remove" title="Close" onclick={chooser.hide}>×</button>
        </div>
    {:else}
        <button class="add" onclick={chooser.show} title={addLabel}>+</button>
    {/if}
</div>
{#if chooser.open}
    <div class="suggestions">
        {#if chooser.filtered.length === 0}
            <div class="empty">{chooser.emptyMessage}</div>
        {:else}
            {#each chooser.filtered as item (item.value)}
                <button class="suggest" onclick={() => chooser.pick(item.value)}>
                    {#if item.icon}
                        <ItemIcon src={item.icon} size={14}/>
                    {/if}
                    <span class="name">{item.name}</span>
                </button>
            {/each}
        {/if}
    </div>
{/if}

<style lang="scss">
    .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        align-items: center;
    }

    .chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 4px 3px 6px;
        background: color-mix(in srgb, var(--accent-color) 12%, var(--clickgui-base-color));
        border: 1px solid color-mix(in srgb, var(--accent-color) 25%, transparent);
        border-radius: 999px;
        cursor: grab;
        font-size: 11px;
        color: var(--clickgui-text-color);
        transition: background 0.15s, transform 0.1s, opacity 0.15s;
        border-left: 2px solid transparent;
        border-right: 2px solid transparent;

        &:hover { background: color-mix(in srgb, var(--accent-color) 22%, var(--clickgui-base-color)); }
        &:active { cursor: grabbing; }
        &.dragging { opacity: 0.4; }
        &.drop-before { border-left-color: var(--accent-color); }
        &.drop-after { border-right-color: var(--accent-color); }
    }

    .ordinal {
        background: var(--accent-color);
        color: white;
        font-weight: 700;
        font-size: 10px;
        border-radius: 999px;
        min-width: 14px;
        height: 14px;
        padding: 0 4px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .icon {
        width: 14px;
        height: 14px;
        image-rendering: pixelated;
    }

    .name {
        max-width: 110px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .remove {
        background: none;
        border: none;
        color: var(--clickgui-text-dimmed-color);
        cursor: pointer;
        font-size: 14px;
        line-height: 1;
        padding: 0 4px;
        border-radius: 999px;
        transition: color 0.15s, background 0.15s;

        &:hover {
            color: var(--clickgui-selection-chip-remove-color);
            background: var(--clickgui-selection-chip-remove-background-color);
        }
    }

    .add {
        background-color: var(--clickgui-button-background-color);
        color: var(--accent-color);
        border: none;
        border-radius: 999px;
        width: 24px;
        height: 24px;
        cursor: pointer;
        font-size: 14px;
        line-height: 1;
        transition: background-color 0.2s ease;

        &:hover { background-color: var(--clickgui-button-hover-background-color); }
    }

    .search-chip {
        background-color: var(--clickgui-input-background-color);
        border: none;
        border-bottom: 1px solid var(--accent-color);
        border-radius: 3px;
        cursor: text;
        padding: 3px 4px 3px 6px;
    }

    .search {
        background: transparent;
        border: none;
        outline: none;
        color: var(--clickgui-text-color);
        font-family: "Inter", sans-serif;
        font-size: 11px;
        width: 110px;
        padding: 0;

        &::placeholder { color: var(--clickgui-text-dimmed-color); }
    }

    .suggestions {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 6px;
        padding: 6px;
        background-color: var(--clickgui-input-background-color);
        border-bottom: 1px solid var(--accent-color);
        border-radius: 3px;
        max-height: 140px;
        overflow-y: auto;
    }

    .suggest {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 8px;
        background-color: var(--clickgui-button-background-color);
        border: none;
        border-radius: 999px;
        cursor: pointer;
        font-size: 11px;
        color: var(--clickgui-text-color);
        transition: background-color 0.2s ease;

        &:hover {
            background-color: var(--clickgui-button-hover-background-color);
        }
    }

    .empty {
        font-size: 11px;
        color: var(--clickgui-text-dimmed-color);
        padding: 4px;
        width: 100%;
        text-align: center;
    }
</style>
