import { Link, Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-[#1D4ED8] text-white shadow">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-[1.5em] py-[0.9em]">
          <Link to="/" className="flex items-baseline gap-[0.6em]">
            <span className="text-[1.6em] font-bold tracking-wide">sola</span>
            <span className="text-[0.8em] opacity-80">
              有限会社ラックプラス 受注管理システム
            </span>
          </Link>
          <nav className="text-[0.85em]">
            <Link to="/" className="px-[0.8em] hover:underline">
              メニュー
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="max-w-[1600px] mx-auto px-[1.5em] py-[1.2em]">
          <Outlet />
        </div>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 text-[0.75em] text-slate-500">
        <div className="max-w-[1600px] mx-auto px-[1.5em] py-[0.8em] text-center">
          © 有限会社ラックプラス — sola
        </div>
      </footer>
    </div>
  )
}
