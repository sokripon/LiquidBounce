<!--
  Variant 3 — Hotbar Slots
  Minecraft hotbar inspired. Fixed-size square slots in a horizontal row,
  prominent icon, slot number overlay top-left. Empty `+` slot at the end.
  Hover reveals name tooltip + remove button. Drag a slot to reorder.
-->
<script lang="ts">
    import type {NamedItem} from "../../../integration/types";
    import {createDragReorder} from "../dragReorder.svelte";

    interface Props {
        items: NamedItem[];
        addLabel?: string;
        onmove: (value: string, delta: number) => void;
        onreorder: (fromIndex: number, toIndex: number) => void;
        onremove: (value: string) => void;
        onadd: () => void;
    }

    let {items, addLabel = "Add", onmove: _onmove, onreorder, onremove, onadd}: Props = $props();

    const dnd = createDragReorder({onreorder, axis: "horizontal"});
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
    <button class="slot add" onclick={onadd} title={addLabel}>+</button>
</div>

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
        background: #b71c1c;
        color: white;
        border: 1px solid color-mix(in srgb, #000 50%, transparent);
        cursor: pointer;
        font-size: 12px;
        line-height: 1;
        padding: 0;
        opacity: 0;
        transition: opacity 0.15s;
    }

    .slot:hover .remove { opacity: 1; }

    .add {
        background: var(--clickgui-button-background-color);
        color: var(--accent-color);
        font-size: 20px;
        border: 2px dashed color-mix(in srgb, var(--accent-color) 40%, transparent);
        cursor: pointer;

        &:hover { background: var(--clickgui-button-hover-background-color); }
    }
</style>
