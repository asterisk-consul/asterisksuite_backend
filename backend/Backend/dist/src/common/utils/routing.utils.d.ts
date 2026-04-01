export declare function calculateRoute(points: {
    latitude: number;
    longitude: number;
}[]): Promise<{
    distanceKm: number;
    estimatedMinutes: number;
} | null>;
