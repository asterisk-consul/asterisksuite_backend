"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRoute = calculateRoute;
async function calculateRoute(points) {
    if (points.length < 2)
        return null;
    const TRUCK_AVG_SPEED_KMH = 60;
    const coords = points.map((p) => `${p.longitude},${p.latitude}`).join(';');
    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`);
    const data = (await res.json());
    if (data.code !== 'Ok' || !data.routes?.length)
        return null;
    const distanceKm = data.routes[0].distance / 1000;
    const estimatedMinutes = Math.round((distanceKm / TRUCK_AVG_SPEED_KMH) * 60);
    return { distanceKm, estimatedMinutes };
}
//# sourceMappingURL=routing.utils.js.map