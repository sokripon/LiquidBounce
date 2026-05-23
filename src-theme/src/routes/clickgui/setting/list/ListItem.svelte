<script lang="ts">
    import type {Snippet} from "svelte";
    import ItemIcon from "./ItemIcon.svelte";

    interface Props {
        value: string;
        name: string;
        icon?: string;
        enabled?: boolean;
        ontoggle?: (detail: {value: string; enabled: boolean}) => void;
        leading?: Snippet;
        trailing?: Snippet;
    }

    let {value, name, icon, enabled = false, ontoggle, leading, trailing}: Props = $props();

    const interactive = $derived(ontoggle !== undefined);
    const showDefaultTrailing = $derived(trailing === undefined && ontoggle !== undefined);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="item" class:interactive
     onclick={interactive ? () => ontoggle!({value, enabled: !enabled}) : undefined}>
    {#if leading}{@render leading()}{/if}
    {#if icon}
        <ItemIcon src={icon} alt={value} size={25}/>
    {/if}
    <div class="name">{name}</div>
    {#if trailing}
        {@render trailing()}
    {:else if showDefaultTrailing}
        <div class="tick">
            {#if enabled}
                <img src="img/clickgui/icon-tick-checked.svg" alt="enabled">
            {:else}
                <img src="img/clickgui/icon-tick.svg" alt="disabled">
            {/if}
        </div>
    {/if}
</div>

<style lang="scss">
  .item {
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 2px 5px 2px 0;

    &.interactive {
      cursor: pointer;
    }
  }

  .name {
    flex: 1 1 0;
    min-width: 0;
    font-size: 12px;
    color: var(--clickgui-text-color);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
