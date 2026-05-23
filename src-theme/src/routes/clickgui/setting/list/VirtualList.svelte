<!-- Adapted from https://github.com/sveltejs/svelte-virtual-list -->
<script lang="ts" generics="T">
    import {onMount, tick, type Snippet} from "svelte";

    interface Props {
        items: T[];
        height?: string;
        itemHeight?: number;
        resetScrollOnItemsChange?: boolean;
        start?: number;
        end?: number;
        item: Snippet<[T]>;
    }

    let {
        items,
        height = "100%",
        itemHeight,
        resetScrollOnItemsChange = true,
        start = $bindable(0),
        end = $bindable(0),
        item,
    }: Props = $props();

    let height_map: number[] = [];
    let rows: HTMLCollectionOf<HTMLElement> | undefined;
    let viewport: HTMLElement | undefined = $state();
    let contents: HTMLElement | undefined = $state();
    let viewport_height = $state(0);
    let mounted = $state(false);
    let top = $state(0);
    let bottom = $state(0);
    let average_height = 0;

    const visible = $derived(items.slice(start, end).map((data, i) => ({index: i + start, data})));

    $effect(() => {
        if (mounted) refresh(items, viewport_height, itemHeight);
    });

    async function refresh(items: T[], viewport_height: number, itemHeight: number | undefined) {
        if (!viewport) return;
        let {scrollTop} = viewport;
        await tick();

        if (start >= items.length) {
            start = 0;
            top = 0;
            viewport.scrollTop = 0;
            scrollTop = 0;
        }

        let content_height = top - scrollTop;
        let i = start;
        while (content_height < viewport_height && i < items.length) {
            let row = rows?.[i - start];
            if (!row) {
                end = i + 1;
                await tick();
                row = rows?.[i - start];
                if (!row) break;
            }
            const row_height = height_map[i] = itemHeight ?? row.offsetHeight;
            content_height += row_height;
            i += 1;
        }
        end = i;
        const remaining = items.length - end;
        average_height = (top + content_height) / end;
        bottom = remaining * average_height;
        height_map.length = items.length;

        setTimeout(() => {
            if (resetScrollOnItemsChange && viewport) {
                viewport.scrollTop = 0;
            }
        }, 100);
    }

    async function handle_scroll() {
        if (!viewport || !rows) return;
        const {scrollTop} = viewport;
        const old_start = start;
        for (let v = 0; v < rows.length; v += 1) {
            height_map[start + v] = itemHeight ?? rows[v].offsetHeight;
        }
        let i = 0;
        let y = 0;
        while (i < items.length) {
            const row_height = height_map[i] || average_height;
            if (y + row_height > scrollTop) {
                start = i;
                top = y;
                break;
            }
            y += row_height;
            i += 1;
        }
        while (i < items.length) {
            y += height_map[i] || average_height;
            i += 1;
            if (y > scrollTop + viewport_height) break;
        }
        end = i;
        const remaining = items.length - end;
        average_height = y / end;
        while (i < items.length) height_map[i++] = average_height;
        bottom = remaining * average_height;

        if (start < old_start) {
            await tick();
            let expected_height = 0;
            let actual_height = 0;
            for (let j = start; j < old_start; j += 1) {
                const row = rows[j - start];
                if (row) {
                    expected_height += height_map[j];
                    actual_height += itemHeight ?? row.offsetHeight;
                }
            }
            const d = actual_height - expected_height;
            viewport.scrollTo(0, scrollTop + d);
        }
    }

    onMount(() => {
        if (contents) {
            rows = contents.getElementsByTagName("svelte-virtual-list-row") as HTMLCollectionOf<HTMLElement>;
        }
        mounted = true;
    });
</script>

<svelte-virtual-list-viewport
        bind:this={viewport}
        bind:offsetHeight={viewport_height}
        onscroll={handle_scroll}
        style="height: {height};"
>
    <svelte-virtual-list-contents
            bind:this={contents}
            style="padding-top: {top}px; padding-bottom: {bottom}px;"
    >
        {#each visible as row (row.index)}
            <svelte-virtual-list-row>
                {@render item(row.data)}
            </svelte-virtual-list-row>
        {/each}
    </svelte-virtual-list-contents>
</svelte-virtual-list-viewport>

<style>
    svelte-virtual-list-viewport {
        position: relative;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        display: block;
    }

    svelte-virtual-list-contents, svelte-virtual-list-row {
        display: block;
    }

    svelte-virtual-list-row {
        overflow: hidden;
    }
</style>
