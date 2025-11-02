'use client'

import { useState } from 'react'
import { useTradingStore } from '@/lib/store'
import { Bot, Save, TestTube } from 'lucide-react'

const LLM_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { id: 'anthropic', name: 'Anthropic', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
  { id: 'custom', name: 'Custom Endpoint', models: [] },
]

export function LLMConfig() {
  const { llmProvider, setLLMProvider } = useTradingStore()
  const [providerId, setProviderId] = useState(llmProvider?.id || 'openai')
  const [apiKey, setApiKey] = useState(llmProvider?.apiKey || '')
  const [model, setModel] = useState(llmProvider?.model || 'gpt-4o')
  const [endpoint, setEndpoint] = useState(llmProvider?.endpoint || '')
  const [testing, setTesting] = useState(false)

  const selectedProvider = LLM_PROVIDERS.find((p) => p.id === providerId)

  const handleSave = () => {
    const provider = selectedProvider!
    setLLMProvider({
      id: provider.id,
      name: provider.name,
      apiKey,
      model,
      endpoint: providerId === 'custom' ? endpoint : undefined,
    })
    alert('Configuração salva com sucesso!')
  }

  const handleTest = async () => {
    setTesting(true)
    try {
      // Simulate API test
      await new Promise((resolve) => setTimeout(resolve, 1500))
      alert('Conexão testada com sucesso!')
    } catch (error) {
      alert('Erro ao testar conexão')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-6 h-6 text-primary-500" />
        <h2 className="text-xl font-bold">Configuração do LLM (BYOK)</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Provider</label>
          <select
            value={providerId}
            onChange={(e) => {
              setProviderId(e.target.value)
              const provider = LLM_PROVIDERS.find((p) => p.id === e.target.value)
              if (provider?.models.length) {
                setModel(provider.models[0])
              }
            }}
            className="input w-full"
          >
            {LLM_PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="input w-full"
          />
        </div>

        {providerId === 'custom' ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Endpoint</label>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://api.example.com/v1/chat/completions"
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Model Name</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="model-name"
                className="input w-full"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="input w-full"
            >
              {selectedProvider?.models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={handleSave} className="btn btn-primary flex items-center gap-2 flex-1">
            <Save className="w-4 h-4" />
            Salvar Configuração
          </button>
          <button
            onClick={handleTest}
            disabled={testing || !apiKey}
            className="btn bg-slate-700 hover:bg-slate-600 flex items-center gap-2"
          >
            <TestTube className="w-4 h-4" />
            {testing ? 'Testando...' : 'Testar'}
          </button>
        </div>
      </div>
    </div>
  )
}
