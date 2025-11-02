'use client'

import { useTradingStore } from '@/lib/store'
import { Settings, Shield } from 'lucide-react'

export function StrategyConfig() {
  const { strategy, setStrategy } = useTradingStore()

  const handleUpdate = (key: string, value: any) => {
    setStrategy({ ...strategy, [key]: value })
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-6 h-6 text-primary-500" />
        <h2 className="text-xl font-bold">Estratégia</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nível de Risco</label>
          <select
            value={strategy.riskLevel}
            onChange={(e) => handleUpdate('riskLevel', e.target.value)}
            className="input w-full"
          >
            <option value="low">Baixo</option>
            <option value="medium">Médio</option>
            <option value="high">Alto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Valor Máximo por Trade (ETH)
          </label>
          <input
            type="number"
            step="0.01"
            value={strategy.maxTradeAmount}
            onChange={(e) => handleUpdate('maxTradeAmount', parseFloat(e.target.value))}
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Stop Loss (%)
          </label>
          <input
            type="number"
            value={strategy.stopLossPercent}
            onChange={(e) => handleUpdate('stopLossPercent', parseFloat(e.target.value))}
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Take Profit (%)
          </label>
          <input
            type="number"
            value={strategy.takeProfitPercent}
            onChange={(e) => handleUpdate('takeProfitPercent', parseFloat(e.target.value))}
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Trades Máximos por Dia
          </label>
          <input
            type="number"
            value={strategy.maxDailyTrades}
            onChange={(e) => handleUpdate('maxDailyTrades', parseInt(e.target.value))}
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Confiança Mínima (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={strategy.minConfidence * 100}
            onChange={(e) => handleUpdate('minConfidence', parseFloat(e.target.value) / 100)}
            className="input w-full"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium">Stop Loss Ativo</span>
          <input
            type="checkbox"
            checked={strategy.enableStopLoss}
            onChange={(e) => handleUpdate('enableStopLoss', e.target.checked)}
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Take Profit Ativo</span>
          <input
            type="checkbox"
            checked={strategy.enableTakeProfit}
            onChange={(e) => handleUpdate('enableTakeProfit', e.target.checked)}
            className="w-5 h-5"
          />
        </div>

        <div className="bg-slate-700 rounded-lg p-4 flex items-start gap-3 mt-4">
          <Shield className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-success-500 mb-1">Proteção Ativa</p>
            <p className="text-slate-300">
              Sistema de gestão de risco configurado para maximizar lucro e minimizar perdas
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
