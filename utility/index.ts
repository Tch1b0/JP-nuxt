export function colorFromLang(lang: string): string | undefined {
    const colors: Map<string, string> = new Map([
        ["go", "cyan"],
        ["python", "blue"],
        ["vue", "lime"],
        ["typescript", "teal"],
        ["crystal", "black"],
        ["ruby", "red"],
        ["html", "orange"],
        ["javascript", "yellow"],
        ["c[++", "pink"],
        ["php", "blue"],
        ["java", "brown"],
    ]);
    return colors.get(lang);
}
