'use client'

import { useTradingStore } from '@/lib/store'
import { History, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function TradingHistory() {
  const { trades } = useTradingStore()

  const recentTrades = [...trades]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-6 h-6 text-primary-500" />
        <h2 className="text-xl font-bold">Histórico de Trades</h2>
      </div>

      {recentTrades.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p>Nenhum trade realizado ainda</p>
          <p className="text-sm mt-2">Inicie o trading automático para ver seu histórico</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {recentTrades.map((trade) => (
            <div
              key={trade.id}
              className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {trade.type === 'buy' ? (
                    <TrendingUp className="w-5 h-5 text-success-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-danger-500" />
                  )}
                  <div>
                    <div className="font-semibold">
                      {trade.type.toUpperCase()} {trade.pair}
                    </div>
                    <div className="text-xs text-slate-400">
                      {formatDistanceToNow(trade.timestamp, {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{trade.amount} ETH</div>
                  {trade.profit !== undefined && (
                    <div
                      className={`text-sm ${
                        trade.profit >= 0 ? 'text-success-500' : 'text-danger-500'
                      }`}
                    >
                      {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm text-slate-300 mb-2">
                Preço: ${trade.price.toFixed(2)}
              </div>

              {trade.reason && (
                <div className="text-xs text-slate-400 bg-slate-800 rounded p-2 mb-2">
                  {trade.reason}
                </div>
              )}

              {trade.txHash && (
                <a
                  href={`https://etherscan.io/tx/${trade.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
                >
                  Ver na Etherscan
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    trade.status === 'completed'
                      ? 'bg-success-500/20 text-success-500'
                      : trade.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : 'bg-danger-500/20 text-danger-500'
                  }`}
                >
                  {trade.status === 'completed'
                    ? 'Concluído'
                    : trade.status === 'pending'
                    ? 'Pendente'
                    : 'Falhou'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
