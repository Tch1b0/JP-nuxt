export function colorFromLang(lang: string): string | undefined {
    const colors: { [key: string]: string } = {
        go: "cyan",
        python: "blue",
        vue: "lime",
        typescript: "teal",
        crystal: "black",
        ruby: "red",
        html: "orange",
        javascript: "yellow",
        "c++": "pink",
        php: "blue",
        java: "brown",
    };
    return colors[lang];
}
