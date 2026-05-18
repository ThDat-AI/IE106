"use client"

import { useState } from 'react'
import { Bell, User, Settings, Heart, MessageSquare, Trash2, CheckCircle, ArrowLeft, Filter, Search, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import AppShell from '@/components/layout/app-shell'
import { useTranslation } from '@/lib/i18n-store'

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
    }
  ]

  const [notifications, setNotifications] = useState<Notification[]>(initialData)
  const [activeTab, setActiveTab] = useState<'all' | 'system' | 'activity'>('all')
  const [searchQuery, setSearchQuery] = useState('')

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
      <div className="max-w-4xl mx-auto py-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Link 
              href="/" 
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium uppercase tracking-widest">{t.backToHome || 'Back to Home'}</span>
            </Link>
            <h1 className="font-display text-5xl md:text-6xl tracking-tighter text-white mb-2">
              {t.notifications || 'Notifications'}
            </h1>
            <p className="text-white/40 text-lg max-w-xl">
              {t.notificationsDesc || 'Stay updated with your music journey, social interactions, and system alerts.'}
            </p>
          </div>
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-vw text-sm font-semibold uppercase tracking-wider"
          >
            <CheckCircle size={16} className="text-vw-purple" />
            {t.markAllAsRead || 'Mark all as read'}
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-vw-purple transition-colors" />
            <input 
              type="text"
              placeholder={t.searchNotifications || "Search notifications..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-vw-purple/50 focus:bg-white/[0.05] transition-vw text-sm"
            />
          </div>
          <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            {(['all', 'system', 'activity'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-vw ${
                  activeTab === tab 
                    ? 'bg-vw-purple text-white shadow-lg shadow-vw-purple/20' 
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                {tab === 'all' ? t.all || 'All' : tab === 'system' ? t.system || 'System' : t.activity || 'Activity'}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-12">
          {Object.entries(grouped).length > 0 ? (
            Object.entries(grouped).map(([date, notifs]) => (
              <div key={date} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/20">
                    {date}
                  </h2>
                  <div className="h-px flex-1 bg-white/[0.05]" />
                </div>
                <div className="space-y-4">
                  {notifs.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`group relative p-5 rounded-3xl border transition-vw ${
                        notif.read 
                          ? 'bg-white/[0.02] border-white/[0.03]' 
                          : 'bg-white/[0.05] border-white/[0.1] shadow-xl shadow-black/20'
                      } hover:bg-white/[0.07] hover:border-white/[0.15]`}
                    >
                      <div className="flex gap-5">
                        <div 
                          className="w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center transition-vw group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                          style={{
                            backgroundColor: `${notif.color}15`,
                            border: `1px solid ${notif.color}30`,
                            color: notif.color
                          }}
                        >
                          {notif.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <h3 className={`text-lg font-bold leading-tight transition-colors ${
                              notif.read ? 'text-white/70' : 'text-white'
                            } group-hover:text-white`}>
                              {notif.title}
                            </h3>
                            {!notif.read && (
                              <div className="w-2.5 h-2.5 rounded-full bg-vw-purple animate-pulse shadow-[0_0_10px_rgba(155,77,224,0.8)]" />
                            )}
                          </div>
                          <p className={`text-sm leading-relaxed mb-3 ${
                            notif.read ? 'text-white/40' : 'text-white/60'
                          } group-hover:text-white/70`}>
                            {notif.desc}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">
                              {notif.time} • {notif.type === 'system' ? t.system : t.activity}
                            </span>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notif.read && (
                                <button 
                                  onClick={() => markAsRead(notif.id)}
                                  className="p-2 rounded-lg bg-white/5 hover:bg-vw-purple/20 text-white/40 hover:text-vw-purple transition-vw"
                                  title={t.markAsRead || "Mark as read"}
                                >
                                  <CheckCircle size={16} />
                                </button>
                              )}
                              <button 
                                onClick={() => deleteNotification(notif.id)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-500 transition-vw"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-vw">
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-6">
                <Bell size={40} className="text-white/10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t.noNotificationsFound || 'No notifications found'}</h3>
              <p className="text-white/40 max-w-xs">
                {t.noNotificationsDesc || "We couldn't find any notifications matching your filters."}
              </p>
              <button 
                onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                className="mt-8 text-sm font-bold uppercase tracking-widest text-vw-purple hover:text-white transition-colors"
              >
                {t.clearAllFilters || 'Clear all filters'}
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
