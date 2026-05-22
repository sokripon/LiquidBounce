<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import type {ListSetting, ModuleSetting} from "../../../../integration/types";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../../theme/theme_config";

    interface Props {
        setting: ModuleSetting;
    }

    let {setting = $bindable()}: Props = $props();

    const cSetting = $derived(setting as ListSetting);

    // Boundary-compatible event for the legacy GenericSetting parent (`on:change`).
    const dispatch = createEventDispatcher();

    function commit(newValue: string[]) {
        setting = {...cSetting, value: newValue};
        dispatch("change");
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
    <button class="button-add" onclick={addEmpty}>Add value</button>
    {#if cSetting.value.length > 0}
        <div class="inputs">
            {#each cSetting.value as value, index (index)}
                <div class="input-wrapper">
                    <input type="text" class="value" spellcheck="false" placeholder={cSetting.name}
                           {value}
                           oninput={(e) => updateAt(index, (e.currentTarget as HTMLInputElement).value)}>
                    <button class="button-remove" title="Remove" onclick={() => removeAt(index)}>
                        <img src="img/clickgui/icon-cross.svg" alt="remove">
                    </button>
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

  .button-remove {
    background-color: transparent;
    border: none;
    cursor: pointer;
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

  .button-add {
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
