/**
 * Reusable HTML5 drag-and-drop reorder helper for ordered item lists.
 *
 * Each consumer constructs its own instance via `createDragReorder()` and
 * either binds the individual handlers to row elements, or spreads
 * `attrs(index)` plus `classesFor(index)` for a one-liner row root.
 *
 * The instance exposes reactive `draggingIndex` and `dropIndex` state so
 * consumers can also render their own drop indicators.
 */
export type Axis = "vertical" | "horizontal";

export interface DragReorderHandle {
    readonly draggingIndex: number | null;
    readonly dropIndex: number | null;
    handleDragStart: (index: number, event: DragEvent) => void;
    handleDragOver: (index: number, event: DragEvent) => void;
    handleDrop: (event: DragEvent) => void;
    handleDragEnd: () => void;
    /** Returns the space-joined set of active drop-indicator classes for a row at `index`. */
    classesFor: (index: number) => string;
    /** Returns the full set of DnD attributes for a draggable row at `index`. */
    attrs: (index: number) => {
        draggable: true;
        ondragstart: (event: DragEvent) => void;
        ondragover: (event: DragEvent) => void;
        ondrop: (event: DragEvent) => void;
        ondragend: () => void;
    };
}

export function createDragReorder(opts: {
    onreorder: (fromIndex: number, toIndex: number) => void;
    axis?: Axis;
}): DragReorderHandle {
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

    function classesFor(index: number): string {
        const classes: string[] = [];
        if (draggingIndex === index) classes.push("dragging");
        if (
            dropIndex === index &&
            draggingIndex !== index &&
            draggingIndex !== index - 1
        ) classes.push("drop-before");
        if (
            dropIndex === index + 1 &&
            draggingIndex !== index &&
            draggingIndex !== index + 1
        ) classes.push("drop-after");
        return classes.join(" ");
    }

    function attrs(index: number) {
        return {
            draggable: true as const,
            ondragstart: (event: DragEvent) => handleDragStart(index, event),
            ondragover: (event: DragEvent) => handleDragOver(index, event),
            ondrop: handleDrop,
            ondragend: handleDragEnd,
        };
    }

    return {
        get draggingIndex() { return draggingIndex; },
        get dropIndex() { return dropIndex; },
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
        classesFor,
        attrs,
    };
}
