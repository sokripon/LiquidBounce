<!--
  Side-by-side comparison preview for OrderedItemList variants.
  Each panel maintains its own independent state so reorder/add/remove
  in one variant does not affect the others.

  Reachable at the SPA route `/clickgui-list-preview`.
-->
<script lang="ts">
    import type {NamedItem} from "../../integration/types";
    import {itemTextureUrl} from "../../integration/rest";
    import OrderedItemList from "../clickgui/setting/list/OrderedItemList.svelte";
    import V1NumberedSteps from "./variants/V1NumberedSteps.svelte";
    import V2CompactChips from "./variants/V2CompactChips.svelte";
    import V3HotbarSlots from "./variants/V3HotbarSlots.svelte";
    import V4CardGrid from "./variants/V4CardGrid.svelte";
    import V5CompactTable from "./variants/V5CompactTable.svelte";

    type VariantComponent = typeof V1NumberedSteps;

    function makeSeed(): NamedItem[] {
        const ids = [
            ["minecraft:oak_planks", "Oak Planks"],
            ["minecraft:stick", "Stick"],
            ["minecraft:iron_ingot", "Iron Ingot"],
            ["minecraft:redstone", "Redstone Dust"],
            ["minecraft:diamond", "Diamond"],
            ["minecraft:gold_ingot", "Gold Ingot"],
            ["minecraft:emerald", "Emerald"],
        ] as const;
        return ids.map(([value, name]) => ({value, name, icon: itemTextureUrl(value)}));
    }

    const pool: NamedItem[] = [
        {value: "minecraft:netherite_ingot", name: "Netherite Ingot", icon: itemTextureUrl("minecraft:netherite_ingot")},
        {value: "minecraft:obsidian", name: "Obsidian", icon: itemTextureUrl("minecraft:obsidian")},
        {value: "minecraft:cobblestone", name: "Cobblestone", icon: itemTextureUrl("minecraft:cobblestone")},
        {value: "minecraft:string", name: "String", icon: itemTextureUrl("minecraft:string")},
        {value: "minecraft:gunpowder", name: "Gunpowder", icon: itemTextureUrl("minecraft:gunpowder")},
        {value: "minecraft:ender_pearl", name: "Ender Pearl", icon: itemTextureUrl("minecraft:ender_pearl")},
        {value: "minecraft:blaze_rod", name: "Blaze Rod", icon: itemTextureUrl("minecraft:blaze_rod")},
        {value: "minecraft:slime_ball", name: "Slime Ball", icon: itemTextureUrl("minecraft:slime_ball")},
        {value: "minecraft:paper", name: "Paper", icon: itemTextureUrl("minecraft:paper")},
        {value: "minecraft:leather", name: "Leather", icon: itemTextureUrl("minecraft:leather")},
    ];

    type PanelState = {items: NamedItem[]};

    const p0: PanelState = $state({items: makeSeed()});
    const p1: PanelState = $state({items: makeSeed()});
    const p2: PanelState = $state({items: makeSeed()});
    const p3: PanelState = $state({items: makeSeed()});
    const p4: PanelState = $state({items: makeSeed()});
    const p5: PanelState = $state({items: makeSeed()});

    function makeHandlers(panel: PanelState) {
        return {
            onmove(value: string, delta: number) {
                const idx = panel.items.findIndex(i => i.value === value);
                const target = idx + delta;
                if (idx < 0 || target < 0 || target >= panel.items.length) return;
                const next = [...panel.items];
                [next[idx], next[target]] = [next[target], next[idx]];
                panel.items = next;
            },
            onreorder(from: number, to: number) {
                if (from === to) return;
                const next = [...panel.items];
                const [moved] = next.splice(from, 1);
                next.splice(to, 0, moved);
                panel.items = next;
            },
            onremove(value: string) {
                panel.items = panel.items.filter(i => i.value !== value);
            },
            onadd() {
                // Add the next not-yet-present pool item, or wrap if all present.
                const present = new Set(panel.items.map(i => i.value));
                const next = pool.find(p => !present.has(p.value)) ?? pool[0];
                if (!present.has(next.value)) {
                    panel.items = [...panel.items, next];
                }
            },
            onselect(value: string) {
                if (panel.items.some(i => i.value === value)) return;
                const item = pool.find(p => p.value === value);
                if (item) panel.items = [...panel.items, item];
            },
            onreset() {
                panel.items = makeSeed();
            },
        };
    }

    function availableFor(panel: PanelState): NamedItem[] {
        return pool.filter(p => !panel.items.some(i => i.value === p.value));
    }

    const h0 = makeHandlers(p0);
    const h1 = makeHandlers(p1);
    const h2 = makeHandlers(p2);
    const h3 = makeHandlers(p3);
    const h4 = makeHandlers(p4);
    const h5 = makeHandlers(p5);

    const a0 = $derived(availableFor(p0));
    const a1 = $derived(availableFor(p1));
    const a2 = $derived(availableFor(p2));
    const a3 = $derived(availableFor(p3));
    const a4 = $derived(availableFor(p4));
    const a5 = $derived(availableFor(p5));

    type Handlers = ReturnType<typeof makeHandlers>;
    type Variant = {
        title: string;
        note: string;
        component: VariantComponent | null;
        panel: PanelState;
        baseline: boolean;
        handlers: Handlers;
        availableItems: NamedItem[];
    };

    const variants: Variant[] = $derived([
        {title: "Current — Stacked Rows", note: "Shipped baseline. Vertical rows, drag handle, arrow buttons.", component: null, panel: p0, baseline: true, handlers: h0, availableItems: a0},
        {title: "V1 — Numbered Steps", note: "Recipe-style timeline with badge ordinals and a connecting rail.", component: V1NumberedSteps, panel: p1, baseline: false, handlers: h1, availableItems: a1},
        {title: "V2 — Compact Chips", note: "Inline wrap-flow chips. Smallest footprint, scales to long lists.", component: V2CompactChips, panel: p2, baseline: false, handlers: h2, availableItems: a2},
        {title: "V3 — Hotbar Slots", note: "Minecraft hotbar feel. Icon-first, hover reveals remove.", component: V3HotbarSlots, panel: p3, baseline: false, handlers: h3, availableItems: a3},
        {title: "V4 — Card Grid", note: "Grid of cards. Icon prominent, controls in hover footer.", component: V4CardGrid, panel: p4, baseline: false, handlers: h4, availableItems: a4},
        {title: "V5 — Compact Table", note: "Dense table. Highest information density, power-user feel.", component: V5CompactTable, panel: p5, baseline: false, handlers: h5, availableItems: a5},
    ]);
