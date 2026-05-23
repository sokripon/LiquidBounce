<script lang="ts">
    import type {ChooseSetting, ModuleSetting,} from "../../../integration/types";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../theme/theme_config";
    import Dropdown from "./common/Dropdown.svelte";

    interface Props {
        setting: ModuleSetting;
        onchange?: () => void;
    }

    let {setting = $bindable(), onchange}: Props = $props();

    const cSetting = $derived(setting as ChooseSetting);

    function handleChange() {
        setting = { ...cSetting };
        onchange?.();
    }
</script>

<div class="setting">
    <Dropdown
        onchange={handleChange}
        bind:value={cSetting.value}
        options={cSetting.choices}
        name={$spaceSeperatedNames ? convertToSpacedString(cSetting.name) : cSetting.name}
    />
</div>

<style lang="scss">
    .setting {
        padding: 7px 0px;
    }
</style>
