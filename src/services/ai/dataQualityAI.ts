import type { DataQualityIssue, InterfaceConnection } from '../../types/domain'

export function generateDataQualityInsights(issues: DataQualityIssue[], interfaces: InterfaceConnection[]) {
  const open = issues.filter(i => i.status !== 'Resolved')
  const degraded = interfaces.filter(i => ['Delayed', 'Degraded', 'Offline'].includes(i.status))
  return [
    `${open.length} data-quality issue${open.length === 1 ? '' : 's'} require review in this synthetic environment.`,
    degraded.length ? `${degraded.length} integration feed${degraded.length === 1 ? '' : 's'} may affect data freshness.` : 'All monitored demo interfaces are current.',
    'AI-generated data-quality observations are operational aids and require human review.',
  ]
}
