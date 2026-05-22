<script lang="ts">
    import {createEventDispatcher, onMount, untrack} from "svelte";
    import {slide} from "svelte/transition";
    import type {
        ModuleSetting,
        NamedItem,
        RegistryMutableListSetting
    } from "../../../../integration/types";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../../theme/theme_config";
    import {getRegistryItems} from "../../../../integration/rest";
    import {setItem} from "../../../../integration/persistent_storage";
    import ExpandArrow from "../common/ExpandArrow.svelte";
    import OrderedItemList from "./OrderedItemList.svelte";
    import SearchableItemChooser from "./SearchableItemChooser.svelte";

    interface Props {
        setting: ModuleSetting;
        path: string;
    }

    let {setting = $bindable(), path}: Props = $props();

    const cSetting = $derived(setting as RegistryMutableListSetting);
    const thisPath = $derived(`${path}.${cSetting.name}`);

    // Boundary-compatible event for the legacy GenericSetting parent (`on:change`).
    const dispatch = createEventDispatcher();

    let allItems = $state<NamedItem[]>([]);
    let expanded = $state(untrack(() => localStorage.getItem(thisPath) === "true"));
    let showChooser = $state(false);

    onMount(async () => {
        const registryItems = await getRegistryItems(cSetting.registry);
        allItems = Object.entries(registryItems)
            .map(([identifier, item]) => ({
                value: identifier,
                name: item.name,
                icon: item.icon
            }) as NamedItem)
            .sort((a, b) => a.value.localeCompare(b.value));

        // Drop ids that are no longer in the registry (e.g. mod uninstalled).
        // Without this, stale ids would occupy invisible positions in cSetting.value
        // and silently break move() against neighbouring visible items.
        const known = new Set(allItems.map(item => item.value));
        const pruned = cSetting.value.filter(value => known.has(value));
        if (pruned.length !== cSetting.value.length) {
            commitChange(pruned);
        }
    });

    $effect(() => {
        setItem(thisPath, expanded.toString());
    });

    const itemsByValue = $derived(new Map(allItems.map(item => [item.value, item])));

    const selectedItems = $derived(
        cSetting.value
            .map(id => itemsByValue.get(id))
            .filter((item): item is NamedItem => item !== undefined)
    );

    const availableItems = $derived.by(() => {
        const selected = new Set(cSetting.value);
        return allItems.filter(item => !selected.has(item.value));
    });

    function commitChange(newValue: string[]) {
        setting = {...cSetting, value: newValue};
        dispatch("change");
    }

    function handleAdd(detail: {value: string}) {
        commitChange([...cSetting.value, detail.value]);
    }

    function handleRemove(value: string) {
        commitChange(cSetting.value.filter(v => v !== value));
    }

    function move(value: string, delta: number) {
        const index = cSetting.value.indexOf(value);
        const target = index + delta;
        if (index < 0 || target < 0 || target >= cSetting.value.length) return;
        const newValue = [...cSetting.value];
        [newValue[index], newValue[target]] = [newValue[target], newValue[index]];
        commitChange(newValue);
    }

    function reorder(fromIndex: number, toIndex: number) {
        if (fromIndex === toIndex) return;
        if (fromIndex < 0 || fromIndex >= cSetting.value.length) return;
        if (toIndex < 0 || toIndex >= cSetting.value.length) return;
        const newValue = [...cSetting.value];
        const [moved] = newValue.splice(fromIndex, 1);
        newValue.splice(toIndex, 0, moved);
        commitChange(newValue);
    }

    function toggleExpanded(event: Event) {
        event.preventDefault();
        expanded = !expanded;
    }
</script>

<div class="setting">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="head" class:expanded oncontextmenu={toggleExpanded}>
        <div class="name">{$spaceSeperatedNames ? convertToSpacedString(cSetting.name) : cSetting.name}</div>
        <ExpandArrow bind:expanded/>
    </div>
    {#if expanded}
        <div in:slide|global={{duration: 200, axis: "y"}} out:slide|global={{duration: 200, axis: "y"}}>
            <OrderedItemList items={selectedItems}
                             onmove={move}
                             onreorder={reorder}
                             onremove={handleRemove}
                             onadd={() => showChooser = !showChooser}/>
            {#if showChooser}
                <SearchableItemChooser items={availableItems}
                                       onselect={handleAdd}
                                       onclose={() => showChooser = false}/>
            {/if}
        </div>
    {/if}
</div>

<style lang="scss">
    .setting {
        padding: 7px 0;
    }

    .head {
        display: flex;
        justify-content: space-between;
        transition: ease margin-bottom .2s;

        &.expanded {
            margin-bottom: 10px;
        }

        .name {
            color: var(--clickgui-text-color);
            font-size: 12px;
            font-weight: 600;
        }
    }
</style>
