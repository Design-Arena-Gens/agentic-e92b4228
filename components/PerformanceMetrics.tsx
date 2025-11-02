'use client'

import { useTradingStore } from '@/lib/store'
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'

export function PerformanceMetrics() {
  const { trades, totalProfit, winRate, updateMetrics } = useTradingStore()
  const [stats, setStats] = useState({
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    avgProfit: 0,
  })

  useEffect(() => {
    updateMetrics()

    const completedTrades = trades.filter((t) => t.status === 'completed')
    const winningTrades = completedTrades.filter((t) => (t.profit || 0) > 0)
    const losingTrades = completedTrades.filter((t) => (t.profit || 0) < 0)
    const avgProfit = completedTrades.length > 0
      ? completedTrades.reduce((sum, t) => sum + (t.profit || 0), 0) / completedTrades.length
      : 0

    setStats({
      totalTrades: completedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      avgProfit,
    })
  }, [trades])

  const metrics = [
    {
      label: 'Lucro Total',
      value: `$${totalProfit.toFixed(2)}`,
      icon: DollarSign,
      color: totalProfit >= 0 ? 'text-success-500' : 'text-danger-500',
      bgColor: totalProfit >= 0 ? 'bg-success-500/10' : 'bg-danger-500/10',
    },
    {
      label: 'Win Rate',
      value: `${winRate.toFixed(1)}%`,
      icon: Target,
      color: winRate >= 60 ? 'text-success-500' : winRate >= 50 ? 'text-yellow-500' : 'text-danger-500',
      bgColor: winRate >= 60 ? 'bg-success-500/10' : winRate >= 50 ? 'bg-yellow-500/10' : 'bg-danger-500/10',
    },
    {
      label: 'Trades Vencedores',
      value: stats.winningTrades,
      icon: TrendingUp,
      color: 'text-success-500',
      bgColor: 'bg-success-500/10',
    },
    {
      label: 'Trades Perdedores',
      value: stats.losingTrades,
      icon: TrendingDown,
      color: 'text-danger-500',
      bgColor: 'bg-danger-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <div key={metric.label} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">{metric.label}</p>
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              </div>
              <div className={`${metric.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
