export const addOpacity = (color: string, opacity: number): string => {
    const decimalValue = Math.round(opacity * 255)
    const hexValue = decimalValue.toString(16).toUpperCase().padStart(2, '0')
    return color + hexValue
}
