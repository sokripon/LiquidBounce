<!--
  Variant 1 — Numbered Steps
  Vertical timeline / recipe-style. Each step has a circular accent badge
  showing its 1-based ordinal, connected by a faint rail. Items are big and
  scannable. Best when the order itself carries the semantic meaning.
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

    let {items, availableItems, addLabel = "Add Step", onmove, onreorder, onremove, onselect}: Props = $props();

    const dnd = createDragReorder({onreorder, axis: "vertical"});

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

<div class="steps" role="list">
    {#each items as item, index (item.value)}
        <div class="step"
             role="listitem"
             class:dragging={dnd.draggingIndex === index}
             class:drop-before={dnd.dropIndex === index && dnd.draggingIndex !== index && dnd.draggingIndex !== index - 1}
             class:drop-after={dnd.dropIndex === index + 1 && dnd.draggingIndex !== index && dnd.draggingIndex !== index + 1}
             draggable="true"
             ondragstart={(e) => dnd.handleDragStart(index, e)}
             ondragover={(e) => dnd.handleDragOver(index, e)}
             ondrop={dnd.handleDrop}
             ondragend={dnd.handleDragEnd}>
            <div class="badge">{index + 1}</div>
            <div class="body">
                {#if item.icon}
                    <img class="icon" src={item.icon} alt=""/>
                {/if}
                <span class="name">{item.name}</span>
                <div class="controls">
                    <button class="ctrl" disabled={index === 0} title="Move up"
                            onclick={() => onmove(item.value, -1)}>▲</button>
                    <button class="ctrl" disabled={index === items.length - 1} title="Move down"
                            onclick={() => onmove(item.value, 1)}>▼</button>
                    <button class="ctrl remove" title="Remove"
                            onclick={() => onremove(item.value)}>×</button>
                </div>
            </div>
        </div>
    {/each}
    {#if chooserOpen}
        <div class="step ghost" role="listitem">
            <div class="badge ghost-badge">{items.length + 1}</div>
            <div class="body chooser-body">
                <input class="search" type="text" placeholder="Search to add a step…"
                       bind:this={inputEl} bind:value={query} onkeydown={handleKey}
                       spellcheck="false"/>
                <button class="ctrl" title="Close" onclick={() => { chooserOpen = false; query = ""; }}>×</button>
            </div>
        </div>
        {#if filtered.length === 0}
            <div class="empty">{availableItems.length === 0 ? "All items added" : "No matches"}</div>
        {:else}
            <div class="results">
                {#each filtered as item (item.value)}
                    <button class="result" onclick={() => pick(item.value)}>
                        {#if item.icon}
                            <img class="icon" src={item.icon} alt=""/>
                        {/if}
                        <span class="name">{item.name}</span>
                    </button>
                {/each}
            </div>
        {/if}
    {:else}
        <button class="add" onclick={() => { chooserOpen = true; }}>+ {addLabel}</button>
    {/if}
</div>

<style lang="scss">
    .steps {
        display: flex;
        flex-direction: column;
        gap: 6px;
        position: relative;
    }

    .step {
        display: flex;
        align-items: stretch;
        gap: 10px;
        position: relative;
        cursor: grab;
        border-top: 2px solid transparent;
        border-bottom: 2px solid transparent;
        transition: opacity 0.15s ease;

        &:active { cursor: grabbing; }
        &.dragging { opacity: 0.4; }
        &.drop-before { border-top-color: var(--accent-color); }
        &.drop-after { border-bottom-color: var(--accent-color); }

        // connecting rail
        &::before {
            content: "";
            position: absolute;
            left: 11px;
            top: 28px;
            bottom: -8px;
            width: 2px;
            background: color-mix(in srgb, var(--accent-color) 30%, transparent);
        }
        &:last-of-type::before { display: none; }
    }

    .badge {
        flex: 0 0 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--accent-color);
        color: white;
        font-weight: 700;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        box-shadow: 0 0 0 2px var(--clickgui-base-color, #1a1a1a);
    }

    .body {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        background: color-mix(in srgb, var(--clickgui-base-color) 12%, transparent);
        border-radius: 4px;
        border: 1px solid color-mix(in srgb, var(--accent-color) 15%, transparent);
    }

    .icon {
        width: 22px;
        height: 22px;
        image-rendering: pixelated;
    }

    .name {
        flex: 1;
        color: var(--clickgui-text-color);
        font-size: 12px;
    }

    .controls {
        display: flex;
        gap: 2px;
        cursor: default;
    }

    .ctrl {
        background: none;
        border: none;
        color: var(--accent-color);
        cursor: pointer;
        font-size: 12px;
        line-height: 1;
        padding: 3px 6px;
        border-radius: 3px;
        transition: background 0.15s;

        &:hover:not(:disabled) {
            background: color-mix(in srgb, var(--accent-color) 20%, transparent);
        }
        &:disabled {
            opacity: 0.25;
            cursor: not-allowed;
        }
        &.remove { color: #e57373; }
    }

    .add {
        margin-left: 34px;
        font-family: monospace;
        font-size: 12px;
        color: var(--clickgui-text-color);
        background: var(--clickgui-button-background-color);
        border: 1px dashed color-mix(in srgb, var(--accent-color) 40%, transparent);
        padding: 6px 10px;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;

        &:hover { background: var(--clickgui-button-hover-background-color); }
    }

    .ghost .badge.ghost-badge {
        background: color-mix(in srgb, var(--accent-color) 40%, transparent);
        border: 1px dashed var(--accent-color);
    }

    .chooser-body {
        gap: 4px;
        padding: 2px 4px 2px 8px;
    }

    .search {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        font-family: "Inter", sans-serif;
        font-size: 12px;
        color: var(--clickgui-text-color);
        padding: 4px 0;

        &::placeholder { color: color-mix(in srgb, var(--clickgui-text-color) 50%, transparent); }
    }

    .results {
        margin-left: 34px;
        display: flex;
        flex-direction: column;
        gap: 2px;
        max-height: 180px;
        overflow-y: auto;
        background: color-mix(in srgb, var(--clickgui-base-color) 60%, transparent);
        border: 1px solid color-mix(in srgb, var(--accent-color) 15%, transparent);
        border-radius: 4px;
        padding: 4px;
    }

    .result {
        display: flex;
        align-items: center;
        gap: 8px;
        background: none;
        border: none;
        color: var(--clickgui-text-color);
        font-size: 12px;
        padding: 5px 8px;
        cursor: pointer;
        text-align: left;
        border-radius: 3px;
        transition: background 0.12s;

        &:hover { background: color-mix(in srgb, var(--accent-color) 18%, transparent); }
    }

    .empty {
        margin-left: 34px;
        font-size: 11px;
        opacity: 0.6;
        padding: 6px 4px;
    }
</style>
