<script lang="ts">
    import {untrack} from "svelte";
    import {slide} from "svelte/transition";
    import type {ListSetting, ModuleSetting, NamedItem} from "../../../../integration/types";
    import VirtualList from "../list/VirtualList.svelte";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../../theme/theme_config";
    import ExpandArrow from "../common/ExpandArrow.svelte";
    import {setItem} from "../../../../integration/persistent_storage";
    import ListItem from "./ListItem.svelte";
    import {filterItems} from "./filterItems";

    interface Props {
        setting: ModuleSetting;
        path: string;
        items: NamedItem[];
        onchange?: () => void;
    }

    let {setting = $bindable(), path, items, onchange}: Props = $props();

    const cSetting = $derived(setting as ListSetting);
    const thisPath = $derived(`${path}.${cSetting.name}`);

    let searchQuery = $state("");
    let expanded = $state(untrack(() => localStorage.getItem(`${path}.${(setting as ListSetting).name}`) === "true"));

    $effect(() => {
        setItem(thisPath, expanded.toString());
    });

    const renderedItems = $derived(filterItems(items, searchQuery));

    function handleItemToggle(detail: {value: string; enabled: boolean}) {
        const newValue = detail.enabled
            ? [...cSetting.value, detail.value]
            : cSetting.value.filter(b => b !== detail.value);
        setting = {...cSetting, value: newValue};
        onchange?.();
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
            <input type="text" placeholder="Search" class="search-input" bind:value={searchQuery} spellcheck="false">
            <div class="results">
                <VirtualList items={renderedItems}>
                    {#snippet item(item)}
                        <ListItem value={item.value} name={item.name} icon={item.icon}
                                enabled={cSetting.value.includes(item.value)} ontoggle={handleItemToggle}/>
                    {/snippet}
                </VirtualList>
            </div>
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

  .results {
    height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 100px;
    max-height: 500px;
    position: relative;
  }

  .search-input {
    width: 100%;
    border: none;
    border-bottom: solid 1px var(--accent-color);
    font-family: "Inter", sans-serif;
    font-size: 12px;
    padding: 5px;
    color: var(--clickgui-text-color);
    margin-bottom: 5px;
    background-color: var(--clickgui-input-background-color);
  }
</style>
