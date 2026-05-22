<!--
  Variant 4 — Card Grid
  Items render as cards in a wrap-flow grid. Larger icon top, name below.
  Controls live in a hover-revealed footer to keep the resting state quiet.
  Drag a card to reorder. Good when icons are the primary recognition cue.
-->
<script lang="ts">
    import type {NamedItem} from "../../../integration/types";
    import {createDragReorder} from "../dragReorder.svelte";

    import {filterItems} from "../filterItems";
    import {handleIconError} from "../iconFallback";

    interface Props {
        items: NamedItem[];
        availableItems: NamedItem[];
        addLabel?: string;
        onmove: (value: string, delta: number) => void;
        onreorder: (fromIndex: number, toIndex: number) => void;
        onremove: (value: string) => void;
        onselect: (value: string) => void;
    }

    let {items, availableItems, addLabel = "Add Item", onmove, onreorder, onremove, onselect}: Props = $props();

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

<div class="grid" role="list">
    {#each items as item, index (item.value)}
        <div class="card"
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
            <div class="icon-wrap">
                {#if item.icon}
                    <img class="icon" src={item.icon} alt={item.name} data-name={item.name} onerror={handleIconError}/>
                {:else}
                    <span class="placeholder">?</span>
                {/if}
            </div>
            <div class="name" title={item.name}>{item.name}</div>
            <div class="footer">
                <button class="ctrl" disabled={index === 0} title="Move left"
                        onclick={() => onmove(item.value, -1)}>◀</button>
                <button class="ctrl remove" title="Remove"
                        onclick={() => onremove(item.value)}>×</button>
                <button class="ctrl" disabled={index === items.length - 1} title="Move right"
                        onclick={() => onmove(item.value, 1)}>▶</button>
            </div>
        </div>
    {/each}
    <button class="card add" onclick={() => { chooserOpen = true; }}>
        <span class="plus">+</span>
        <span class="add-label">{addLabel}</span>
    </button>
</div>
{#if chooserOpen}
    <div class="overlay"
         role="button"
         tabindex="-1"
         aria-label="Close"
         onclick={(e) => { if (e.target === e.currentTarget) { chooserOpen = false; query = ""; } }}
         onkeydown={(e) => { if (e.key === "Escape") { chooserOpen = false; query = ""; } }}>
        <div class="dialog" role="dialog" aria-label="Add item">
            <div class="dialog-header">
                <input class="search" type="text" placeholder="Search items…"
                       bind:this={inputEl} bind:value={query} onkeydown={handleKey}
                       spellcheck="false"/>
                <button class="close" title="Close" onclick={() => { chooserOpen = false; query = ""; }}>×</button>
            </div>
            <div class="dialog-grid">
                {#if filtered.length === 0}
                    <div class="empty">{availableItems.length === 0 ? "All items added" : "No matches"}</div>
                {:else}
                    {#each filtered as item (item.value)}
                        <button class="pick-card" onclick={() => pick(item.value)}>
                            <div class="icon-wrap">
                                {#if item.icon}
                                    <img class="icon" src={item.icon} alt={item.name} data-name={item.name} onerror={handleIconError}/>
                                {:else}
                                    <span class="placeholder">?</span>
                                {/if}
                            </div>
                            <div class="name" title={item.name}>{item.name}</div>
                        </button>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    .grid {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .card {
        position: relative;
        width: 88px;
        min-height: 96px;
        background: color-mix(in srgb, var(--clickgui-base-color) 18%, transparent);
        border: 1px solid color-mix(in srgb, var(--accent-color) 18%, transparent);
        border-radius: 4px;
        padding: 22px 6px 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        cursor: grab;
        transition: border-color 0.15s, transform 0.1s, opacity 0.15s;
        border-left: 2px solid transparent;
        border-right: 2px solid transparent;

        &:hover {
            border-color: color-mix(in srgb, var(--accent-color) 50%, transparent);
            .footer { opacity: 1; }
        }
        &:active { cursor: grabbing; }
        &.dragging { opacity: 0.4; }
        &.drop-before { border-left-color: var(--accent-color); }
        &.drop-after { border-right-color: var(--accent-color); }
    }

    .ordinal {
        position: absolute;
        top: 4px;
        left: 4px;
        font-size: 9px;
        font-weight: 700;
        color: white;
        background: var(--accent-color);
        border-radius: 3px;
        padding: 1px 5px;
        line-height: 1;
    }

    .icon-wrap {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon {
        width: 32px;
        height: 32px;
        image-rendering: pixelated;
    }

    .placeholder {
        color: color-mix(in srgb, var(--clickgui-text-color) 40%, transparent);
        font-size: 24px;
    }

    .name {
        color: var(--clickgui-text-color);
        font-size: 10px;
        text-align: center;
        line-height: 1.2;
        max-width: 100%;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-around;
        padding: 3px 4px;
        background: color-mix(in srgb, #000 60%, transparent);
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        opacity: 0;
        transition: opacity 0.15s;
        cursor: default;
    }

    .ctrl {
        background: none;
        border: none;
        color: var(--accent-color);
        cursor: pointer;
        font-size: 10px;
        line-height: 1;
        padding: 2px 4px;
        border-radius: 2px;
        transition: background 0.15s;

        &:hover:not(:disabled) { background: color-mix(in srgb, var(--accent-color) 25%, transparent); }
        &:disabled { opacity: 0.25; cursor: not-allowed; }
        &.remove { color: #ff8a80; }
    }

    .add {
        cursor: pointer;
        color: var(--accent-color);
        border-style: dashed;
        justify-content: center;

        .plus { font-size: 28px; line-height: 1; }
        .add-label { font-size: 10px; }
        &:hover { background: var(--clickgui-button-hover-background-color); }
    }

    .overlay {
        position: fixed;
        inset: 0;
        background: color-mix(in srgb, #000 65%, transparent);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fade-in 0.12s ease-out;
    }

    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .dialog {
        width: min(640px, 90vw);
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        background: var(--clickgui-base-color, #1a1a22);
        border: 1px solid color-mix(in srgb, var(--accent-color) 40%, transparent);
        border-radius: 6px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        overflow: hidden;
    }

    .dialog-header {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 10px 12px;
        border-bottom: 1px solid color-mix(in srgb, var(--accent-color) 20%, transparent);
    }

    .search {
        flex: 1;
        background: color-mix(in srgb, #000 30%, transparent);
        border: 1px solid color-mix(in srgb, var(--accent-color) 30%, transparent);
        color: var(--clickgui-text-color);
        font-family: "Inter", sans-serif;
        font-size: 13px;
        padding: 6px 10px;
        border-radius: 3px;
        outline: none;

        &:focus { border-color: var(--accent-color); }
        &::placeholder { color: color-mix(in srgb, var(--clickgui-text-color) 50%, transparent); }
    }

    .close {
        background: none;
        border: none;
        color: var(--clickgui-text-color);
        font-size: 20px;
        line-height: 1;
        padding: 0 8px;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.15s;

        &:hover { opacity: 1; }
    }

    .dialog-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
        gap: 6px;
        padding: 12px;
        overflow-y: auto;
    }

    .pick-card {
        background: color-mix(in srgb, var(--clickgui-base-color) 18%, transparent);
        border: 1px solid color-mix(in srgb, var(--accent-color) 18%, transparent);
        border-radius: 4px;
        padding: 10px 6px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        color: var(--clickgui-text-color);
        transition: border-color 0.12s, background 0.12s, transform 0.08s;

        &:hover {
            border-color: var(--accent-color);
            background: color-mix(in srgb, var(--accent-color) 12%, transparent);
            transform: translateY(-1px);
        }

        .name {
            font-size: 10px;
        }
    }

    .empty {
        grid-column: 1 / -1;
        font-size: 12px;
        opacity: 0.6;
        padding: 20px;
        text-align: center;
    }
</style>
