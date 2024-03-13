export function buildUTCDate(date: string) {
    const currDate = new Date(date).toUTCString()
    return new Date(currDate)
}
