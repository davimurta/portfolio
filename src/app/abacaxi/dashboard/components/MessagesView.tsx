'use client'

import { useState, useEffect } from 'react'
import { Text } from '@/components'
import { Mail, MailOpen, Trash2, Clock, User, Briefcase, RefreshCw } from 'lucide-react'

interface Message {
  id: string
  name: string
  email: string
  projectType: string | null
  message: string
  createdAt: string
  read: boolean
}

export function MessagesView() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/messages')
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao carregar mensagens')
        return
      }

      setMessages(data)
    } catch {
      setError('Erro ao carregar mensagens')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message)

    if (!message.read) {
      try {
        await fetch(`/api/admin/messages/${message.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: true }),
        })

        setMessages(prev =>
          prev.map(m => m.id === message.id ? { ...m, read: true } : m)
        )
      } catch {
        console.error('Failed to mark message as read')
      }
    }
  }

  const handleDeleteMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessages(prev => prev.filter(m => m.id !== id))
        if (selectedMessage?.id === id) {
          setSelectedMessage(null)
        }
      }
    } catch {
      console.error('Failed to delete message')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const unreadCount = messages.filter(m => !m.read).length

  if (isLoading) {
    return (
      <div className="messages-container">
        <div className="messages-loading">
          <RefreshCw size={32} className="spin" />
          <Text as="p" variant="secondary">Carregando mensagens...</Text>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="messages-container">
        <div className="messages-error">
          <Text as="p" variant="secondary">{error}</Text>
          <button onClick={fetchMessages} className="retry-btn">
            <RefreshCw size={18} />
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="messages-container">
      <div className="messages-list">
        <div className="messages-list-header">
          <Text as="span" size="sm" variant="secondary">
            {messages.length} mensagens {unreadCount > 0 && `(${unreadCount} não lidas)`}
          </Text>
          <button onClick={fetchMessages} className="refresh-btn" title="Atualizar">
            <RefreshCw size={16} />
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="messages-empty">
            <Mail size={48} />
            <Text as="p" variant="secondary">Nenhuma mensagem</Text>
          </div>
        ) : (
          <div className="messages-items">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-item ${!message.read ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'active' : ''}`}
                onClick={() => handleSelectMessage(message)}
              >
                <div className="message-item-icon">
                  {message.read ? <MailOpen size={20} /> : <Mail size={20} />}
                </div>
                <div className="message-item-content">
                  <div className="message-item-header">
                    <Text as="span" size="sm" weight={message.read ? 'normal' : 'semibold'}>
                      {message.name}
                    </Text>
                    <Text as="span" size="sm" variant="tertiary">
                      {formatDate(message.createdAt).split(' ')[0]}
                    </Text>
                  </div>
                  <Text as="p" size="sm" variant="secondary" className="message-preview">
                    {message.message.substring(0, 60)}...
                  </Text>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="message-detail">
        {selectedMessage ? (
          <>
            <div className="message-detail-header">
              <div className="message-detail-info">
                <Text as="h2" size="lg" weight="semibold">
                  {selectedMessage.name}
                </Text>
                <Text as="p" size="sm" variant="secondary">
                  {selectedMessage.email}
                </Text>
              </div>
              <button
                className="message-delete-btn"
                onClick={() => handleDeleteMessage(selectedMessage.id)}
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="message-detail-meta">
              {selectedMessage.projectType && (
                <div className="meta-item">
                  <Briefcase size={16} />
                  <Text as="span" size="sm">{selectedMessage.projectType}</Text>
                </div>
              )}
              <div className="meta-item">
                <Clock size={16} />
                <Text as="span" size="sm">{formatDate(selectedMessage.createdAt)}</Text>
              </div>
            </div>

            <div className="message-detail-body">
              <Text as="p" size="md">
                {selectedMessage.message}
              </Text>
            </div>

            <div className="message-detail-actions">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: Contato via Portfolio`}
                className="reply-btn"
              >
                <Mail size={18} />
                Responder por Email
              </a>
            </div>
          </>
        ) : (
          <div className="message-detail-empty">
            <User size={48} />
            <Text as="p" variant="secondary">
              Selecione uma mensagem para visualizar
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}
