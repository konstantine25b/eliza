function isWithinTimeRange(startHour: number, endHour: number): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= startHour && currentHour < endHour;
}
export default isWithinTimeRange;