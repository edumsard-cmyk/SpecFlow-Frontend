import { fill } from '@/lib/i18n/fill'

type TFn = (key: string) => string

export function formatAdminMonthChange(
  t: TFn,
  thisMonth: number,
  previousMonth: number
): string {
  if (thisMonth === 0 && previousMonth === 0) {
    return t('admin.statChange.noneBoth')
  }
  if (thisMonth === 0) return t('admin.statChange.noneThis')
  if (previousMonth === 0) {
    return fill(t('admin.statChange.plusThis'), { n: thisMonth })
  }
  const diff = thisMonth - previousMonth
  if (diff > 0) {
    return fill(t('admin.statChange.plusVs'), { diff })
  }
  if (diff < 0) {
    return fill(t('admin.statChange.minusVs'), { diff })
  }
  return fill(t('admin.statChange.sameThis'), { n: thisMonth })
}
