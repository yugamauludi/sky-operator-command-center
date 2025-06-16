export default function formatTanggalUTC(input: string): string {
    if (!input) return "";
    const date = new Date(input);

    const day = date.getUTCDate();
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
}

export function formatDateOnly(input: string): string {
    const date = new Date(input);

    const day = date.getUTCDate();
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
        "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${day} ${month} ${year}`;
}
