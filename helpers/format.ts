export function formatPhoneNumber(phone: string) {
    const cleaned = phone.replace(/[^\d+]/g, '');

    if (cleaned.startsWith('+')) {
        return cleaned.replace(/(\+\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?/, '$1 $2 $3 $4 $5');
    }
    return cleaned;
}
