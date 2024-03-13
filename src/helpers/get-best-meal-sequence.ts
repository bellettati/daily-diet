export function getBestMealSequence(meals: { inside_diet: boolean }[]) {
    return meals.reduce(
        (result, current) => {
            if (current.inside_diet) {
                result.currSequence++
                result.maxSequence = Math.max(
                    result.currSequence,
                    result.maxSequence
                )
            } else {
                result.currSequence = 0
            }

            return result
        },
        { currSequence: 0, maxSequence: 0 }
    ).maxSequence
}
