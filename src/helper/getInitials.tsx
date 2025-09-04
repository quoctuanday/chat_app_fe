export function getInitials(name: string): string {
    if (!name) return '?';
    return name
        .split(' ')
        .filter(Boolean)
        .map((word) => word[0].toUpperCase())
        .join('')
        .slice(0, 2);
}
