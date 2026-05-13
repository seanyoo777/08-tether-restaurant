import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { Card } from '../../components/Card'
import { MockBanner } from '../../components/MockBanner'
import { mockStores } from '../../mock/catalog'

export function SearchPage() {
  const [q, setQ] = useState('')
  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return mockStores
    return mockStores.filter(
      (s) =>
        s.name.toLowerCase().includes(t) ||
        s.category.toLowerCase().includes(t) ||
        s.tags.some((x) => x.toLowerCase().includes(t)),
    )
  }, [q])

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      <MockBanner />
      <label className="block">
        <span className="sr-only">가게 검색</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="가게 이름, 카테고리, 태그 검색"
          className="w-full rounded-xl border border-[var(--color-tr-border)] bg-[var(--color-tr-surface)] px-4 py-3 text-sm outline-none ring-[var(--color-tr-accent)]/30 placeholder:text-[var(--color-tr-muted)] focus:border-[var(--color-tr-accent)] focus:ring-2"
        />
      </label>
      <p className="text-xs text-[var(--color-tr-muted)]">{results.length}곳</p>
      <div className="grid gap-2">
        {results.map((s) => (
          <Link key={s.id} to={`/stores/${s.id}`}>
            <Card className="py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-lg">{s.bannerEmoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{s.name}</p>
                  <p className="text-xs text-[var(--color-tr-muted)]">{s.category}</p>
                </div>
                <span className="text-xs text-[var(--color-tr-muted)]">›</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
