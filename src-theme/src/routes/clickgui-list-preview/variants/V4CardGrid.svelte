<!--
  Variant 4 — Card Grid
  Items render as cards in a wrap-flow grid. Larger icon top, name below.
  Controls live in a hover-revealed footer to keep the resting state quiet.
  Drag a card to reorder. Good when icons are the primary recognition cue.
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

    let {items, availableItems, addLabel = "Add Item", onmove, onreorder, onremove, onselect}: Props = $props();

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

<div class="grid-wrap" role="list">
    <SortableList class="card-grid-list" onSort={handleSort} animation={150}
                  forceFallback={true} draggable=".card">
        {#each items as item, index (item.value)}
            <div class="card" role="listitem">
                <span class="ordinal">{index + 1}</span>
                <div class="icon-wrap">
                    <ItemIcon src={item.icon} alt={item.name} size={32} placeholder/>
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
    </SortableList>
    <button class="card add" onclick={chooser.show}>
        <span class="plus">+</span>
        <span class="add-label">{addLabel}</span>
    </button>
</div>
{#if chooser.open}
    <div class="overlay"
         role="button"
         tabindex="-1"
         aria-label="Close"
         onclick={(e) => { if (e.target === e.currentTarget) chooser.hide(); }}
         onkeydown={(e) => { if (e.key === "Escape") chooser.hide(); }}>
        <div class="dialog" role="dialog" aria-label="Add item">
            <div class="dialog-header">
                <input class="search" type="text" placeholder="Search items…"
                       bind:this={inputEl}
                       value={chooser.query}
                       oninput={(e) => chooser.setQuery(e.currentTarget.value)}
                       onkeydown={chooser.handleKey}
                       spellcheck="false"/>
                <button class="close" title="Close" onclick={chooser.hide}>×</button>
            </div>
            <div class="dialog-grid">
                {#if chooser.filtered.length === 0}
                    <div class="empty">{chooser.emptyMessage}</div>
                {:else}
                    {#each chooser.filtered as item (item.value)}
                        <button class="pick-card" onclick={() => chooser.pick(item.value)}>
                            <div class="icon-wrap">
                                <ItemIcon src={item.icon} alt={item.name} size={32} placeholder/>
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
    .grid-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    :global(.card-grid-list) {
        display: contents;
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
        transition: border-color 0.15s, transform 0.1s;

        &:hover {
            border-color: color-mix(in srgb, var(--accent-color) 50%, transparent);
            .footer { opacity: 1; }
        }
        &:active { cursor: grabbing; }
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
        &.remove { color: var(--clickgui-selection-chip-remove-color); }
    }

    .add {
        cursor: pointer;
        color: var(--accent-color);
        justify-content: center;

        .plus { font-size: 28px; line-height: 1; }
        .add-label { font-size: 10px; }
        &:hover { background-color: var(--clickgui-button-hover-background-color); }
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
        background-color: var(--clickgui-window-background-color);
        border-radius: 5px;
        box-shadow: 0 0 10px var(--clickgui-window-shadow-color);
        overflow: hidden;
    }

    .dialog-header {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 12px 16px;
        background-color: var(--clickgui-window-header-background-color);
        border-bottom: 2px solid var(--clickgui-window-header-border-color);
    }

    .search {
        flex: 1;
        background-color: var(--clickgui-input-background-color);
        border: none;
        border-bottom: 1px solid var(--accent-color);
        color: var(--clickgui-text-color);
        font-family: "Inter", sans-serif;
        font-size: 13px;
        padding: 6px 10px;
        border-radius: 3px;
        outline: none;

        &::placeholder { color: var(--clickgui-text-dimmed-color); }
    }

    .close {
        background: none;
        border: none;
        color: var(--clickgui-text-dimmed-color);
        font-size: 20px;
        line-height: 1;
        padding: 0 8px;
        cursor: pointer;
        transition: color 0.15s;

        &:hover { color: var(--clickgui-text-color); }
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
