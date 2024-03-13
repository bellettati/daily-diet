export function getDateHourDifference(currentDate: string, lastDate: string) {
    const timestampOne = new Date(currentDate).getTime()
    const timestampTwo = new Date(lastDate).getTime()

    const timeDifference = Math.abs(timestampOne - timestampTwo)
    const hourDifference = Math.floor(timeDifference / (1000 * 60 * 60))

    return hourDifference
}
