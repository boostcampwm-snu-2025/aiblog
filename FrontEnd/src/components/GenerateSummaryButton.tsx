interface GenerateSummaryButtonProps {
  onClick: () => void
  disabled?: boolean
}

export default function GenerateSummaryButton({ onClick, disabled = false }: GenerateSummaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-[100px] px-[12px] py-[8px] rounded-inner border-thin border-primary-line bg-primary-bg text-contents text-primary-login hover:bg-primary-line hover:text-primary-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Generate Summary
    </button>
  )
}
