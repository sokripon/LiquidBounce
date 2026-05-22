<script lang="ts">
    import type {NamedItem} from "../../../../integration/types";
    import {itemTextureUrl} from "../../../../integration/rest";
    import {SvelteSet} from "svelte/reactivity";

    interface Props {
        items: NamedItem[];
        addLabel?: string;
        onmove: (value: string, delta: number) => void;
        onremove: (value: string) => void;
        onadd: () => void;
    }

    let {items, addLabel = "Add Item", onmove, onremove, onadd}: Props = $props();

    const fallbackIcons = new SvelteSet<string>();

    function showFallbackIcon(value: string, event: Event) {
        fallbackIcons.add(value);
        (event.currentTarget as HTMLImageElement).src = itemTextureUrl("minecraft:grass_block");
    }

    function handleRemove(value: string) {
        fallbackIcons.delete(value);
        onremove(value);
    }
</script>

<div class="ordered-list">
    {#each items as item, index (item.value)}
        <div class="item-row">
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
