export const statusColors = (
  noticeType: string,
  severity: string | null
): string => {
  if (noticeType === 'maintenance') return 'bg-info text-info-content';
  if (!severity || severity === 'major') return 'bg-error text-error-content';
  return 'bg-warning text-warning-content';
};
