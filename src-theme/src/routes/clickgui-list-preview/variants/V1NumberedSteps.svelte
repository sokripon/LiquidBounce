<!--
  Variant 1 — Numbered Steps
  Vertical timeline / recipe-style. Each step has a circular accent badge
  showing its 1-based ordinal, connected by a faint rail. Items are big and
  scannable. Best when the order itself carries the semantic meaning.
-->
<script lang="ts">
    import type {NamedItem} from "../../../integration/types";
    import {SortableList} from "@jhubbardsf/svelte-sortablejs";
    import type {SortableEvent} from "sortablejs";
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

    let {items, availableItems, addLabel = "Add Step", onmove, onreorder, onremove, onselect}: Props = $props();

    function handleSort(e: SortableEvent) {
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

<div class="steps">
    <div class="sortable-role-wrap" role="list">
    <SortableList class="steps-rows" onSort={handleSort} animation={150}
                  forceFallback={true} draggable=".step">
        {#each items as item, index (item.value)}
            <div class="step" class:last={index === items.length - 1 && !chooser.open} role="listitem">
                <div class="badge">{index + 1}</div>
                <div class="body">
                    {#if item.icon}
                        <ItemIcon src={item.icon} size={22}/>
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
    </SortableList>
    {#if chooser.open}
        <div class="step ghost" role="listitem">
            <div class="badge ghost-badge">{items.length + 1}</div>
            <div class="body chooser-body">
                <input class="search" type="text" placeholder="Search to add a step…"
                       bind:this={inputEl}
                       value={chooser.query}
                       oninput={(e) => chooser.setQuery(e.currentTarget.value)}
                       onkeydown={chooser.handleKey}
                       spellcheck="false"/>
                <button class="ctrl" title="Close" onclick={chooser.hide}>×</button>
            </div>
        </div>
    {/if}
    </div>
    {#if chooser.open}
        {#if chooser.filtered.length === 0}
            <div class="empty">{chooser.emptyMessage}</div>
        {:else}
            <div class="results">
                {#each chooser.filtered as item (item.value)}
                    <button class="result" onclick={() => chooser.pick(item.value)}>
                        {#if item.icon}
                            <ItemIcon src={item.icon} size={22}/>
                        {/if}
                        <span class="name">{item.name}</span>
                    </button>
                {/each}
            </div>
        {/if}
    {:else}
        <button class="add" onclick={chooser.show}>+ {addLabel}</button>
    {/if}
</div>

<style lang="scss">
    .steps {
        display: flex;
        flex-direction: column;
        gap: 6px;
        position: relative;
    }

    .sortable-role-wrap { display: contents; }

    :global(.steps-rows) {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .step {
        display: flex;
        align-items: stretch;
        gap: 10px;
        position: relative;
        cursor: grab;

        &:active { cursor: grabbing; }

        &::before {
            content: "";
            position: absolute;
            left: 11px;
            top: 28px;
            bottom: -8px;
            width: 2px;
            background: color-mix(in srgb, var(--accent-color) 30%, transparent);
        }
        &.last::before { display: none; }
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
        &.remove { color: var(--clickgui-selection-chip-remove-color); }
    }

    .add {
        margin-left: 34px;
        font-family: monospace;
        font-size: 12px;
        color: var(--clickgui-text-color);
        background-color: var(--clickgui-button-background-color);
        border: none;
        padding: 6px 10px;
        border-radius: 3px;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover { background-color: var(--clickgui-button-hover-background-color); }
    }

    .ghost {
        cursor: default;
        &::before { display: none; }
    }
    .ghost .badge.ghost-badge {
        background: color-mix(in srgb, var(--accent-color) 40%, transparent);
    }

    .chooser-body {
        gap: 4px;
        padding: 2px 4px 2px 8px;
        background-color: var(--clickgui-input-background-color);
        border: none;
        border-bottom: 1px solid var(--accent-color);
        border-radius: 3px;
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

        &::placeholder { color: var(--clickgui-text-dimmed-color); }
    }

    .results {
        margin-left: 34px;
        display: flex;
        flex-direction: column;
        gap: 2px;
        max-height: 180px;
        overflow-y: auto;
        background-color: var(--clickgui-input-background-color);
        border-bottom: 1px solid var(--accent-color);
        border-radius: 3px;
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
        color: var(--clickgui-text-dimmed-color);
        padding: 6px 4px;
    }
</style>
