import React, { useCallback, useMemo, useState } from 'react';



function eventToPointerCoordinates(e: ReactMouseEvent) {
    const { left, top } = (e.target as HTMLElement).getBoundingClientRect();
    return { x: e.clientX - left, y: e.clientY - top};
}

export type Box = {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    w: number;
    h: number;
}

type ReactMouseEvent = React.MouseEvent<HTMLElement, MouseEvent>;

export type SelectDragMouseHandlers = {
    onMouseDown: (e: ReactMouseEvent) => void;
    onMouseMove: (e: ReactMouseEvent) => void;
    onMouseUp: () => void;
}

export default function usePointerSelectDrag(onComplete: (box: Box) => void): { selectDragMouseHandlers: SelectDragMouseHandlers; currentBox?: Box } {
    const [mouseDown, setMouseDown] = useState(false);
    const [[x1, y1], setStartingPoint] = useState([0, 0]);
    const [[x2, y2], setCurrentPoint] = useState([0, 0]);
    const box: Box = useMemo(() => ({
        x1: Math.min(x1, x2), 
        y1: Math.min(y1, y2), 
        x2: Math.max(x1, x2), 
        y2: Math.max(y1, y2), 
        w: Math.abs(x2 - x1), 
        h: Math.abs(y2 - y1)
    }), [x1, y1, x2, y2]);

    const onMouseDown = useCallback((e: ReactMouseEvent) => {
        if (e.button === 0) {
            const { x, y } = eventToPointerCoordinates(e);
            setStartingPoint([x, y]);
            setCurrentPoint([x, y]);
            setMouseDown(true);
        }
    }, []);
    const onMouseUp = useCallback(
        () => {
            if (mouseDown) {
                setMouseDown(false);
                onComplete?.(box);
            }
        },
        [box, onComplete, mouseDown]
    );
    const onMouseMove = useCallback(
        (e: ReactMouseEvent) => {
            const { x, y } = eventToPointerCoordinates(e);
            if (mouseDown) setCurrentPoint([x, y]);
        },
        [mouseDown]
    );

    return {
        selectDragMouseHandlers: { onMouseDown, onMouseMove, onMouseUp },
        currentBox: mouseDown ? box : undefined,
    };
}