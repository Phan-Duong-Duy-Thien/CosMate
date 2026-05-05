import React, { useEffect, useRef } from 'react'
import { SearchOutlined, CloseOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { useNavigate } from 'react-router-dom'

import { useSearchCostumes } from '@/features/costume-rental/hooks/useSearchCostumes'
import { Input } from '@/shared/components/Input'
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
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative flex items-center">
        <span className="absolute left-3 z-10 text-slate-400">
          {isLoading ? <Spin size="small" /> : <SearchOutlined />}
        </span>
        <Input
          ref={inputRef}
          value={keyword}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => keyword.trim().length > 0 && setIsOpen(true)}
          placeholder="Tìm kiếm trang phục..."
          className="pl-9! pr-8! h-9! rounded-full! text-sm!"
          aria-label="Tìm kiếm trang phục"
          autoComplete="off"
        />
        {keyword && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <CloseOutlined className="text-xs" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-80 rounded-2xl border border-slate-100 bg-white shadow-xl">
          <div className="overflow-hidden rounded-2xl">
            {results.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <span className="text-3xl">🔍</span>
                <p className="text-sm font-medium text-slate-600">Không tìm thấy trang phục</p>
                <p className="text-xs text-slate-400">Thử lại với từ khóa khác</p>
              </div>
            ) : (
              <>
                <ul className="max-h-80 overflow-y-auto py-2">
                  {results.slice(0, 6).map((costume) => (
                    <li key={costume.id}>
                      <button
                        type="button"
                        onClick={() => handleViewDetail(costume.id)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-pink-50"
                      >
                        <img
                          src={costume.images[0] || 'https://placehold.co/80x80/e2e8f0/94a3b8?text=No+Image'}
                          alt={costume.name}
                          className="h-14 w-14 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-medium text-slate-800">{costume.name}</p>
                          <p className="truncate text-xs text-slate-500">{costume.description}</p>
                          <p className="mt-0.5 text-sm font-semibold text-pink-600">
                            {costume.priceMin}k–{costume.priceMax}k<span className="text-xs font-normal text-slate-400">/day</span>
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-slate-100 px-4 py-2">
                  <button
                    type="button"
                    onClick={handleViewAll}
                    className="w-full rounded-xl py-2 text-center text-sm font-medium text-pink-600 transition hover:bg-pink-50"
                  >
                    View all results ({results.length})
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
