import { PullRequestData } from "./List"
import GenerateSummaryButton from "./GenerateSummaryButton"

interface PullRequestProps {
  data: PullRequestData
  onGenerateSummary?: () => void
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'open':
      return 'text-green-600'
    case 'closed':
      return 'text-red-600'
    case 'merged':
      return 'text-purple-600'
    default:
      return 'text-primary-line'
  }
}

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'open':
      return 'Open'
    case 'closed':
      return 'Closed'
    case 'merged':
      return 'Merged'
    default:
      return 'Unknown'
  }
}

export default function PullRequest({ data, onGenerateSummary }: PullRequestProps) {
  return (
    <div className="w-full h-auto p-[15px] rounded-inner border-t-thin border-b-thin border-primary-line flex items-center justify-between gap-[8px]">
      <div className="flex justify-center items-start flex-col gap-[8px] pl-[10px]">
        <div className="flex justify-between items-start gap-[10px]">
          <div className="text-title font-bold text-primary-login">
            {data.number && <span className="text-primary-line">#{data.number} </span>}
            {data.title}
          </div>
        </div>
        <div className="flex justify-between items-center gap-[8px]">
          <div className="text-contents text-primary-line">{data.author} • {data.date}</div>
          {data.status && (
            <div className={`text-contents font-semibold ${getStatusColor(data.status)}`}>
              {getStatusLabel(data.status)}
            </div>
          )}
        </div>
      </div>
      <div className="w-[110px] h-[60px] flex items-center justify-end pr-[5px]">
        <GenerateSummaryButton onClick={onGenerateSummary || (() => {})} />
      </div>
    </div>
  )
}