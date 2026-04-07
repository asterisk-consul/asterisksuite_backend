interface OsrmRoute {
  distance: number;
  duration: number;
}

interface OsrmResponse {
  code: string;
  routes: OsrmRoute[];
}

export async function calculateRoute(
  points: { latitude: number; longitude: number }[],
): Promise<{ distanceKm: number; estimatedMinutes: number } | null> {
  if (points.length < 2) return null;

  const TRUCK_AVG_SPEED_KMH = 60;
  const coords = points.map((p) => `${p.longitude},${p.latitude}`).join(';');

  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`,
  );

  const data = (await res.json()) as OsrmResponse;

  if (data.code !== 'Ok' || !data.routes?.length) return null;

  const distanceKm = data.routes[0].distance / 1000;
  const estimatedMinutes = Math.round((distanceKm / TRUCK_AVG_SPEED_KMH) * 60);

  return { distanceKm, estimatedMinutes };
}
