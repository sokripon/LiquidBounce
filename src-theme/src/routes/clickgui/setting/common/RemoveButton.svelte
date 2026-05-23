<script lang="ts">
    interface Props {
        title?: string;
        onclick: () => void;
    }

    let {title = "Remove", onclick}: Props = $props();
</script>

<button class="button-remove" {title} {onclick} type="button">
    <img src="img/clickgui/icon-cross.svg" alt="remove">
</button>

<style lang="scss">
    .button-remove {
        background-color: transparent;
        border: none;
        cursor: pointer;
    }
</style>
