<!--
  Renders a Minecraft item texture with built-in fallback handling:
  - On load error, switches to a `minecraft:grass_block` icon greyscaled.
  - When `placeholder` is true and `src` is missing, shows a "?" glyph
    sized relative to the icon.

  Sizing is driven by the `size` prop (CSS pixels) so a single component
  can be used for all visual densities across list variants.
-->
<script lang="ts">
    import {itemTextureUrl} from "../../../../integration/rest";

    interface Props {
        src?: string;
        alt?: string;
        /** Icon edge length in CSS pixels. */
        size?: number;
        /** When true, render a "?" placeholder if `src` is missing. */
        placeholder?: boolean;
    }

    let {src, alt = "", size = 20, placeholder = false}: Props = $props();

    const FALLBACK_SRC = itemTextureUrl("minecraft:grass_block");

    let erroredSrc = $state<string | undefined>(undefined);
    const errored = $derived(src !== undefined && erroredSrc === src);
    const displayedSrc = $derived(errored ? FALLBACK_SRC : src);
</script>

{#if src}
    <img class="icon" class:fallback={errored}
         style:--icon-size="{size}px"
         src={displayedSrc} {alt} onerror={() => erroredSrc = src}/>
{:else if placeholder}
    <span class="placeholder" style:--icon-size="{size}px" aria-hidden="true">?</span>
{/if}

<style lang="scss">
    .icon {
        width: var(--icon-size);
        height: var(--icon-size);
        image-rendering: pixelated;
        display: block;

        &.fallback {
            filter: grayscale(1);
        }
    }

    .placeholder {
        width: var(--icon-size);
        height: var(--icon-size);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: calc(var(--icon-size) * 0.7);
        line-height: 1;
        color: color-mix(in srgb, var(--clickgui-text-color) 40%, transparent);
        user-select: none;
    }
</style>
