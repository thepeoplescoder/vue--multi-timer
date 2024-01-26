export const LITERAL = (() => {
    const table = {
        '.': "\\.",
        ':': "\\:",
    };
    return function LITERAL(ch) {
        return ch in table ? table[ch] : ch;
    }
})();

export const DIGIT = "\\d";

export const BEGIN = {
    STRING:        '^',
    CAPTURE_GROUP: '(',
};

export const END = {
    STRING:        '$',
    CAPTURE_GROUP: ')',
};

export function REPEAT(n) {
    return { TIMES: ['{', n, '}'].join('') };
}

export default {
    BEGIN, END,
    LITERAL,
    DIGIT,
    REPEAT,
};