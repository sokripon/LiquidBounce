<script lang="ts">
    import {itemTextureUrl} from "../../../../integration/rest";

    interface Props {
        value: string;
        name: string;
        icon: string | undefined;
        onselect: (detail: {value: string}) => void;
    }

    let {value, name, icon, onselect}: Props = $props();

    let showingFallbackImage = $state(false);

    function showFallbackIcon(event: Event) {
        const img = event.currentTarget as HTMLImageElement;

        showingFallbackImage = true;
        img.src = itemTextureUrl("minecraft:grass_block");
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="item" class:has-icon={icon !== undefined}
     onclick={() => onselect({value})}>
    {#if icon}
        <img class="icon" class:fallback={showingFallbackImage} src={icon} alt={value} onerror={showFallbackIcon}/>
    {/if}
    <div class="name">{name}</div>
</div>

<style lang="scss">
  .item {
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    column-gap: 5px;
    cursor: pointer;
    margin: 2px 5px 2px 0;
    padding: 5px;
    border-radius: 3px;
    transition: background-color 0.2s;

    &.has-icon {
      grid-template-columns: max-content 1fr;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }

  .icon {
    height: 25px;
    width: 25px;

    &.fallback {
      filter: grayscale(1);
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
