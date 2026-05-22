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

    const variants: {title: string; note: string; component: VariantComponent | null; panel: PanelState; baseline: boolean}[] = [
        {title: "Current — Stacked Rows", note: "Shipped baseline. Vertical rows, drag handle, arrow buttons.", component: null, panel: p0, baseline: true},
        {title: "V1 — Numbered Steps", note: "Recipe-style timeline with badge ordinals and a connecting rail.", component: V1NumberedSteps, panel: p1, baseline: false},
        {title: "V2 — Compact Chips", note: "Inline wrap-flow chips. Smallest footprint, scales to long lists.", component: V2CompactChips, panel: p2, baseline: false},
        {title: "V3 — Hotbar Slots", note: "Minecraft hotbar feel. Icon-first, hover reveals remove.", component: V3HotbarSlots, panel: p3, baseline: false},
        {title: "V4 — Card Grid", note: "Grid of cards. Icon prominent, controls in hover footer.", component: V4CardGrid, panel: p4, baseline: false},
        {title: "V5 — Compact Table", note: "Dense table. Highest information density, power-user feel.", component: V5CompactTable, panel: p5, baseline: false},
    ];
</script>

<div class="preview">
    <header class="page-header">
        <h1>OrderedItemList — Variant Preview</h1>
        <p>Each panel is independent. Drag rows, click controls, add and remove — state is local to its panel.</p>
    </header>

    <div class="grid">
        {#each variants as variant (variant.title)}
            {@const handlers = makeHandlers(variant.panel)}
            <section class="panel">
                <header class="panel-header">
                    <div class="title-row">
                        <h2>{variant.title}</h2>
                        <button class="reset" onclick={handlers.onreset} title="Reset this panel">Reset</button>
                    </div>
                    <p class="note">{variant.note}</p>
                </header>
                <div class="panel-body">
                    {#if variant.baseline}
                        <OrderedItemList
                            items={variant.panel.items}
                            onmove={handlers.onmove}
                            onreorder={handlers.onreorder}
                            onremove={handlers.onremove}
                            onadd={handlers.onadd}/>
                    {:else if variant.component}
                        {@const Component = variant.component}
                        <Component
                            items={variant.panel.items}
                            availableItems={availableFor(variant.panel)}
                            onmove={handlers.onmove}
                            onreorder={handlers.onreorder}
                            onremove={handlers.onremove}
                            onselect={handlers.onselect}/>
                    {/if}
                </div>
            </section>
        {/each}
    </div>
</div>

<style lang="scss">
    $grid-size: 10px;

    .preview {
        min-height: 100vh;
        padding: 24px;
        background-color: var(--clickgui-overlay-background-color);
        background-image:
            linear-gradient(to right, var(--clickgui-grid-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--clickgui-grid-color) 1px, transparent 1px);
        background-size: $grid-size $grid-size;
        color: var(--clickgui-text-color);
        font-family: "Inter", sans-serif;
    }

    .page-header {
        max-width: 1400px;
        margin: 0 auto 20px;

        h1 {
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 4px;
            color: var(--clickgui-text-color);
            border-bottom: 2px solid var(--accent-color);
            padding-bottom: 8px;
        }

        p {
            font-size: 13px;
            color: var(--clickgui-text-dimmed-color);
            margin: 8px 0 0;
        }
    }

    .grid {
        max-width: 1400px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 16px;
    }

    .panel {
        background-color: var(--clickgui-window-background-color);
        border-radius: 5px;
        box-shadow: 0 0 10px var(--clickgui-window-shadow-color);
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .panel-header {
        background-color: var(--clickgui-window-header-background-color);
        border-bottom: 2px solid var(--clickgui-window-header-border-color);
        padding: 12px 16px;
    }

    .title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
    }

    h2 {
        font-size: 14px;
        font-weight: 600;
        margin: 0;
        color: var(--clickgui-text-color);
    }

    .note {
        font-size: 11px;
        color: var(--clickgui-text-dimmed-color);
        margin: 4px 0 0;
    }

    .reset {
        font-family: monospace;
        font-size: 11px;
        color: var(--clickgui-text-color);
        background-color: var(--clickgui-button-background-color);
        border: none;
        border-radius: 3px;
        padding: 4px 8px;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
            background-color: var(--clickgui-button-hover-background-color);
        }
    }

    .panel-body {
        flex: 1;
        min-height: 200px;
        padding: 12px 16px 14px;
    }
</style>
