<script lang="ts">
    import type {ChoiceSetting, ModuleSetting,} from "../../../integration/types";
    import ExpandArrow from "./common/ExpandArrow.svelte";
    import GenericSetting from "./common/GenericSetting.svelte";
    import {setItem} from "../../../integration/persistent_storage";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../theme/theme_config";
    import Dropdown from "./common/Dropdown.svelte";
    import {untrack} from "svelte";

    interface Props {
        setting: ModuleSetting;
        path: string;
        onchange?: () => void;
    }

    let {setting = $bindable(), path, onchange}: Props = $props();

    const cSetting = $derived(setting as ChoiceSetting);
    const thisPath = $derived(`${path}.${cSetting.name}`);
    const options = $derived(Object.keys(cSetting.choices));
    const nestedSettings = $derived(cSetting.choices[cSetting.active].value as ModuleSetting[]);

    let expanded = $state(untrack(() => localStorage.getItem(`${path}.${(setting as ChoiceSetting).name}`) === "true"));

    $effect(() => {
        setItem(thisPath, expanded.toString());
    });

    function handleChange() {
        setting = { ...cSetting };
        onchange?.();
    }

    function toggleExpanded(e: Event) {
        e.preventDefault();
        expanded = !expanded;
    }
</script>

<div class="setting">
    {#if nestedSettings.length > 0}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="head expand" class:expanded oncontextmenu={toggleExpanded}>
            <Dropdown
                bind:value={cSetting.active}
                {options}
                name={$spaceSeperatedNames ? convertToSpacedString(cSetting.name) : cSetting.name}
                onchange={handleChange}
            />
            <ExpandArrow bind:expanded />
        </div>
    {:else}
        <div class="head">
            <Dropdown
                bind:value={cSetting.active}
                {options}
                name={$spaceSeperatedNames ? convertToSpacedString(cSetting.name) : cSetting.name}
                onchange={handleChange}
            />
        </div>
    {/if}

    {#if expanded && nestedSettings.length > 0}
        <div class="nested-settings">
            {#each nestedSettings as nested, i (nested.name)}
                <GenericSetting path={thisPath} bind:setting={nestedSettings[i]} onchange={handleChange} />
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">

    .setting {
        padding: 7px 0px;

        .head {
          transition: ease margin-bottom .2s;

          &.expand {
              display: grid;
              grid-template-columns: 1fr max-content;
          }

          &.expanded {
              margin-bottom: 10px;
          }
        }
    }
    .nested-settings {
        border-left: solid 2px var(--clickgui-setting-group-border-color);
        padding-left: 7px;
    }
</style>
