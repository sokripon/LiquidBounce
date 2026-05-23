<script lang="ts">
    import type {Component} from "svelte";

    interface Tab {
        title: string;
        icon: string;
        component: Component<any> | any;
    }

    interface Props {
        tabs: Tab[];
        activeTab?: number;
        onchangeTab?: (activeTab: number) => void;
    }

    let {tabs, activeTab = $bindable(0), onchangeTab}: Props = $props();

    let availableTabsElement: HTMLElement | undefined = $state();

    function setActiveTab(i: number) {
        activeTab = i;
        onchangeTab?.(activeTab);
    }

    const ActiveComponent = $derived(tabs[activeTab].component);
</script>

<div class="tabs">
    <div class="available-tabs" bind:this={availableTabsElement}>
        {#each tabs as {title, icon}, index (title)}
            <button class="tab-button" class:active={tabs[activeTab].title === title}
                    onclick={() => setActiveTab(index)}>
                <img class="icon" src="img/menu/altmanager/{icon}" alt={title}>
                <span>{title}</span>
            </button>
        {/each}
    </div>

    <div style="width: {availableTabsElement?.clientWidth}px">
        <ActiveComponent/>
    </div>
</div>

<style lang="scss">

  .available-tabs {
    display: flex;
    column-gap: 10px;
    margin-bottom: 40px;
  }

  .tab-button {
    font-family: "Inter", sans-serif;
    background-color: var(--menu-modal-tab-background-color);
    color: var(--menu-text-color);
    padding: 10px;
    border: solid 2px transparent;
    border-radius: 5px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 10px;
    cursor: pointer;
    transition: ease border-color .2s;

    .icon {
      height: 30px;
    }

    &.active {
      border-color: var(--menu-modal-tab-active-border-color);
    }
  }
</style>
