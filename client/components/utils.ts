export const capitalize = (s: string) => {
    s = s.replace('-', " ")
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}