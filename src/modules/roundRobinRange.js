export function *roundRobinRange(startValueInclusive=0, endValueExclusive=Number.MAX_SAFE_INTEGER) {
    value = startValueInclusive;
    while (true) {
        yield value++;
        if (value >= endValueExclusive) {
            value = startValueInclusive;
        }
    }
}

export default roundRobinRange;