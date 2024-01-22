import { MILLIS_PER_SECOND, SECONDS_PER_MINUTE, MINUTES_PER_HOUR } from "./constants/timeConversionFactors.js";

function toMilliseconds({ hours, minutes, seconds, milliseconds }) {
    return (milliseconds || 0) +
           MILLIS_PER_SECOND * ((seconds || 0) +
                                (minutes || 0) * SECONDS_PER_MINUTE +
                                (hours   || 0) * MINUTES_PER_HOUR * SECONDS_PER_MINUTE);
};

export default toMilliseconds;