function isWithinTimeRange(): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    return (currentHour >= 9 && currentHour < 10) || (currentHour >= 14 && currentHour < 15) || (currentHour >= 19 && currentHour < 20) || (currentHour >= 1 && currentHour < 2);
}
export default isWithinTimeRange;