import { Coordinates } from "../types/uiTypes";

export function calculateEdgePoints(
    sourceCenter: Coordinates,
    targetCenter: Coordinates,
    sourceRadius: number,
    targetRadius: number
): {start: Coordinates, end: Coordinates} {
    const dx = targetCenter.x - sourceCenter.x;
    const dy = targetCenter.y - sourceCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const nx = dx / distance; // Normalized direction vector x
    const ny = dy / distance; // Normalized direction vector y

    // Calculate new start and end points, offset by the circle's radius
    const startX = sourceCenter.x + nx * sourceRadius;
    const startY = sourceCenter.y + ny * sourceRadius;
    const endX = targetCenter.x - nx * targetRadius;
    const endY = targetCenter.y - ny * targetRadius;

    return {
        start: { x: startX, y: startY },
        end: { x: endX, y: endY }
    };
}

export function getCirclePoint(
    bottomX: number,
    bottomY: number,
    radius: number,
    alpha: number
): Coordinates {
    // Calculate center
    const centerX = bottomX;
    const centerY = bottomY - radius;

    // Calculate the point on the circle using alpha
    const angle = alpha * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    return { x, y };
}