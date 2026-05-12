import React, { useEffect, useRef } from 'react'
import { SearchOutlined, CloseOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { useNavigate } from 'react-router-dom'

import { useSearchCostumes } from '@/features/costume-rental/hooks/useSearchCostumes'
import { Input } from '@/shared/components/Input'
import { VI } from '@/shared/i18n/vi'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const navigate = useNavigate()
  const { search, clearResults, results, isLoading } = useSearchCostumes()
  const [keyword, setKeyword] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (value: string) => {
    setKeyword(value)
    setIsOpen(value.trim().length > 0)
    search(value)
  }

  const handleClear = () => {
    setKeyword('')
    clearResults()
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleViewAll = () => {
    setIsOpen(false)
    setKeyword('')
    clearResults()
    navigate(`/costumes?keyword=${encodeURIComponent(keyword.trim())}`)
  }

  const handleViewDetail = (id: string) => {
    setIsOpen(false)
    setKeyword('')
    clearResults()
    navigate(`/costumes/${id}`)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const showDropdown = isOpen && (keyword.trim().length > 0)

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full min-w-0 max-w-[min(20rem,88vw)] md:max-w-[22rem]', className)}
    >
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 z-10 text-muted-foreground [&_.anticon]:text-base">
          {isLoading ? <Spin size="small" className="text-cosmate-pink" /> : <SearchOutlined />}
        </span>
        <Input
          ref={inputRef}
          value={keyword}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => keyword.trim().length > 0 && setIsOpen(true)}
          placeholder={VI.costumeRental.searchPlaceholder}
          className={cn(
            'h-9! rounded-full! border-cosmate-lavender-border! bg-background/95! pr-8! pl-9! text-sm! text-foreground! shadow-sm ring-0 transition-[box-shadow,border-color,background-color] duration-200',
            'placeholder:text-muted-foreground',
            'hover:border-cosmate-pink/35 hover:bg-cosmate-soft-pink/25 hover:shadow-md',
            'focus-visible:border-cosmate-pink/50 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-cosmate-pink/30 focus-visible:ring-offset-0'
          )}
          aria-label={VI.costumeRental.searchPlaceholder}
          autoComplete="off"
        />
        {keyword && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={VI.costumeRental.searchClearAria}
            className="absolute right-2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-cosmate-soft-pink/50 hover:text-cosmate-pink"
          >
            <CloseOutlined className="text-xs" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-80 max-w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-cosmate-lavender-border bg-card text-card-foreground shadow-lg ring-1 ring-cosmate-pink/10">
          <div className="overflow-hidden rounded-2xl">
            {results.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <span
                  aria-hidden
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cosmate-soft-pink/50 text-cosmate-pink"
                >
                  <SearchOutlined className="text-2xl" />
                </span>
                <p className="text-sm font-semibold text-foreground">{VI.costumeRental.searchNoResults}</p>
                <p className="text-xs text-muted-foreground">{VI.costumeRental.searchTryOtherKeyword}</p>
              </div>
            ) : (
              <>
                <ul className="max-h-80 overflow-y-auto py-2">
                  {results.slice(0, 6).map((costume) => (
                    <li key={costume.id}>
                      <button
                        type="button"
                        onClick={() => handleViewDetail(costume.id)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-cosmate-soft-pink/40"
                      >
                        <img
                          src={costume.images[0] || 'https://placehold.co/80x80/e2e8f0/94a3b8?text=No+Image'}
                          alt={costume.name}
                          className="h-14 w-14 shrink-0 rounded-xl border border-border object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-medium text-foreground">{costume.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{costume.description}</p>
                          <p className="mt-0.5 text-sm font-semibold text-cosmate-pink">
                            {costume.priceMin}k–{costume.priceMax}k
                            <span className="text-xs font-normal text-muted-foreground">
                              {VI.costumeRental.perDayShort}
                            </span>
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border px-4 py-2">
                  <button
                    type="button"
                    onClick={handleViewAll}
                    className="w-full rounded-xl py-2 text-center text-sm font-semibold text-cosmate-pink transition-colors hover:bg-cosmate-soft-pink/45"
                  >
                    {VI.costumeRental.searchViewAllResults} ({results.length})
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
