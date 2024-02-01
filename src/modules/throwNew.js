export function throwNew(ErrorType, ...args) {
    throw new ErrorType(...args);
}

export default throwNew;