<script lang="ts">
    import "nouislider/dist/nouislider.css";
    import "./nouislider.scss";
    import {createEventDispatcher, onDestroy, onMount} from "svelte";
    import noUiSlider, {type API} from "nouislider";
    import type {
        FloatRangeSetting,
        FloatSetting,
        IntRangeSetting,
        IntSetting,
        ModuleSetting,
        Range,
    } from "../../../integration/types";
    import ValueInput from "./common/ValueInput.svelte";
    import {convertToSpacedString, spaceSeperatedNames} from "../../../theme/theme_config";

    type AnySliderSetting = IntSetting | FloatSetting | IntRangeSetting | FloatRangeSetting;

    interface Props {
        setting: ModuleSetting;
        kind: "int" | "float";
        mode: "single" | "range";
    }

    let {setting = $bindable(), kind, mode}: Props = $props();

    const cSetting = $derived(setting as AnySliderSetting);

    // Boundary-compatible event for the legacy GenericSetting parent (`on:change`).
    const dispatch = createEventDispatcher();

    let sliderEl = $state<HTMLElement>();
    let apiSlider: API | undefined;

    function stepFor(rangeTo: number): number {
        if (kind === "int") return 1;
        if (rangeTo > 100) return 0.1;
        if (rangeTo <= 0.1) return 0.0001;
        if (rangeTo <= 1.0) return 0.001;
        return 0.01;
    }

    function parseValue(raw: string): number {
        return kind === "int" ? parseInt(raw) : parseFloat(raw);
    }

    function currentSingle(): number {
        return cSetting.value as number;
    }

    function currentRange(): Range {
        return cSetting.value as Range;
    }

    onMount(() => {
        if (!sliderEl) return;

        const start = mode === "range"
            ? [currentRange().from, currentRange().to]
            : currentSingle();

        const baseOpts: Parameters<typeof noUiSlider.create>[1] = {
            start,
            connect: mode === "range" ? true : "lower",
            range: {min: cSetting.range.from, max: cSetting.range.to},
            step: stepFor(cSetting.range.to),
        };

        if (kind === "float") {
            baseOpts.format = {
                to: (v: number) => parseFloat(v.toFixed(4)),
                from: (v: string) => parseFloat(v),
            };
        }

        apiSlider = noUiSlider.create(sliderEl, baseOpts);

        apiSlider.on("update", (values) => {
            if (mode === "range") {
                const [from, to] = values.map(v => parseValue(v.toString()));
                setting = {...cSetting, value: {from, to}} as ModuleSetting;
            } else {
                const v = parseValue(values[0].toString());
                setting = {...cSetting, value: v} as ModuleSetting;
            }
        });

        apiSlider.on("set", () => {
            dispatch("change");
        });
    });

    onDestroy(() => {
        apiSlider?.destroy();
    });
</script>

<div class="setting" class:has-suffix={cSetting.suffix !== ""}>
    <div class="name">{$spaceSeperatedNames ? convertToSpacedString(cSetting.name) : cSetting.name}</div>
    <div class="value">
        {#if mode === "single"}
            <ValueInput valueType={kind} value={currentSingle()}
                        on:change={(e) => apiSlider?.set(e.detail.value)}/>
        {:else}
            <ValueInput valueType={kind} value={currentRange().from}
                        on:change={(e) => apiSlider?.set([e.detail.value, currentRange().to])}/>
            -
            <ValueInput valueType={kind} value={currentRange().to}
                        on:change={(e) => apiSlider?.set([currentRange().from, e.detail.value])}/>
        {/if}
    </div>
    {#if cSetting.suffix !== ""}
        <div class="suffix">{cSetting.suffix}</div>
    {/if}
    <div bind:this={sliderEl} class="slider"></div>
</div>

<style lang="scss">
    .setting {
        padding: 7px 0 2px 0;
        display: grid;
        grid-template-areas:
            "a b"
            "d d";
        grid-template-columns: 1fr max-content;
        column-gap: 5px;

        /* animation fix */
        min-height: 46px;
    }

    .setting.has-suffix {
        grid-template-areas:
            "a b c"
            "d d d";
        grid-template-columns: 1fr max-content max-content;
    }

    .suffix,
    .setting,
    .value {
        color: var(--clickgui-text-color);
        font-weight: 500;
        font-size: 12px;
    }

    .name {
        grid-area: a;
        font-weight: 500;
    }

    .value {
        grid-area: b;
    }

    .suffix {
        grid-area: c;
    }

    .slider {
        grid-area: d;
        padding-right: 10px;
    }
</style>
