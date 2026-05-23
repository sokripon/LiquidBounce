<script lang="ts">
    import type {ModuleSetting} from "../../../../integration/types";
    import BooleanSetting from "../BooleanSetting.svelte";
    import ChoiceSetting from "../ChoiceSetting.svelte";
    import ChooseSetting from "../ChooseSetting.svelte";
    import ConfigurableSetting from "../ConfigurableSetting.svelte";
    import SliderSetting from "../SliderSetting.svelte";
    import TogglableSetting from "../TogglableSetting.svelte";
    import ColorSetting from "../ColorSetting.svelte";
    import TextSetting from "../TextSetting.svelte";
    import {slide} from "svelte/transition";
    import BindSetting from "../bind/BindSetting.svelte";
    import VectorSetting from "../VectorSetting.svelte";
    import KeySetting from "../KeySetting.svelte";
    import MultiChooseSetting from "../MultiChooseSetting.svelte";
    import FileSetting from "../FileSetting.svelte";
    import MutableListSetting from "../list/MutableListSetting.svelte";
    import ItemListSetting from "../list/ItemListSetting.svelte";
    import RegistryListSetting from "../list/RegistryListSetting.svelte";
    import CurveSetting from "../CurveSetting.svelte";
    import RegistryMutableListSetting from "../list/RegistryMutableListSetting.svelte";

    interface Props {
        setting: ModuleSetting;
        path: string;
        onchange?: () => void;
    }

    let {setting = $bindable(), path, onchange}: Props = $props();
</script>


<div in:slide|global={{duration: 200, axis: "y"}} out:slide|global={{duration: 200, axis: "y"}}>
    {#if setting.valueType === "BOOLEAN"}
        <BooleanSetting bind:setting {onchange}/>
    {:else if setting.valueType === "CHOICE"}
        <ChoiceSetting {path} bind:setting {onchange}/>
    {:else if setting.valueType === "FILE"}
        <FileSetting bind:setting {onchange}/>
    {:else if setting.valueType === "CHOOSE"}
        <ChooseSetting bind:setting {onchange}/>
    {:else if setting.valueType === "MULTI_CHOOSE"}
        <MultiChooseSetting {path} bind:setting {onchange}/>
    {:else if setting.valueType === "TOGGLEABLE"}
        <TogglableSetting {path} bind:setting {onchange}/>
    {:else if setting.valueType === "INT"}
        <SliderSetting kind="int" mode="single" bind:setting {onchange}/>
    {:else if setting.valueType === "INT_RANGE"}
        <SliderSetting kind="int" mode="range" bind:setting {onchange}/>
    {:else if setting.valueType === "FLOAT"}
        <SliderSetting kind="float" mode="single" bind:setting {onchange}/>
    {:else if setting.valueType === "FLOAT_RANGE"}
        <SliderSetting kind="float" mode="range" bind:setting {onchange}/>
    {:else if setting.valueType === "CONFIGURABLE"}
        <ConfigurableSetting {path} bind:setting {onchange}/>
    {:else if setting.valueType === "COLOR"}
        <ColorSetting bind:setting {onchange}/>
    {:else if setting.valueType === "TEXT"}
        <TextSetting bind:setting {onchange}/>
    {:else if setting.valueType === "MUTABLE_LIST" }
        <MutableListSetting bind:setting {onchange}/>
    {:else if setting.valueType === "ITEM_LIST" }
        <ItemListSetting {path} bind:setting {onchange}/>
    {:else if setting.valueType === "REGISTRY_LIST" }
        <RegistryListSetting {path} bind:setting {onchange}/>
    {:else if setting.valueType === "REGISTRY_MUTABLE_LIST" }
        <RegistryMutableListSetting {path} bind:setting {onchange}/>
    {:else if setting.valueType === "BIND"}
        <BindSetting bind:setting {onchange}/>
    {:else if setting.valueType === "VECTOR3_I" }
        <VectorSetting vecAxes={["x", "y", "z"]} step={1} bind:setting {onchange}/>
    {:else if setting.valueType === "VECTOR3_D" }
        <VectorSetting vecAxes={["x", "y", "z"]} step={0.01} bind:setting {onchange}/>
    {:else if setting.valueType === "VECTOR2_F" }
        <VectorSetting vecAxes={["x", "y"]} step={0.01} bind:setting {onchange}/>
    {:else if setting.valueType === "KEY"}
        <KeySetting bind:setting {onchange}/>
    {:else if setting.valueType === "CURVE"}
        <CurveSetting {path} bind:setting {onchange}/>
    {:else}
        <div style="color: var(--clickgui-text-color)">Unsupported setting {setting.valueType}</div>
    {/if}
</div>
