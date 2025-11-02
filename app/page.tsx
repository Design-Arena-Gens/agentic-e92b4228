'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { LLMConfig } from '@/components/LLMConfig'
import { TradingDashboard } from '@/components/TradingDashboard'
import { StrategyConfig } from '@/components/StrategyConfig'
import { PerformanceMetrics } from '@/components/PerformanceMetrics'
import { TradingHistory } from '@/components/TradingHistory'
import { useAccount } from 'wagmi'
import { Activity } from 'lucide-react'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary-500" />
            <h1 className="text-3xl font-bold">LLM Trading Platform</h1>
          </div>
          <ConnectButton />
        </header>

        {!isConnected ? (
          <div className="card text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">Conecte sua Carteira</h2>
            <p className="text-slate-400 mb-6">
              Conecte sua carteira Web3 para começar a fazer trades automatizados com IA
            </p>
            <ConnectButton />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LLMConfig />
              </div>
              <div>
                <StrategyConfig />
              </div>
            </div>

            <PerformanceMetrics />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TradingDashboard />
              <TradingHistory />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
