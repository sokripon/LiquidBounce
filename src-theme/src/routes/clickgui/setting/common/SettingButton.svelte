<script lang="ts">
    interface Props {
        label: string;
        title?: string;
        onclick: () => void;
    }

    let {label, title, onclick}: Props = $props();
</script>

<button class="setting-button" {title} {onclick} type="button">{label}</button>

<style lang="scss">
    .setting-button {
        font-family: monospace;
        font-size: 12px;
        color: var(--clickgui-text-color);
        background-color: var(--clickgui-button-background-color);
        border: none;
        padding: 6px 10px;
        border-radius: 3px;
        width: 100%;
        cursor: pointer;
        transition: ease background-color .2s;

        &:hover {
            background-color: var(--clickgui-button-hover-background-color);
        }
    }
</style>
