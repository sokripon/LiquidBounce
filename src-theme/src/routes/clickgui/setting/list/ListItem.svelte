<script lang="ts">
    import ItemIcon from "./ItemIcon.svelte";

    interface Props {
        value: string;
        name: string;
        icon: string | undefined;
        enabled: boolean;
        ontoggle: (detail: {value: string; enabled: boolean}) => void;
    }

    let {value, name, icon, enabled, ontoggle}: Props = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="item" class:has-icon={icon !== undefined}
     onclick={() => ontoggle({value, enabled: !enabled})}>
    {#if icon}
        <ItemIcon src={icon} alt={value} size={25}/>
    {/if}
    <div class="name">{name}</div>
    <div class="tick">
        {#if enabled}
            <img src="img/clickgui/icon-tick-checked.svg" alt="enabled">
        {:else}
            <img src="img/clickgui/icon-tick.svg" alt="disabled">
        {/if}
    </div>
</div>

<style lang="scss">
  .item {
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: center;
    column-gap: 5px;
    cursor: pointer;
    margin: 2px 5px 2px 0;

    &.has-icon {
      grid-template-columns: max-content 1fr max-content;
    }
  }

  .name {
    font-size: 12px;
    color: var(--clickgui-text-color);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
