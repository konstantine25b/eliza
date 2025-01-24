function isWithinTimeRange(): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    // console.log(now);
    // console.log(currentHour);
    return (currentHour >= 9 && currentHour < 10)|| (currentHour >= 11 && currentHour < 12)  || (currentHour >= 14 && currentHour < 15) || (currentHour >= 19 && currentHour < 20) || (currentHour >= 1 && currentHour < 2);
}
export default isWithinTimeRange;