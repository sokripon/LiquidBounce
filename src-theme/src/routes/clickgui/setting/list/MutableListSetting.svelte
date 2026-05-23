<script lang="ts">
    import type {ListSetting, ModuleSetting} from "../../../../integration/types";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../../theme/theme_config";
    import RemoveButton from "../common/RemoveButton.svelte";
    import SettingButton from "../common/SettingButton.svelte";

    interface Props {
        setting: ModuleSetting;
        onchange?: () => void;
    }

    let {setting = $bindable(), onchange}: Props = $props();

    const cSetting = $derived(setting as ListSetting);

    function commit(newValue: string[]) {
        setting = {...cSetting, value: newValue};
        onchange?.();
    }

    function updateAt(index: number, next: string) {
        const newValue = [...cSetting.value];
        newValue[index] = next;
        commit(newValue);
    }

    function removeAt(index: number) {
        commit(cSetting.value.filter((_, i) => i !== index));
    }

    function addEmpty() {
        commit(["", ...cSetting.value]);
    }
</script>

<div class="setting">
    <div class="name">{$spaceSeperatedNames ? convertToSpacedString(cSetting.name) : cSetting.name}</div>
    <SettingButton label="Add value" onclick={addEmpty}/>
    {#if cSetting.value.length > 0}
        <div class="inputs">
            {#each cSetting.value as value, index (index)}
                <div class="input-wrapper">
                    <input type="text" class="value" spellcheck="false" placeholder={cSetting.name}
                           {value}
                           oninput={(e) => updateAt(index, (e.currentTarget as HTMLInputElement).value)}>
                    <RemoveButton onclick={() => removeAt(index)}/>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">

  .input-wrapper {
    display: grid;
    grid-template-columns: 1fr max-content;
    column-gap: 5px;
    align-items: center;
  }

  .setting {
    padding: 7px 0px;
  }

  .inputs {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    margin-top: 5px;
  }

  .name {
    font-weight: 500;
    color: var(--clickgui-text-color);
    font-size: 12px;
    margin-bottom: 5px;
  }

  .value {
    width: 100%;
    background-color: var(--clickgui-input-background-color);
    font-family: monospace;
    font-size: 12px;
    color: var(--clickgui-text-color);
    border: none;
    border-bottom: solid 2px var(--clickgui-input-border-color);
    padding: 6px;
    border-radius: 3px;
    transition: ease border-color .2s;

    &::-webkit-scrollbar {
      background-color: transparent;
    }
  }
</style>
