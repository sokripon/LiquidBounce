<script lang="ts">
    import type {
        ModuleSetting,
        BooleanSetting,
    } from "../../../integration/types";
    import Switch from "./common/Switch.svelte";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../theme/theme_config";

    interface Props {
        setting: ModuleSetting;
        onchange?: () => void;
    }

    let {setting = $bindable(), onchange}: Props = $props();

    const cSetting = $derived(setting as BooleanSetting);

    function handleChange() {
        setting = { ...cSetting };
        onchange?.();
    }
</script>

<div class="setting">
    <Switch
        name={$spaceSeperatedNames ? convertToSpacedString(cSetting.name) : cSetting.name}
        bind:value={cSetting.value}
        onchange={handleChange}
    />
</div>

<style lang="scss">
    .setting {
        padding: 7px 0px;
    }
</style>
