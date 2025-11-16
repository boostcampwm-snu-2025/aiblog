import LoginButton from './LoginButton'

interface HeaderProps {
  onLogoClick: () => void
  navigationButtonText?: string
  navigationButtonOnClick?: () => void
  isAuthenticated?: boolean
  onAuthClick: () => void
}

export default function Header({
  onLogoClick,
  navigationButtonText,
  navigationButtonOnClick,
  isAuthenticated = false,
  onAuthClick,
}: HeaderProps) {
  return (
    <header className="w-full h-[100px] flex border-b border-primary-line" aria-label="header">
      <div className="w-full h-full flex gap-[8px] pl-[45px] cursor-pointer" onClick={onLogoClick}>
        <div className="w-[150px] font-bold text-header flex items-center">Smart Blog</div>
        <div className="font-regular text-caption flex mt-[35px]">with</div>
        <img src={'/assets/GitHub_Logo.png'} alt="logo" className="w-[56px] h-[23px] mt-[32px] -translate-x-[8px]" />
      </div>
      <div className="w-full h-full flex justify-end mr-[30px] items-center gap-[10px]">
        {navigationButtonText && navigationButtonOnClick && (
          <div
            className="w-[100px] h-[40px] flex items-center justify-center text-black font-bold text-caption mr-[10px] cursor-pointer hover:opacity-70"
            onClick={navigationButtonOnClick}
          >
            {navigationButtonText}
          </div>
        )}
        <LoginButton isAuthenticated={isAuthenticated} onClick={onAuthClick} />
      </div>
    </header>
  )
}

