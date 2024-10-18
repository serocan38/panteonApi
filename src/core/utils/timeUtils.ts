/**
 * 
 * @param startTime number of milliseconds
 * @returns time difference in seconds from the start time
 */
export const getTimeDiffNow = (startTime: number) => {
    return (Date.now() - startTime) / 1000
}