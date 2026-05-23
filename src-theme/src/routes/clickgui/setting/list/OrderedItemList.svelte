<script lang="ts">
    import type {NamedItem} from "../../../../integration/types";
    import {SortableList} from "@jhubbardsf/svelte-sortablejs";
    import ItemIcon from "./ItemIcon.svelte";
    import RemoveButton from "../common/RemoveButton.svelte";
    import SettingButton from "../common/SettingButton.svelte";

    interface Props {
        items: NamedItem[];
        addLabel?: string;
        onmove: (value: string, delta: number) => void;
        onreorder: (fromIndex: number, toIndex: number) => void;
        onremove: (value: string) => void;
        onadd: () => void;
    }

    let {items, addLabel = "Add Item", onmove, onreorder, onremove, onadd}: Props = $props();

    function handleSort(e: any) {
        const from = e.oldIndex, to = e.newIndex;
        if (typeof from === "number" && typeof to === "number" && from !== to) {
            onreorder(from, to);
        }
    }
</script>

<div class="ordered-list">
    <div class="results">
    <div class="sortable-role-wrap" role="list">
    <SortableList class="ordered-list-rows" onSort={handleSort} animation={150}
                  forceFallback={true} draggable=".item-row">
        {#each items as item, index (item.value)}
            <div class="item-row" class:has-icon={item.icon !== undefined} role="listitem">
                <span class="drag-handle" aria-hidden="true">
                    <span class="dot"></span><span class="dot"></span>
                    <span class="dot"></span><span class="dot"></span>
                    <span class="dot"></span><span class="dot"></span>
                </span>
                {#if item.icon}
                    <ItemIcon src={item.icon} alt={item.value} size={20}/>
                {/if}
                <div class="name">{item.name}</div>
                <div class="controls">
                    <div class="arrow-column">
                        {#if index > 0}
                            <button class="arrow-btn" onclick={() => onmove(item.value, -1)} title="Move up" aria-label="Move up">▲</button>
                        {:else}
                            <span class="arrow-placeholder" aria-hidden="true"></span>
                        {/if}
                        {#if index < items.length - 1}
                            <button class="arrow-btn" onclick={() => onmove(item.value, 1)} title="Move down" aria-label="Move down">▼</button>
                        {:else}
                            <span class="arrow-placeholder" aria-hidden="true"></span>
                        {/if}
                    </div>
                    <RemoveButton onclick={() => onremove(item.value)}/>
                </div>
            </div>
        {/each}
    </SortableList>
    </div>
    </div>
    <SettingButton label={addLabel} onclick={onadd}/>
</div>

<style lang="scss">
    .ordered-list {
        margin-bottom: 10px;
    }

    .results {
        max-height: 200px;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        margin-bottom: 5px;
    }

    .sortable-role-wrap { display: contents; }

    :global(.ordered-list-rows) {
        display: flex;
        flex-direction: column;
    }

    .item-row {
        display: grid;
        grid-template-columns: max-content 1fr max-content;
        align-items: center;
        column-gap: 5px;
        margin: 2px 5px 2px 0;
        cursor: grab;
        border-radius: 3px;
        transition: background-color 0.15s ease;

        &.has-icon {
            grid-template-columns: max-content max-content 1fr max-content;
        }

        &:hover {
            background-color: rgba(255, 255, 255, 0.05);
        }

        &:active {
            cursor: grabbing;
        }
    }

    .drag-handle {
        display: grid;
        grid-template-columns: repeat(2, 3px);
        grid-auto-rows: 3px;
        gap: 2px;
        padding: 0 4px;
        opacity: 0.4;
        cursor: grab;
        user-select: none;

        .dot {
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background-color: var(--clickgui-text-color);
        }
    }

    .item-row:hover .drag-handle {
        opacity: 0.7;
    }

    .name {
        font-size: 12px;
        color: var(--clickgui-text-color);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .controls {
        display: flex;
        align-items: center;
        gap: 3px;
        cursor: default;
    }

    .arrow-column {
        display: flex;
        flex-direction: column;
    }

    .arrow-btn {
        background: none;
        border: none;
        color: color-mix(in srgb, var(--clickgui-text-color) 60%, transparent);
        cursor: pointer;
        font-size: 9px;
        line-height: 1;
        padding: 1px 4px;
        transition: color 0.15s ease;

        &:hover {
            color: var(--accent-color);
        }
    }

    .arrow-placeholder {
        display: block;
        height: 11px;
        width: 17px;
    }
</style>

