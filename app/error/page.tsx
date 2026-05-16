"use client"

import { useEffect } from 'react'

export default function TriggerErrorPage() {
  useEffect(() => {
    // Kích hoạt lỗi ngay khi trang vừa load
    throw new Error("Giao diện xem trước trang báo lỗi (Preview Error Page)")
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#170F23]">
      <p className="text-white/50 animate-pulse">Đang tải trang báo lỗi...</p>
    </div>
  )
}