</script>

<div class="page">
    <div class="window">
        <header class="window-header">
            <div class="title-text">AutoCrafter <span class="separator">›</span> OrderedItemList Variant Preview</div>
            <div class="title-meta">Each section is independent — drag, reorder, add and remove without affecting the others.</div>
        </header>

        <div class="window-body">
            {#each variants as variant, idx (variant.title)}
                <section class="setting-section" class:first={idx === 0}>
                    <div class="setting-head">
                        <div class="setting-label">
                            <span class="setting-name">{variant.title}</span>
                            {#if variant.baseline}
                                <span class="badge-baseline">Baseline</span>
                            {/if}
                        </div>
                        <button class="reset" onclick={variant.handlers.onreset} title="Reset this section">Reset</button>
                    </div>
                    <div class="setting-note">{variant.note}</div>
                    <div class="setting-body">
                        {#if variant.baseline}
                            <OrderedItemList
                                items={variant.panel.items}
                                onmove={variant.handlers.onmove}
                                onreorder={variant.handlers.onreorder}
                                onremove={variant.handlers.onremove}
                                onadd={variant.handlers.onadd}/>
                        {:else if variant.component}
                            {@const Component = variant.component}
                            <Component
                                items={variant.panel.items}
                                availableItems={variant.availableItems}
                                onmove={variant.handlers.onmove}
                                onreorder={variant.handlers.onreorder}
                                onremove={variant.handlers.onremove}
                                onselect={variant.handlers.onselect}/>
                        {/if}
                    </div>
                </section>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    $grid-size: 10px;

    .page {
        min-height: 100vh;
        padding: 40px 24px 60px;
        background-color: var(--clickgui-overlay-background-color);
        background-image:
            linear-gradient(to right, var(--clickgui-grid-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--clickgui-grid-color) 1px, transparent 1px);
        background-size: $grid-size $grid-size;
        color: var(--clickgui-text-color);
        font-family: "Inter", sans-serif;
        display: flex;
        justify-content: center;
    }

    .window {
        width: min(900px, 100%);
        background-color: var(--clickgui-window-background-color);
        border-radius: 5px;
        box-shadow: 0 0 10px var(--clickgui-window-shadow-color);
        overflow: hidden;
        height: max-content;
    }

    .window-header {
        background-color: var(--clickgui-window-header-background-color);
        border-bottom: 2px solid var(--clickgui-window-header-border-color);
        padding: 16px 22px;
    }

    .title-text {
        font-size: 16px;
        font-weight: 600;
        color: var(--clickgui-text-color);
    }

    .separator {
        color: var(--accent-color);
        margin: 0 6px;
    }

    .title-meta {
        font-size: 11px;
        color: var(--clickgui-text-dimmed-color);
        margin-top: 4px;
    }

    .window-body {
        padding: 4px 22px 16px;
    }

    .setting-section {
        padding: 14px 0;
        border-top: 1px solid var(--clickgui-base-30-color);

        &.first {
            border-top: none;
        }
    }

    .setting-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }

    .setting-label {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .setting-name {
        font-weight: 500;
        color: var(--clickgui-text-color);
        font-size: 12px;
    }

    .badge-baseline {
        font-family: monospace;
        font-size: 10px;
        color: var(--accent-color);
        background-color: var(--clickgui-base-30-color);
        border: 1px solid var(--accent-color);
        border-radius: 2px;
        padding: 1px 5px;
        line-height: 1.4;
    }

    .setting-note {
        font-size: 11px;
        color: var(--clickgui-text-dimmed-color);
        margin: 3px 0 8px;
    }

    .reset {
        font-family: monospace;
        font-size: 11px;
        color: var(--clickgui-text-color);
        background-color: var(--clickgui-button-background-color);
        border: none;
        border-radius: 3px;
        padding: 4px 10px;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
            background-color: var(--clickgui-button-hover-background-color);
        }
    }

    .setting-body {
        margin-top: 5px;
    }
</style>
