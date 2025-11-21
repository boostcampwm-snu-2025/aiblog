import { CommitData } from "./List"
import GenerateSummaryButton from "./GenerateSummaryButton"

interface CommitProps {
  data: CommitData
  isSelected?: boolean
  onSelect?: () => void
  onGenerateSummary?: () => void
}

export default function Commit({ data, isSelected, onSelect, onGenerateSummary }: CommitProps) {
  return (
    <div
      className={`w-full h-auto p-[15px] rounded-inner border-t-thin border-b-thin border-primary-line flex items-center justify-between gap-[8px] cursor-pointer transition-colors ${isSelected ? 'bg-gray-100' : ''}`}
      onClick={onSelect}
    >
      <div className="flex justify-center items-start flex-col gap-[8px] pl-[10px]">
        <div className="flex justify-between items-start gap-[10px]">
            <div className="text-title font-bold text-primary-login">{data.message}</div>
        </div>
        <div className="flex justify-between items-center">
            <div className="text-contents text-primary-line">{data.author} • {data.date}</div>
        </div>
      </div>
      <div className="w-[110px] h-[60px] flex items-center justify-end pr-[5px]" onClick={(e) => e.stopPropagation()}>
        <GenerateSummaryButton onClick={onGenerateSummary || (() => {})} />
      </div>
    </div>
  )
}