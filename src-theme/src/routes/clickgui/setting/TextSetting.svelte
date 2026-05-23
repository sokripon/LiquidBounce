<script lang="ts">
    import type {ModuleSetting, TextSetting,} from "../../../integration/types";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../theme/theme_config";
    import {setTyping} from "../../../integration/rest";

    interface Props {
        setting: ModuleSetting;
        onchange?: () => void;
    }

    let {setting = $bindable(), onchange}: Props = $props();

    const cSetting = $derived(setting as TextSetting);

    function handleChange() {
        setting = {...cSetting};
        onchange?.();
    }
</script>

<div class="setting">
    <div class="name">{$spaceSeperatedNames ? convertToSpacedString(cSetting.name) : cSetting.name}</div>
    <input type="text" class="value" spellcheck="false"
           placeholder={$spaceSeperatedNames ? convertToSpacedString(cSetting.name) : cSetting.name}
           bind:value={cSetting.value}
           oninput={handleChange}
           onfocusin={async () => await setTyping(true)}
           onfocusout={async () => await setTyping(false)}
    >
</div>

<style lang="scss">

  .setting {
    padding: 7px 0px;
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
    padding: 5px;
    border-radius: 3px;
    transition: ease border-color .2s;

    &::-webkit-scrollbar {
      background-color: transparent;
    }
  }
</style>
