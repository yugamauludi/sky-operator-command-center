export const getStatusColor = (status: string | null | undefined) => {
  if (!status) {
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
  switch (status.toUpperCase()) {
    case "FREE":
    case "COMPLETED":
      return "bg-green-50 text-green-700 dark:bg-green-900/10 dark:text-green-200";
    case "PENDING":
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/10 dark:text-yellow-200";
    case "PAID":
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/10 dark:text-blue-200";
    default:
      return "bg-gray-50 text-gray-700 dark:bg-gray-900/10 dark:text-gray-200";
  }
};
