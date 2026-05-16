type Props = {
  compact?: boolean
}

/** OneAI Event Hub mock 브랜딩 — 실 로고 에셋 없음 */
export function OneAiLogo({ compact }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 font-semibold text-violet-300 ${
        compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span
        className={`flex items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 font-bold text-white ${
          compact ? 'h-4 w-4 text-[8px]' : 'h-5 w-5 text-[9px]'
        }`}
        aria-hidden
      >
        AI
      </span>
      OneAI Event Hub
    </span>
  )
}
