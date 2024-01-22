import { MILLIS_PER_SECOND, SECONDS_PER_MINUTE, MINUTES_PER_HOUR } from "./constants/timeConversionFactors.js";

function toMilliseconds({ hours, minutes, seconds, milliseconds }) {
    return (milliseconds || 0) +
           (seconds      || 0) * MILLIS_PER_SECOND +
           (minutes      || 0) * SECONDS_PER_MINUTE * MILLIS_PER_SECOND +
           (hours        || 0) * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLIS_PER_SECOND;
};

export default toMilliseconds;