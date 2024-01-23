export function throwExpression(ErrorType, ...args) {
    throw new ErrorType(...args);
}

export default throwExpression;