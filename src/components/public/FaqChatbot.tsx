import { useEffect, useRef, useState, type FormEvent } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { answerFaq, greetingReply } from '@/data/faqBot'
import { useInquiry } from '@/contexts/InquiryContext'
import { cn } from '@/utils/cn'

interface ChatMessage {
  id: string
  from: 'bot' | 'guest'
  text: string
}

export function FaqChatbot() {
  const { openInquiry } = useInquiry()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState(greetingReply.suggestions)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', from: 'bot', text: greetingReply.answer },
  ])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  function addReply(question: string) {
    const reply = answerFaq(question)
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), from: 'guest', text: question },
      { id: crypto.randomUUID(), from: 'bot', text: reply.answer },
    ])
    setSuggestions(reply.suggestions)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const question = input.trim()
    if (!question) return
    setInput('')
    addReply(question)
  }

  return (
    <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
      {open ? (
        <div className="mb-3 flex h-[28rem] w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-[1.6rem] border border-line bg-white shadow-[0_24px_70px_-32px_rgba(0,21,51,0.55)]">
          <div className="flex items-center justify-between bg-royal px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">CV Customer Service</p>
              <p className="text-[11px] text-white/75">FAQ assistant · replies from keywords</p>
            </div>
            <button type="button" aria-label="Close chat" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f7f8fa] px-3 py-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn('max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed', message.from === 'bot' ? 'bg-white text-ink' : 'ml-auto bg-royal text-white')}
              >
                {message.text}
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-royal"
                  onClick={() => addReply(item)}
                >
                  {item}
                </button>
              ))}
              <button
                type="button"
                className="rounded-full bg-royal px-3 py-1 text-xs font-medium text-white"
                onClick={() => {
                  setOpen(false)
                  openInquiry()
                }}
              >
                Plan a trip
              </button>
            </div>
            <div ref={endRef} />
          </div>
          <form className="flex gap-2 border-t border-line p-3" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about Bali, Phuket, booking…"
              className="min-h-10 flex-1 rounded-full border border-line px-3 text-sm outline-none focus:border-royal"
            />
            <button type="submit" className="rounded-full bg-royal p-2.5 text-white" aria-label="Send">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : null}
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full bg-royal px-4 py-3 text-sm font-semibold text-white shadow-lg"
        onClick={() => setOpen((current) => !current)}
      >
        <MessageCircle className="h-4 w-4" />
        CV Customer Service
      </button>
    </div>
  )
}
