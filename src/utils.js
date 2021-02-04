export function coordsToStyle(x1, y1, x2, y2){
    return {
        left: Math.min(x1, x2),
        top: Math.min(y1, y2),
        width: Math.abs(x1 - x2),
        height: Math.abs(y1 - y2)
    }
}