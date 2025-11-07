// Helper to format date strings (e.g., "2023-10-27T10:00:00Z" -> "2023-10-27")
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (e) {
    return dateString;
  }
};
