export function buildUTCDate() {
    const currDate = new Date()
    return new Date(
        Date.UTC(
            currDate.getUTCFullYear(),
            currDate.getUTCMonth(),
            currDate.getUTCDate(),
            currDate.getUTCHours(),
            currDate.getUTCMinutes(),
            currDate.getUTCSeconds()
        )
    )
}
