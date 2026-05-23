<script lang="ts">
    import {convertToSpacedString, spaceSeperatedNames} from "../../../../theme/theme_config";

    interface Props {
        name: string | null;
        options: string[];
        value: string;
        onchange?: () => void;
    }

    let {name, options, value = $bindable(), onchange}: Props = $props();

    let expanded = $state(false);
    let dropdownHead = $state<HTMLElement>();

    function windowClickHide(e: MouseEvent) {
        if (dropdownHead && !dropdownHead.contains(e.target as Node)) {
            expanded = false;
        }
    }

    function updateValue(v: string) {
        value = v;
        onchange?.();
    }
</script>

<svelte:window onclick={windowClickHide}/>
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="dropdown" class:expanded onclick={() => (expanded = !expanded)}>
    <div class="head" bind:this={dropdownHead}>
        {#if name !== null}
            <span class="text">{$spaceSeperatedNames ? convertToSpacedString(name) : name}
                &bull; {$spaceSeperatedNames ? convertToSpacedString(value) : value}</span>
        {:else}
            <span class="text">{$spaceSeperatedNames ? convertToSpacedString(value) : value}</span>
        {/if}
    </div>

    {#if expanded}
        <div class="options">
            {#each options as o (o)}
                <div
                        class="option"
                        class:active={o === value}
                        onclick={() => updateValue(o)}
                >
                    {$spaceSeperatedNames ? convertToSpacedString(o) : o}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
  @use "../../icon-settings-expand" as *;

  .dropdown {
    position: relative;

    &.expanded {
      .text::after {
        transform: translateY(-50%) rotate(0);
        opacity: 1;
      }

      .head {
        border-radius: 3px 3px 0 0;
      }
    }
  }

  .head {
    background-color: var(--clickgui-dropdown-trigger-background-color);
    padding: 6px 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    position: relative;
    border-radius: 3px;
    transition: ease border-radius .2s;

    .text {
      font-weight: 500;
      color: var(--clickgui-text-color);
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 20px;
    }

    .text::after {
      @include icon-settings-expand();
    }
  }

  .options {
    padding: 6px 10px;
    background-color: var(--clickgui-dropdown-background-color);
    border: solid 1px var(--clickgui-dropdown-border-color);
    border-top: none;
    border-radius: 0 0 3px 3px;
    z-index: 9999;
    width: 100%;
    position: absolute;

    .option {
      color: var(--clickgui-dropdown-option-color);
      font-weight: 500;
      font-size: 12px;
      padding: 5px 0;
      cursor: pointer;
      text-align: center;
      transition: ease color 0.2s;

      &:hover {
        color: var(--clickgui-dropdown-option-hover-color);
      }

      &.active {
        color: var(--clickgui-dropdown-option-selected-color);
      }
    }
  }
</style>
