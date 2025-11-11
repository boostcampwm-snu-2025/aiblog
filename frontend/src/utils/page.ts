export interface PaginationResult<T> {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    rangeStart: number;
    rangeEnd: number;
    items: T[];
}

export const paginate = <T>(items: T[], page: number, pageSize: number): PaginationResult<T> => {
    const totalItems = items.length;
    const safePageSize = Math.max(pageSize, 1);
    const totalPages = safePageSize > 0 ? Math.ceil(totalItems / safePageSize) : 0;

    if (totalItems === 0) {
        return {
            totalItems,
            totalPages: 0,
            currentPage: 0,
            pageSize: safePageSize,
            rangeStart: 0,
            rangeEnd: 0,
            items: [],
        };
    }

    const maxPageIndex = Math.max(totalPages - 1, 0);
    const safePage = Math.min(Math.max(page, 0), maxPageIndex);
    const startIndex = safePage * safePageSize;
    const endIndex = Math.min(startIndex + safePageSize, totalItems);

    return {
        totalItems,
        totalPages,
        currentPage: safePage,
        pageSize: safePageSize,
        rangeStart: startIndex + 1,
        rangeEnd: endIndex,
        items: items.slice(startIndex, endIndex),
    };
};
