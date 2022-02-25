export const useAuthed = () => {
    return useState<boolean>("authed", () => false);
};
