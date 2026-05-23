<script lang="ts">
    interface Props {
        value: number;
        valueType: "int" | "float";
        onchange?: (detail: {value: number}) => void;
    }

    let {value, valueType, onchange}: Props = $props();

    let inputElement = $state<HTMLElement>();
    let inputValue = $state("");

    $effect(() => {
        if (document.activeElement !== inputElement) {
            inputValue = value.toString();
        }
    });

    function handleInput() {
        let parsed: number;
        if (valueType === "float") {
            parsed = parseFloat(inputValue);
        } else {
            parsed = parseInt(inputValue);
        }

        if (!isNaN(parsed)) {
            onchange?.({value: parsed});
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span contenteditable="true" class="value" bind:innerText={inputValue} oninput={handleInput} onkeydown={handleKeyDown} bind:this={inputElement}></span>

<style lang="scss">

  .value {
    font-family: monospace;
    color: var(--clickgui-text-color);
    font-weight: 500;
    font-size: 12px;
    background-color: transparent;
    border: none;
    min-width: 5px;
    display: inline-block;
  }
</style>