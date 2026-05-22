<script lang="ts">
    import type {NamedItem} from "../../../../integration/types";
    import {itemTextureUrl} from "../../../../integration/rest";
    import {SvelteSet} from "svelte/reactivity";

    interface Props {
        items: NamedItem[];
        addLabel?: string;
        onmove: (value: string, delta: number) => void;
        onreorder: (fromIndex: number, toIndex: number) => void;
        onremove: (value: string) => void;
        onadd: () => void;
    }

    let {items, addLabel = "Add Item", onmove, onreorder, onremove, onadd}: Props = $props();

    const fallbackIcons = new SvelteSet<string>();

    let draggingIndex = $state<number | null>(null);
    let dropIndex = $state<number | null>(null);

    function showFallbackIcon(value: string, event: Event) {
        fallbackIcons.add(value);
        (event.currentTarget as HTMLImageElement).src = itemTextureUrl("minecraft:grass_block");
    }

    function handleRemove(value: string) {
        fallbackIcons.delete(value);
        onremove(value);
    }

    function handleDragStart(index: number, event: DragEvent) {
        draggingIndex = index;
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            // Required by Firefox to initiate a drag.
            event.dataTransfer.setData("text/plain", String(index));
        }
    }

    function handleDragOver(index: number, event: DragEvent) {
        if (draggingIndex === null) return;
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
        const target = event.currentTarget as HTMLElement;
        const {top, height} = target.getBoundingClientRect();
        const after = event.clientY > top + height / 2;
        dropIndex = after ? index + 1 : index;
    }

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        if (draggingIndex !== null && dropIndex !== null) {
            // When dragging down, the slice after the removed item shifts left by one.
            let target = dropIndex;
            if (target > draggingIndex) target -= 1;
            if (target !== draggingIndex) {
                onreorder(draggingIndex, target);
            }
        }
        draggingIndex = null;
        dropIndex = null;
    }

    function handleDragEnd() {
        draggingIndex = null;
        dropIndex = null;
    }
</script>

<div class="ordered-list" role="list">
    {#each items as item, index (item.value)}
        <div class="item-row"
             role="listitem"
             class:dragging={draggingIndex === index}
             class:drop-before={dropIndex === index && draggingIndex !== index && draggingIndex !== index - 1}
             class:drop-after={dropIndex === index + 1 && draggingIndex !== index && draggingIndex !== index + 1}
             draggable="true"
             ondragstart={(event) => handleDragStart(index, event)}
             ondragover={(event) => handleDragOver(index, event)}
             ondrop={handleDrop}
             ondragend={handleDragEnd}>
            <span class="drag-handle" aria-hidden="true">⋮⋮</span>
            {#if item.icon}
                <img class="icon" class:fallback={fallbackIcons.has(item.value)}
                     src={item.icon} alt={item.value}
                     onerror={(event) => showFallbackIcon(item.value, event)}/>
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
                <button class="button-remove" title="Remove" onclick={() => handleRemove(item.value)}>
                    <img src="img/clickgui/icon-cross.svg" alt="remove">
                </button>
            </div>
        </div>
    {/each}
    <button class="add-btn" onclick={onadd}>{addLabel}</button>
</div>

<style lang="scss">
    .ordered-list {
        margin-bottom: 10px;
    }

    .item-row {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px;
        background-color: color-mix(in srgb, var(--clickgui-base-color) 10%, transparent);
        border-radius: 3px;
        margin-bottom: 5px;
        cursor: grab;
        border-top: 2px solid transparent;
        border-bottom: 2px solid transparent;
        transition: opacity 0.15s ease;

        &:active {
            cursor: grabbing;
        }

        &.dragging {
            opacity: 0.4;
        }

        &.drop-before {
            border-top-color: var(--accent-color);
        }

        &.drop-after {
            border-bottom-color: var(--accent-color);
        }

        .drag-handle {
            color: color-mix(in srgb, var(--clickgui-text-color) 40%, transparent);
            font-size: 12px;
            line-height: 1;
            letter-spacing: -2px;
            user-select: none;
            padding: 0 2px;
        }

        .icon {
            height: 20px;
            width: 20px;

            &.fallback {
                filter: grayscale(1);
            }
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

        .button-remove {
            background-color: transparent;
            border: none;
            cursor: pointer;
            padding: 2px 5px;
        }
    }

    .add-btn {
        font-family: monospace;
        font-size: 12px;
        color: var(--clickgui-text-color);
        background-color: var(--clickgui-button-background-color);
        border: none;
        padding: 6px 10px;
        border-radius: 3px;
        width: 100%;
        cursor: pointer;
        transition: ease background-color .2s;

        &:hover {
            background-color: var(--clickgui-button-hover-background-color);
        }
    }
</style>
