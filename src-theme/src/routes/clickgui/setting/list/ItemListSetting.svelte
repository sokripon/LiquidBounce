<script lang="ts">
    import type {ItemListSetting, ModuleSetting, NamedItem} from "../../../../integration/types";
    import GenericListSetting from "./GenericListSetting.svelte";

    interface Props {
        setting: ModuleSetting;
        path: string;
        onchange?: () => void;
    }

    let {setting = $bindable(), path, onchange}: Props = $props();

    const items = $derived((setting as ItemListSetting).items as NamedItem[]);
</script>

<GenericListSetting {path} bind:setting {items} {onchange}/>
