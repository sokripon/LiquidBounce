<script lang="ts">
    import type {KeySetting, ModuleSetting} from "../../../integration/types";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../theme/theme_config";
    import {getPrintableKeyName} from "../../../integration/rest";
    import {listen} from "../../../integration/ws";
    import type {KeyboardKeyEvent, MouseButtonEvent} from "../../../integration/events";
    import {isClickGuiScreen, UNKNOWN_KEY} from "../../../util/utils";

    interface Props {
        setting: ModuleSetting;
        onchange?: () => void;
    }

    let {setting = $bindable(), onchange}: Props = $props();

    const cSetting = $derived(setting as KeySetting);

    let isHovered = $state(false);
    let binding = $state(false);
    let printableKeyName = $state("");

    $effect(() => {
        if (cSetting.value !== UNKNOWN_KEY) {
            getPrintableKeyName(cSetting.value)
                .then(printableKey => {
                    printableKeyName = printableKey.localized;
                });
        }
    });

    async function toggleBinding() {
        if (binding) {
            cSetting.value = UNKNOWN_KEY;
        }

        binding = !binding;

        setting = {...cSetting};
        onchange?.();
    }

    listen("keyboardKey", async (e: KeyboardKeyEvent) => {
        if (!isClickGuiScreen(e.screen)) {
            return;
        }

        if (!binding) {
            return;
        }

        binding = false;

        if (e.keyCode !== 256) {
            cSetting.value = e.key;
        } else {
            cSetting.value = UNKNOWN_KEY;
        }

        setting = {...cSetting};
        onchange?.();
    });

    listen("mouseButton", async (e: MouseButtonEvent) => {
        if (!isClickGuiScreen(e.screen)) {
            return;
        }

        if (!binding || (e.button === 0 && isHovered)) {
            return;
        }

        binding = false;

        cSetting.value = e.key;

        setting = {...cSetting};
        onchange?.();
    });
</script>

<div class="setting">
    <button
            class="change-bind"
            onclick={toggleBinding}
            onmouseenter={() => isHovered = true}
            onmouseleave={() => isHovered = false}
    >
        {#if !binding}
            <div class="name">{$spaceSeperatedNames ? convertToSpacedString(cSetting.name) : cSetting.name}:</div>

            {#if cSetting.value === UNKNOWN_KEY}
                <span class="none">None</span>
            {:else}
                <span>{printableKeyName}</span>
            {/if}
        {:else}
            <span>Press any key</span>
        {/if}
    </button>
</div>

<style lang="scss">

  .setting {
    padding: 7px 0;
  }

  .change-bind {
    background-color: transparent;
    border: solid 2px var(--accent-color);
    border-radius: 3px;
    cursor: pointer;
    padding: 4px;
    font-weight: 500;
    color: var(--clickgui-text-color);
    font-size: 12px;
    font-family: "Inter", sans-serif;
    width: 100%;
    display: flex;
    justify-content: center;
    column-gap: 5px;

    .name {
      font-weight: 500;
    }

    .none {
      color: var(--clickgui-text-dimmed-color);
    }
  }
</style>
