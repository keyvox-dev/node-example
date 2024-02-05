export function formatDateTimestamp(timestamp) {
    const formatter = new Intl.DateTimeFormat('en-gb', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    })
    const date = Date.parse(timestamp)

    return formatter.format(date)
}