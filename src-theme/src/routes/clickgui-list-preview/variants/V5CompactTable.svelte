<!--
  Variant 5 — Compact Table
  Dense data-grid feel: #, Icon, Name, Actions columns. Striped rows,
  hover highlight, monospace ordinals. Highest information density of all
  variants — great for power users with very long sequences.
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

    let {items, availableItems, addLabel = "Add Item", onmove, onreorder, onremove, onselect}: Props = $props();

    const dnd = createDragReorder({onreorder: (from, to) => onreorder(from, to), axis: "vertical"});
    let inputEl: HTMLInputElement | undefined = $state();
    const chooser = createItemChooser({
        availableItems: () => availableItems,
        inputEl: () => inputEl,
        onselect: (value) => onselect(value),
    });
</script>

<div class="table">
    <div class="thead">
        <span class="col-num">#</span>
        <span class="col-icon"></span>
        <span class="col-name">Item</span>
        <span class="col-actions">Actions</span>
    </div>
    <div class="tbody" role="list">
        {#each items as item, index (item.value)}
            <div class="trow {dnd.classesFor(index)}"
                 role="listitem"
                 {...dnd.attrs(index)}>
                <span class="col-num">{index + 1}</span>
                <span class="col-icon">
                    {#if item.icon}
                        <ItemIcon src={item.icon} size={18}/>
                    {/if}
                </span>
                <span class="col-name" title={item.name}>{item.name}</span>
                <span class="col-actions">
                    <button class="ctrl" disabled={index === 0} title="Move up"
                            onclick={() => onmove(item.value, -1)}>▲</button>
                    <button class="ctrl" disabled={index === items.length - 1} title="Move down"
                            onclick={() => onmove(item.value, 1)}>▼</button>
                    <button class="ctrl remove" title="Remove"
                            onclick={() => onremove(item.value)}>×</button>
                </span>
            </div>
        {/each}
    </div>
    {#if chooser.open}
        <div class="trow add-row">
            <span class="col-num">+</span>
            <span class="col-icon"></span>
            <input class="search col-name" type="text" placeholder="Search to add…"
                   bind:this={inputEl}
                   value={chooser.query}
                   oninput={(e) => chooser.setQuery(e.currentTarget.value)}
                   onkeydown={chooser.handleKey}
                   spellcheck="false"/>
            <span class="col-actions">
                <button class="ctrl remove" title="Close" onclick={chooser.hide}>×</button>
            </span>
        </div>
        <div class="dropdown">
            {#if chooser.filtered.length === 0}
                <div class="empty">{chooser.emptyMessage}</div>
            {:else}
                {#each chooser.filtered as item (item.value)}
                    <button class="drow" onclick={() => chooser.pick(item.value)}>
                        <span class="col-icon">
                            {#if item.icon}
                                <ItemIcon src={item.icon} size={18}/>
                            {/if}
                        </span>
                        <span class="col-name" title={item.name}>{item.name}</span>
                    </button>
                {/each}
            {/if}
        </div>
    {:else}
        <button class="add" onclick={chooser.show}>+ {addLabel}</button>
    {/if}
</div>

<style lang="scss">
    .table {
        border: 1px solid color-mix(in srgb, var(--accent-color) 18%, transparent);
        border-radius: 4px;
        overflow: hidden;
        background: color-mix(in srgb, var(--clickgui-base-color) 10%, transparent);
    }

    .thead, .trow {
        display: grid;
        grid-template-columns: 28px 24px 1fr auto;
        align-items: center;
        gap: 8px;
        padding: 4px 8px;
        font-size: 11px;
    }

    .thead {
        background-color: var(--clickgui-base-30-color);
        color: var(--clickgui-text-dimmed-color);
        font-weight: 500;
        font-size: 10px;
    }

    .trow {
        border-top: 1px solid color-mix(in srgb, var(--accent-color) 8%, transparent);
        cursor: grab;
        color: var(--clickgui-text-color);
        transition: background 0.12s, opacity 0.15s;
        border-bottom: 2px solid transparent;
        margin-top: -1px;

        &:hover { background: color-mix(in srgb, var(--accent-color) 10%, transparent); }
        &:active { cursor: grabbing; }
        &.dragging { opacity: 0.4; }
        &.drop-before { border-top-color: var(--accent-color); }
        &.drop-after { border-bottom-color: var(--accent-color); }
        &:nth-child(even) { background: color-mix(in srgb, #fff 2%, transparent); }
    }

    .col-num {
        font-family: monospace;
        color: color-mix(in srgb, var(--clickgui-text-color) 60%, transparent);
        text-align: right;
    }

    .col-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .col-actions {
        display: flex;
        gap: 2px;
        cursor: default;
    }

    .ctrl {
        background: none;
        border: none;
        color: var(--accent-color);
        cursor: pointer;
        font-size: 11px;
        line-height: 1;
        padding: 3px 5px;
        border-radius: 2px;
        transition: background 0.15s;

        &:hover:not(:disabled) { background: color-mix(in srgb, var(--accent-color) 22%, transparent); }
        &:disabled { opacity: 0.25; cursor: not-allowed; }
        &.remove { color: var(--clickgui-selection-chip-remove-color); }
    }

    .add {
        display: block;
        width: 100%;
        font-family: monospace;
        font-size: 11px;
        color: var(--accent-color);
        background-color: var(--clickgui-base-30-color);
        border: none;
        border-top: 1px solid var(--accent-color);
        padding: 6px 10px;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover { background-color: var(--clickgui-base-50-color); }
    }

    .add-row {
        background: color-mix(in srgb, var(--accent-color) 10%, transparent);
        cursor: text;

        &:hover { background: color-mix(in srgb, var(--accent-color) 10%, transparent); }

        .col-num {
            color: var(--accent-color);
            font-weight: 700;
        }
    }

    .search {
        background: transparent;
        border: none;
        outline: none;
        color: var(--clickgui-text-color);
        font-family: "Inter", sans-serif;
        font-size: 11px;
        padding: 0;
        width: 100%;

        &::placeholder { color: color-mix(in srgb, var(--clickgui-text-color) 50%, transparent); }
    }

    .dropdown {
        max-height: 160px;
        overflow-y: auto;
        background: color-mix(in srgb, #000 30%, transparent);
        border-top: 1px solid color-mix(in srgb, var(--accent-color) 18%, transparent);
    }

    .drow {
        display: grid;
        grid-template-columns: 28px 24px 1fr auto;
        align-items: center;
        gap: 8px;
        padding: 4px 8px;
        font-size: 11px;
        background: none;
        border: none;
        color: var(--clickgui-text-color);
        cursor: pointer;
        width: 100%;
        text-align: left;
        transition: background 0.12s;

        &::before {
            content: "";
        }

        &:hover { background: color-mix(in srgb, var(--accent-color) 18%, transparent); }
    }

    .empty {
        font-size: 11px;
        opacity: 0.6;
        padding: 8px;
        text-align: center;
    }
</style>
