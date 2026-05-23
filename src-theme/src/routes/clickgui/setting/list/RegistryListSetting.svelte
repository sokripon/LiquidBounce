<script lang="ts">
    import {onMount} from "svelte";
    import type {ModuleSetting, NamedItem, RegistryListSetting} from "../../../../integration/types";
    import GenericListSetting from "./GenericListSetting.svelte";
    import {getRegistryItems} from "../../../../integration/rest";

    interface Props {
        setting: ModuleSetting;
        path: string;
        onchange?: () => void;
    }

    let {setting = $bindable(), path, onchange}: Props = $props();

    const cSetting = $derived(setting as RegistryListSetting);

    let items = $state<NamedItem[]>([]);

    onMount(async () => {
        const registryItems = await getRegistryItems(cSetting.registry);
        items = Object.entries(registryItems)
            .map(([identifier, item]) => ({
                value: identifier,
                name: item.name,
                icon: item.icon,
            } as NamedItem))
            .sort((a, b) => a.value.localeCompare(b.value));
    });
</script>

<GenericListSetting {path} bind:setting {items} {onchange}/>
