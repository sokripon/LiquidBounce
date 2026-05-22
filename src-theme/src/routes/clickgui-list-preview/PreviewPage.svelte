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
            onreset() {
                panel.items = makeSeed();
            },
        };
    }

    const variants = [
        {title: "Current — Stacked Rows", note: "Shipped baseline. Vertical rows, drag handle, arrow buttons.", component: OrderedItemList, panel: p0},
        {title: "V1 — Numbered Steps", note: "Recipe-style timeline with badge ordinals and a connecting rail.", component: V1NumberedSteps, panel: p1},
        {title: "V2 — Compact Chips", note: "Inline wrap-flow chips. Smallest footprint, scales to long lists.", component: V2CompactChips, panel: p2},
        {title: "V3 — Hotbar Slots", note: "Minecraft hotbar feel. Icon-first, hover reveals remove.", component: V3HotbarSlots, panel: p3},
        {title: "V4 — Card Grid", note: "Grid of cards. Icon prominent, controls in hover footer.", component: V4CardGrid, panel: p4},
        {title: "V5 — Compact Table", note: "Dense table. Highest information density, power-user feel.", component: V5CompactTable, panel: p5},
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
            {@const Component = variant.component}
            <section class="panel">
                <header class="panel-header">
                    <div class="title-row">
                        <h2>{variant.title}</h2>
                        <button class="reset" onclick={handlers.onreset} title="Reset this panel">Reset</button>
                    </div>
                    <p class="note">{variant.note}</p>
                </header>
                <div class="panel-body">
                    <Component
                        items={variant.panel.items}
                        onmove={handlers.onmove}
                        onreorder={handlers.onreorder}
                        onremove={handlers.onremove}
                        onadd={handlers.onadd}/>
                </div>
            </section>
        {/each}
    </div>
</div>

<style lang="scss">
    .preview {
        --clickgui-base-color: #1a1a22;
        --clickgui-text-color: #e8e8ee;
        --clickgui-button-background-color: #2a2a35;
        --clickgui-button-hover-background-color: #353545;

        min-height: 100vh;
        padding: 24px;
        background: radial-gradient(circle at top, #20202a 0%, #0d0d12 100%);
        color: var(--clickgui-text-color);
        font-family: "Inter", system-ui, sans-serif;
    }

    .page-header {
        max-width: 1400px;
        margin: 0 auto 20px;

        h1 {
            font-size: 22px;
            font-weight: 700;
            margin: 0 0 4px;
            color: var(--accent-color);
        }
        p {
            font-size: 13px;
            color: color-mix(in srgb, var(--clickgui-text-color) 70%, transparent);
            margin: 0;
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
        background: color-mix(in srgb, var(--clickgui-base-color) 70%, transparent);
        border: 1px solid color-mix(in srgb, var(--accent-color) 20%, transparent);
        border-radius: 6px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .panel-header {
        border-bottom: 1px solid color-mix(in srgb, var(--accent-color) 15%, transparent);
        padding-bottom: 8px;

        h2 {
            font-size: 13px;
            font-weight: 700;
            margin: 0;
            color: var(--accent-color);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .note {
            font-size: 11px;
            color: color-mix(in srgb, var(--clickgui-text-color) 60%, transparent);
            margin: 4px 0 0;
        }
    }

    .title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
    }

    .reset {
        font-size: 10px;
        background: transparent;
        color: color-mix(in srgb, var(--clickgui-text-color) 70%, transparent);
        border: 1px solid color-mix(in srgb, var(--clickgui-text-color) 30%, transparent);
        border-radius: 3px;
        padding: 2px 6px;
        cursor: pointer;
        transition: color 0.15s, border-color 0.15s;

        &:hover {
            color: var(--accent-color);
            border-color: var(--accent-color);
        }
    }

    .panel-body {
        flex: 1;
        min-height: 200px;
    }
</style>
