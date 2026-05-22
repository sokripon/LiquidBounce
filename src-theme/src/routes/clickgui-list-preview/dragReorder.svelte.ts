/**
 * Reusable HTML5 drag-and-drop reorder helper for ordered item lists.
 *
 * Each variant constructs its own instance via `createDragReorder()` and binds
 * the returned handlers to its row elements. The instance exposes reactive
 * `draggingIndex` and `dropIndex` state so variants can render drop indicators.
 */
export type Axis = "vertical" | "horizontal";

export function createDragReorder(opts: {
    onreorder: (fromIndex: number, toIndex: number) => void;
    axis?: Axis;
}) {
    const axis: Axis = opts.axis ?? "vertical";

    let draggingIndex = $state<number | null>(null);
    let dropIndex = $state<number | null>(null);

    function handleDragStart(index: number, event: DragEvent) {
        draggingIndex = index;
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            // Required by Firefox to initiate a drag.
            event.dataTransfer.setData("text/plain", String(index));
        }
    }

    function handleDragOver(index: number, event: DragEvent) {
        if (draggingIndex === null) return;
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const after = axis === "vertical"
            ? event.clientY > rect.top + rect.height / 2
            : event.clientX > rect.left + rect.width / 2;
        dropIndex = after ? index + 1 : index;
    }

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        if (draggingIndex !== null && dropIndex !== null) {
            // When dragging forward, the slice after the removed item shifts by one.
            let target = dropIndex;
            if (target > draggingIndex) target -= 1;
            if (target !== draggingIndex) {
                opts.onreorder(draggingIndex, target);
            }
        }
        draggingIndex = null;
        dropIndex = null;
    }

    function handleDragEnd() {
        draggingIndex = null;
        dropIndex = null;
    }

    return {
        get draggingIndex() { return draggingIndex; },
        get dropIndex() { return dropIndex; },
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
    };
}
