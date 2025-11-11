export const formatDateTime = (dateString: string, showTime: boolean = false): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Unknown';
    }
    return showTime ? date.toLocaleString() : date.toLocaleDateString();
};
