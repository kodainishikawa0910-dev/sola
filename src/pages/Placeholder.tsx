import { Link } from 'react-router-dom'

type Props = {
  title: string
  accent?: string
}

export default function Placeholder({ title, accent = 'bg-slate-200' }: Props) {
  return (
    <div className="py-[1em]">
      <div className={`${accent} rounded-[0.5em] px-[1em] py-[0.8em] mb-[1em]`}>
        <h1 className="text-[1.4em] font-semibold text-slate-800">{title}</h1>
      </div>
      <p className="text-slate-600">この画面は現在準備中です。</p>
      <div className="mt-[1.2em]">
        <Link
          to="/"
          className="text-[#1D4ED8] hover:underline text-[0.9em]"
        >
          ← メニューへ戻る
        </Link>
      </div>
    </div>
  )
}
