<!--
  Variant 2 — Compact Chips
  Items flow as inline chips that wrap. Each chip shows ordinal + icon + name
  with an integrated remove. Smallest possible footprint; great when AutoCrafter
  sequences get long. Drag a chip to reorder.
-->
<script lang="ts">
    import type {NamedItem} from "../../../integration/types";
    import {createDragReorder} from "../dragReorder.svelte";

    import {filterItems} from "../filterItems";
    import {handleIconError} from "../../../integration/iconFallback";

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
    // onmove intentionally unused — chips rely on DnD only; keyboard order
    // changes go via the surrounding context if needed.

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

<div class="chips" role="list">
    {#each items as item, index (item.value)}
        <div class="chip"
             role="listitem"
             class:dragging={dnd.draggingIndex === index}
             class:drop-before={dnd.dropIndex === index && dnd.draggingIndex !== index && dnd.draggingIndex !== index - 1}
             class:drop-after={dnd.dropIndex === index + 1 && dnd.draggingIndex !== index && dnd.draggingIndex !== index + 1}
             draggable="true"
             ondragstart={(e) => dnd.handleDragStart(index, e)}
             ondragover={(e) => dnd.handleDragOver(index, e)}
             ondrop={dnd.handleDrop}
             ondragend={dnd.handleDragEnd}>
            <span class="ordinal">{index + 1}</span>
            {#if item.icon}
                <img class="icon" src={item.icon} alt="" data-name={item.name} onerror={handleIconError}/>
            {/if}
            <span class="name">{item.name}</span>
            <button class="remove" title="Remove" onclick={() => onremove(item.value)}>×</button>
        </div>
    {/each}
    {#if chooserOpen}
        <div class="chip search-chip" role="listitem">
            <span class="ordinal">+</span>
            <input class="search" type="text" placeholder="Search…"
                   bind:this={inputEl} bind:value={query} onkeydown={handleKey}
                   spellcheck="false"/>
            <button class="remove" title="Close" onclick={() => { chooserOpen = false; query = ""; }}>×</button>
        </div>
    {:else}
        <button class="add" onclick={() => { chooserOpen = true; }} title={addLabel}>+</button>
    {/if}
</div>
{#if chooserOpen}
    <div class="suggestions">
        {#if filtered.length === 0}
            <div class="empty">{availableItems.length === 0 ? "All items added" : "No matches"}</div>
        {:else}
            {#each filtered as item (item.value)}
                <button class="suggest" onclick={() => pick(item.value)}>
                    {#if item.icon}
                        <img class="icon" src={item.icon} alt="" data-name={item.name} onerror={handleIconError}/>
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
        color: color-mix(in srgb, var(--clickgui-text-color) 60%, transparent);
        cursor: pointer;
        font-size: 14px;
        line-height: 1;
        padding: 0 4px;
        border-radius: 999px;
        transition: color 0.15s, background 0.15s;

        &:hover {
            color: #ff8a80;
            background: color-mix(in srgb, #ff8a80 18%, transparent);
        }
    }

    .add {
        background: var(--clickgui-button-background-color);
        color: var(--accent-color);
        border: 1px dashed color-mix(in srgb, var(--accent-color) 40%, transparent);
        border-radius: 999px;
        width: 24px;
        height: 24px;
        cursor: pointer;
        font-size: 14px;
        line-height: 1;
        transition: background 0.15s;

        &:hover { background: var(--clickgui-button-hover-background-color); }
    }

    .search-chip {
        background: color-mix(in srgb, var(--accent-color) 18%, var(--clickgui-base-color));
        border-color: var(--accent-color);
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

        &::placeholder { color: color-mix(in srgb, var(--clickgui-text-color) 50%, transparent); }
    }

    .suggestions {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 6px;
        padding: 6px;
        background: color-mix(in srgb, var(--clickgui-base-color) 60%, transparent);
        border: 1px solid color-mix(in srgb, var(--accent-color) 15%, transparent);
        border-radius: 4px;
        max-height: 140px;
        overflow-y: auto;
    }

    .suggest {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 8px;
        background: var(--clickgui-button-background-color);
        border: 1px solid color-mix(in srgb, var(--accent-color) 20%, transparent);
        border-radius: 999px;
        cursor: pointer;
        font-size: 11px;
        color: var(--clickgui-text-color);
        transition: background 0.15s, border-color 0.15s;

        &:hover {
            background: color-mix(in srgb, var(--accent-color) 25%, var(--clickgui-button-background-color));
            border-color: var(--accent-color);
        }

        .icon {
            width: 14px;
            height: 14px;
            image-rendering: pixelated;
        }
    }

    .empty {
        font-size: 11px;
        opacity: 0.6;
        padding: 4px;
        width: 100%;
        text-align: center;
    }
</style>
