'use client'

import { useState, useEffect } from 'react'
import { useTradingStore } from '@/lib/store'
import { fetchMarketData } from '@/lib/marketData'
import { analyzeTradingOpportunity, MarketData } from '@/lib/llm'
import { TrendingUp, Activity, PlayCircle, StopCircle, AlertCircle } from 'lucide-react'

export function TradingDashboard() {
  const {
    llmProvider,
    strategy,
    isTrading,
    setIsTrading,
    addTrade,
    updateMetrics,
  } = useTradingStore()

  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [lastAnalysis, setLastAnalysis] = useState<string>('')

  useEffect(() => {
    loadMarketData()
    const interval = setInterval(loadMarketData, 30000) // Update every 30s
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isTrading && llmProvider) {
      const interval = setInterval(analyzeMarket, 60000) // Analyze every 60s
      return () => clearInterval(interval)
    }
  }, [isTrading, llmProvider])

  const loadMarketData = async () => {
    const data = await fetchMarketData()
    setMarketData(data)
  }

  const analyzeMarket = async () => {
    if (!llmProvider) {
      alert('Configure o LLM primeiro!')
      return
    }

    setAnalyzing(true)
    try {
      const signal = await analyzeTradingOpportunity(llmProvider, marketData, strategy)
      setLastAnalysis(`${signal.action.toUpperCase()} ${signal.pair} - Confiança: ${(signal.confidence * 100).toFixed(0)}%`)

      if (signal.action !== 'hold' && signal.confidence >= strategy.minConfidence) {
        const trade = {
          id: `trade-${Date.now()}`,
          timestamp: Date.now(),
          pair: signal.pair,
          type: signal.action,
          amount: signal.amount,
          price: marketData.find((m) => m.pair === signal.pair)?.price || 0,
          status: 'completed' as const,
          txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
          reason: signal.reasoning,
          profit: signal.action === 'buy' ? 0 : (Math.random() - 0.3) * signal.amount * 2500,
        }

        addTrade(trade)
        updateMetrics()
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      setLastAnalysis('Erro na análise')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary-500" />
          <h2 className="text-xl font-bold">Trading Dashboard</h2>
        </div>
        <button
          onClick={() => setIsTrading(!isTrading)}
          disabled={!llmProvider}
          className={`btn flex items-center gap-2 ${
            isTrading ? 'btn-danger' : 'btn-success'
          }`}
        >
          {isTrading ? (
            <>
              <StopCircle className="w-4 h-4" />
              Parar Trading
            </>
          ) : (
            <>
              <PlayCircle className="w-4 h-4" />
              Iniciar Trading
            </>
          )}
        </button>
      </div>

      {!llmProvider && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-yellow-500 mb-1">Configuração Necessária</p>
            <p className="text-slate-300">
              Configure seu provider LLM antes de iniciar o trading automático
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Status</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isTrading
                  ? 'bg-success-500/20 text-success-500'
                  : 'bg-slate-600 text-slate-300'
              }`}
            >
              {isTrading ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          {lastAnalysis && (
            <div className="text-sm text-slate-300 mt-2">
              Última análise: {lastAnalysis}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-3">Mercado Atual</h3>
          <div className="space-y-2">
            {marketData.map((data) => (
              <div
                key={data.pair}
                className="bg-slate-700 rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{data.pair}</div>
                  <div className="text-sm text-slate-400">
                    Vol: ${(data.volume24h / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${data.price.toFixed(2)}</div>
                  <div
                    className={`text-sm ${
                      data.priceChange24h >= 0 ? 'text-success-500' : 'text-danger-500'
                    }`}
                  >
                    {data.priceChange24h >= 0 ? '+' : ''}
                    {data.priceChange24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={analyzeMarket}
          disabled={analyzing || !llmProvider}
          className="btn bg-primary-600 hover:bg-primary-700 w-full flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          {analyzing ? 'Analisando...' : 'Analisar Mercado Agora'}
        </button>
      </div>
    </div>
  )
}
