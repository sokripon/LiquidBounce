<script lang="ts">
    interface Props {
        expanded: boolean;
    }

    let {expanded = $bindable()}: Props = $props();

    function handleClick() {
        expanded = !expanded;
    }
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button class="arrow" class:expanded onclick={handleClick}
></button>

<style lang="scss">
  @use "../../icon-settings-expand" as *;

  .arrow {
    width: 9px;
    margin-left: 11px;
    position: relative;
    cursor: pointer;
    background-color: transparent;
    border: none;

    &::after {
      @include icon-settings-expand($right: 0);
    }

    &.expanded::after {
      transform: translateY(-50%) rotate(0);
      opacity: 1;
    }
  }
</style>
