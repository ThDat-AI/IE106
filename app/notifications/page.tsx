"use client"

import { useState, useEffect } from 'react'
import { Bell, User, Settings, Heart, MessageSquare, Trash2, CheckCircle, ArrowLeft, Filter, Search, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import AppShell from '@/components/layout/app-shell'
import { useTranslation } from '@/lib/i18n-store'
import { AmbientOrbs } from '@/components/ui/vibewave'

interface Notification {
  id: string
  type: 'system' | 'activity'
  title: string
  desc: string
  time: string
  date: string
  read: boolean
  icon: React.ReactNode
  color: string
}

interface NotificationCardProps {
  notif: Notification
  t: any
  markAsRead: (id: string) => void
  deleteNotification: (id: string) => void
}

function NotificationCard({ notif, t, markAsRead, deleteNotification }: NotificationCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Specs from GlassPanel variant="dark" in playlist detail page
  const glassStyle = {
    background: notif.read 
      ? 'linear-gradient(180deg, rgba(35, 27, 47, 0.45) 0%, rgba(22, 17, 30, 0.5) 100%)' 
      : 'linear-gradient(180deg, rgba(35, 27, 47, 0.85) 0%, rgba(22, 17, 30, 0.9) 100%)',
    backdropFilter: 'blur(20px)',
    border: isHovered 
      ? '1px solid rgba(155, 77, 224, 0.35)' 
      : notif.read 
        ? '1px solid rgba(255, 255, 255, 0.04)' 
        : '1px solid rgba(255, 255, 255, 0.07)',
    boxShadow: isHovered
      ? '0 30px 60px -15px rgba(0, 0, 0, 0.55), 0 0 30px rgba(155, 77, 224, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
      : notif.read 
        ? '0 15px 45px -20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)' 
        : '0 20px 60px -20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
  }

  return (
    <div 
      className="group relative p-5 rounded-3xl transition-all duration-500 overflow-hidden"
      style={glassStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Backing Ambient Colored Light */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[80px] pointer-events-none transition-all duration-500 ${
          notif.read ? 'opacity-0' : 'opacity-100'
        } group-hover:opacity-100`}
        style={{ backgroundColor: `${notif.color}12` }}
      />

      <div className="flex gap-5 relative z-10">
        <div 
          className="relative w-14 h-14 rounded-2xl bg-white/[0.04] backdrop-blur-md flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg border"
          style={{
            borderColor: notif.read ? 'rgba(255, 255, 255, 0.08)' : `${notif.color}30`,
            boxShadow: notif.read ? 'none' : `0 8px 24px -8px ${notif.color}40`,
            color: notif.color
          }}
        >
          <div 
            className="absolute inset-0 rounded-2xl opacity-10 transition-opacity duration-500 group-hover:opacity-20 pointer-events-none"
            style={{ backgroundColor: notif.color }}
          />
          <div className="relative z-10">
            {notif.icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className={`text-lg font-bold leading-tight transition-colors ${
              notif.read ? 'text-white/85' : 'text-white'
            } group-hover:text-white`}>
              {notif.title}
            </h3>
            {!notif.read && (
              <div className="w-2.5 h-2.5 rounded-full bg-vw-purple animate-pulse shadow-[0_0_10px_rgba(155,77,224,0.8)]" />
            )}
          </div>
          <p className={`text-sm leading-relaxed mb-3 transition-colors ${
            notif.read ? 'text-white/70' : 'text-white/90'
          } group-hover:text-white`}>
            {notif.desc}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 group-hover:text-white/90 transition-colors">
              {notif.time} • {notif.type === 'system' ? t.system : t.activity}
            </span>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notif.read && (
                <button 
                  onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                  className="p-2 rounded-lg bg-vw-purple text-white hover:bg-vw-purple/90 transition-all duration-200 shadow-sm shadow-purple-500/15 cursor-pointer"
                  title={t.markAsRead || "Mark as read"}
                >
                  <CheckCircle size={16} />
                </button>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-500 transition-all duration-200 cursor-pointer"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
              <button 
                onClick={(e) => e.stopPropagation()} 
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-200 cursor-pointer"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface NotificationEmptyStateProps {
  t: any
  onClearFilters: () => void
}

function NotificationEmptyState({ t, onClearFilters }: NotificationEmptyStateProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Specs from GlassPanel variant="dark" in playlist detail page
  const emptyGlassStyle = {
    background: 'linear-gradient(180deg, rgba(35, 27, 47, 0.85) 0%, rgba(22, 17, 30, 0.9) 100%)',
    backdropFilter: 'blur(20px)',
    border: isHovered 
      ? '1px solid rgba(155, 77, 224, 0.3)' 
      : '1px solid rgba(255, 255, 255, 0.07)',
    boxShadow: isHovered
      ? '0 30px 60px -15px rgba(0, 0, 0, 0.55), 0 0 30px rgba(155, 77, 224, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
      : '0 20px 60px -20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
  }

  return (
    <div 
      className="relative py-20 text-center flex flex-col items-center justify-center p-8 rounded-3xl overflow-hidden group/empty transition-all duration-500 animate-in fade-in zoom-in-95 duration-500"
      style={emptyGlassStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Backing Ambient Purple Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/[0.04] rounded-full blur-[80px] pointer-events-none" />
      
      {/* Floating Glowing Icon Bubble */}
      <div className="relative w-16 h-16 rounded-2xl bg-white/[0.06] backdrop-blur-md flex items-center justify-center mb-4 text-purple-400 border border-white/10 shadow-lg shadow-purple-500/5 group-hover/empty:scale-110 group-hover/empty:border-purple-500/30 group-hover/empty:shadow-purple-500/10 group-hover/empty:text-purple-300 transition-all duration-500">
        <Bell size={24} className="animate-pulse" />
      </div>
      
      <h3 className="relative z-10 text-base font-semibold text-white tracking-tight">
        {t.noNotificationsFound || 'Không tìm thấy thông báo'}
      </h3>
      
      <p className="relative z-10 text-xs text-white/75 mt-2 max-w-md leading-relaxed">
        {t.noNotificationsDesc || "Chúng tôi không tìm thấy thông báo nào khớp với bộ lọc của bạn."}
      </p>
      
      <button 
        onClick={onClearFilters}
        className="relative z-10 mt-6 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white/80 hover:bg-purple-500/10 hover:border-purple-500/20 hover:text-purple-300 hover:shadow-[0_0_20px_rgba(155,77,224,0.05)] transition-all duration-300 cursor-pointer shadow-md"
      >
        {t.clearAllFilters || 'Xóa bộ lọc'}
      </button>
    </div>
  )
}

export default function NotificationsPage() {
  const { t } = useTranslation()
  
  const initialData: Notification[] = [
    {
      id: '1',
      type: 'system',
      title: t.welcomeNotificationTitle || 'Welcome to VibeWave!',
      desc: (t.welcomeNotificationDesc || "Hello {name}, we've missed you! Enjoy your personalized music journey today.").replace('{name}', 'Alex Johnson'),
      time: t.justNow || 'Just now',
      date: t.todayLabel || 'Today',
      read: false,
      icon: <User size={20} />,
      color: '#9B4DE0'
    },
    {
      id: '2',
      type: 'activity',
      title: t.newAlbumNotificationTitle || 'New Album Release',
      desc: (t.newAlbumNotificationDesc || '{artist} just dropped "{album}". Check it out!').replace('{artist}', 'The Weeknd').replace('{album}', 'Dawn FM'),
      time: (t.hoursAgo || '{count} hours ago').replace('{count}', '2'),
      date: t.todayLabel || 'Today',
      read: false,
      icon: <Bell size={20} />,
      color: '#4338CA'
    },
    {
      id: '3',
      type: 'activity',
      title: t.systemUpdateNotificationTitle || 'System Update',
      desc: (t.systemUpdateNotificationDesc || 'VibeWave is now faster and smoother than ever. Version {version} is live.').replace('{version}', '2.4.0'),
      time: t.yesterday || 'Yesterday',
      date: t.yesterday || 'Yesterday',
      read: true,
      icon: <Settings size={20} />,
      color: '#22C55E'
    },
    {
      id: '4',
      type: 'activity',
      title: t.weeklyDiscoveryNotificationTitle || 'Weekly Discovery Ready',
      desc: t.weeklyDiscoveryNotificationDesc || 'Your personalized Weekly Discovery playlist is now available. 30 new tracks just for you.',
      time: (t.daysAgo || '{count} days ago').replace('{count}', '3'),
      date: t.thisWeekLabel || 'This Week',
      read: true,
      icon: <CheckCircle size={20} />,
      color: '#F59E0B'
    },
    {
      id: '5',
      type: 'activity',
      title: t.badgeNotificationTitle || 'Hardcore Listener Badge',
      desc: t.badgeNotificationDesc || 'Congratulations! You listened to music for over 10 hours last week.',
      time: (t.daysAgo || '{count} days ago').replace('{count}', '10'),
      date: t.earlierLabel || 'Earlier',
      read: true,
      icon: <Heart size={20} />,
      color: '#EC4899'
    },
    {
      id: '6',
      type: 'system',
      title: t.maintenanceNotificationTitle || 'Scheduled Maintenance Complete',
      desc: t.maintenanceNotificationDesc || 'The system has been successfully optimized to deliver the best experience.',
      time: (t.daysAgo || '{count} days ago').replace('{count}', '14'),
      date: t.earlierLabel || 'Earlier',
      read: true,
      icon: <Settings size={20} />,
      color: '#10B981'
    }
  ]

  const [notifications, setNotifications] = useState<Notification[]>(initialData)
  const [activeTab, setActiveTab] = useState<'all' | 'system' | 'activity'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Synchronize translations when language changes, preserving state (read status)
  useEffect(() => {
    setNotifications(prev => 
      prev.map(item => {
        const baseItem = initialData.find(init => init.id === item.id)
        if (baseItem) {
          return {
            ...item,
            title: baseItem.title,
            desc: baseItem.desc,
            time: baseItem.time,
            date: baseItem.date,
          }
        }
        return item
      })
    )
  }, [t])

  const filteredNotifs = notifications.filter(n => {
    const matchesTab = activeTab === 'all' || n.type === activeTab
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.desc.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const grouped = filteredNotifs.reduce((acc, n) => {
    if (!acc[n.date]) acc[n.date] = []
    acc[n.date].push(n)
    return acc
  }, {} as Record<string, Notification[]>)

  return (
    <AppShell>
      <div className="relative max-w-4xl mx-auto py-4">
        <AmbientOrbs position="absolute" />
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 font-display">
          <div>
            <Link 
              href="/" 
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4 group font-display"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold uppercase tracking-widest">{t.backToHome || 'Back to Home'}</span>
            </Link>
            <h1 className="font-display text-5xl md:text-6xl tracking-tighter font-bold text-white mb-2">
              {t.notifications || 'Notifications'}
            </h1>
            <p className="text-white/70 text-lg max-w-xl font-display font-light">
              {t.notificationsDesc || 'Stay updated with your music journey and system alerts.'}
            </p>
          </div>
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-vw-purple hover:bg-vw-purple/90 border border-vw-purple/20 transition-vw text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-purple-500/25 font-display"
          >
            <CheckCircle size={16} className="text-white" />
            {t.markAllAsRead || 'Mark all as read'}
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-purple-400 transition-colors" />
            <input 
              type="text"
              placeholder={t.searchNotifications || "Search notifications..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.15] backdrop-blur-md rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-purple-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(155,77,224,0.15)] transition-all duration-300 text-sm text-white placeholder:text-white/60"
            />
          </div>
          <div className="flex gap-2 p-1 bg-white/[0.02] border border-white/[0.08] backdrop-blur-md rounded-2xl shrink-0 items-center">
            {(['all', 'system', 'activity'] as const).map(tab => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 border border-purple-500/50 text-white shadow-lg shadow-purple-500/30' 
                      : 'bg-white/[0.08] border border-white/[0.15] text-white hover:bg-white/[0.18] hover:border-white/[0.3] hover:text-white'
                    }
                  `}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 animate-pulse shadow-[0_0_4px_#ffffff]" />
                  )}
                  {tab === 'all' ? t.all || 'All' : tab === 'system' ? t.system || 'System' : t.activity || 'Activity'}
                </button>
              )
            })}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-12">
          {Object.entries(grouped).length > 0 ? (
            Object.entries(grouped).map(([date, notifs]) => (
              <div key={date} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                    {date}
                  </h2>
                  <div className="h-px flex-1 bg-white/[0.05]" />
                </div>
                <div className="space-y-4">
                  {notifs.map((notif) => (
                    <NotificationCard
                      key={notif.id}
                      notif={notif}
                      t={t}
                      markAsRead={markAsRead}
                      deleteNotification={deleteNotification}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <NotificationEmptyState
              t={t}
              onClearFilters={() => { setActiveTab('all'); setSearchQuery(''); }}
            />
          )}
        </div>
      </div>
    </AppShell>
  )
}
