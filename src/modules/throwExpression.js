export function throw_(ErrorType, ...args) {
    throw new ErrorType(...args);
}

export default throw_;