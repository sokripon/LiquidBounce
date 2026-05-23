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

<div class="ordered-list" role="list">
    <SortableList class="ordered-list-rows" onSort={handleSort} animation={150}
                  forceFallback={true} draggable=".item-row">
        {#each items as item, index (item.value)}
            <div class="item-row" role="listitem">
                <span class="drag-handle" aria-hidden="true">⋮⋮</span>
                {#if item.icon}
                    <ItemIcon src={item.icon} alt={item.value} size={20}/>
                {/if}
                <div class="name">{item.name}</div>
                <div class="controls">
                    <div class="arrow-column">
                        {#if index > 0}
                            <button class="arrow-btn" onclick={() => onmove(item.value, -1)} title="Move up">▲</button>
                        {:else}
                            <span class="arrow-placeholder"></span>
                        {/if}
                        {#if index < items.length - 1}
                            <button class="arrow-btn" onclick={() => onmove(item.value, 1)} title="Move down">▼</button>
                        {:else}
                            <span class="arrow-placeholder"></span>
                        {/if}
                    </div>
                    <RemoveButton onclick={() => onremove(item.value)}/>
                </div>
            </div>
        {/each}
    </SortableList>
    <SettingButton label={addLabel} onclick={onadd}/>
</div>

<style lang="scss">
    .ordered-list {
        margin-bottom: 10px;
    }

    :global(.ordered-list-rows) {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-bottom: 5px;
    }

    .item-row {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px;
        background-color: color-mix(in srgb, var(--clickgui-base-color) 10%, transparent);
        border-radius: 3px;
        cursor: grab;

        &:active {
            cursor: grabbing;
        }

        .drag-handle {
            color: color-mix(in srgb, var(--clickgui-text-color) 40%, transparent);
            font-size: 12px;
            line-height: 1;
            letter-spacing: -2px;
            user-select: none;
            padding: 0 2px;
        }

        .name {
            flex: 1;
            color: var(--clickgui-text-color);
            font-size: 12px;
        }

        .controls {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: default;
        }

        .arrow-column {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .arrow-btn {
            background: none;
            border: none;
            color: var(--accent-color);
            cursor: pointer;
            font-size: 14px;
            padding: 0 5px;
            line-height: 1;
            transition: color 0.2s;

            &:hover {
                color: color-mix(in srgb, var(--accent-color) 80%, white);
            }
        }

        .arrow-placeholder {
            display: block;
            height: 14px;
            width: 10px;
            visibility: hidden;
        }
    }
</style>

