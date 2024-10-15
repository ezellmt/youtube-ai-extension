import SummaryActions from "~src/components/summary-actions"
import SummaryContent from "~src/components/summary-content"

interface SummaryProps {}

export default function Summary({}: SummaryProps) {
  return (
    <>
      <SummaryActions />
      <SummaryContent />
    </>
  )
}
