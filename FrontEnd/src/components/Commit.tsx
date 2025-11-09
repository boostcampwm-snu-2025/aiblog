import { CommitData } from "./List"

interface CommitProps {
  data: CommitData
}

export default function Commit({ data }: CommitProps) {
  return (
    <div className="w-full h-auto p-[15px] rounded-inner border-t-thin border-b-thin border-primary-line flex items-center justify-between gap-[8px]">
      <div className="flex justify-center items-start flex-col gap-[8px] pl-[10px]">
        <div className="flex justify-between items-start gap-[10px]">
            <div className="text-title font-bold text-primary-login">{data.message}</div>
        </div>
        <div className="flex justify-between items-center">
            <div className="text-contents text-primary-line">{data.author} • {data.date}</div>
        </div>
      </div>
      <button className="w-[66px] h-[60px] flex items-center justify-end pr-[10px]">
        <img src={'/assets/github-mark.svg'} alt="commit" className="w-[24px] h-[24px]" />
      </button>
    </div>
  )
}