export interface FaqReply {
  answer: string
  suggestions: string[]
}

const defaultSuggestions = ['Bali stay', 'Phuket stay', 'How to book', 'Office address', 'Contact']

const replies: Array<{ keywords: string[]; answer: string; suggestions?: string[] }> = [
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    answer:
      'Hello, this is CV Customer Service. I can help with Bali, Phuket, booking, office hours, and contact details. What would you like to know?',
  },
  {
    keywords: ['bali', 'nusa dua', 'dpsmv', 'gardens'],
    answer:
      'We promote Marriott’s Bali Nusa Dua Gardens in Nusa Dua. It offers apartment-style stays, pools, dining, activities, and easy access to the beach. You can browse photos in Resort Gallery, then tap Plan a trip if you want us to book it.',
    suggestions: ['Phuket stay', 'How to book', 'Visa'],
  },
  {
    keywords: ['phuket', 'mai khao', 'hktpa'],
    answer:
      'We also offer Marriott’s Mai Khao Resort – Phuket. It has spacious apartments, private plunge-pool options, family activities, dining, and a quieter setting near Mai Khao Beach. Open Resort Gallery and switch to the Phuket tab to see the rooms and grounds.',
    suggestions: ['Bali stay', 'How to book', 'Contact'],
  },
  {
    keywords: ['book', 'booking', 'reserve', 'inquiry', 'enquire', 'inquire', 'plan', 'trip', 'package'],
    answer:
      'To book, tap Plan a trip and send the inquiry form with your name, dates, destination, and who is traveling. Our team replies with options. You may also call 0966 988 7477 or message us on WhatsApp.',
    suggestions: ['Office hours', 'Contact', 'Bali stay'],
  },
  {
    keywords: ['price', 'rate', 'cost', 'how much', 'quote'],
    answer:
      'Rates depend on dates, room type, and how many guests are traveling. Send an inquiry with your travel dates and we will prepare a quote. There is no public walk-in price list because Marriott availability changes.',
    suggestions: ['How to book', 'Bali stay', 'Phuket stay'],
  },
  {
    keywords: ['visa'],
    answer:
      'We can guide you on common leisure visa requirements and timing. Share the destination and travel dates in Plan a trip, and we will tell you what documents are usually needed.',
    suggestions: ['How to book', 'Contact'],
  },
  {
    keywords: ['address', 'office', 'location', 'where', 'studio', 'quezon', 'map'],
    answer:
      'Our office is at Studio 3, Le Grand 3, Bagumbayan, Quezon City, Philippines. You can also find the map in the Contact section.',
    suggestions: ['Office hours', 'Contact', 'How to book'],
  },
  {
    keywords: ['hour', 'open', 'time', 'when'],
    answer:
      'The team is usually reachable during Philippine business hours. For after-hours questions, leave an inquiry or message WhatsApp at 0966 988 7477 and we will reply as soon as we can.',
    suggestions: ['Contact', 'How to book'],
  },
  {
    keywords: ['phone', 'number', 'call', 'whatsapp', 'contact', 'email', 'instagram'],
    answer:
      'You can reach CV Travel & Tours at 0966 988 7477. Instagram is @cvtravelandtours. The fastest way to start a booking is Plan a trip on this website.',
    suggestions: ['How to book', 'Office address'],
  },
  {
    keywords: ['service', 'offer', 'what do you', 'package', 'flight', 'transfer', 'tour'],
    answer:
      'We arrange resort and hotel stays, international tour packages, custom itineraries, flights and transfers, group or family travel, and visa guidance. Our featured properties right now are Marriott’s Bali Nusa Dua Gardens and Marriott’s Mai Khao Resort in Phuket.',
    suggestions: ['Bali stay', 'Phuket stay', 'How to book'],
  },
]

export function answerFaq(question: string): FaqReply {
  const text = question.toLowerCase().trim()
  if (!text) {
    return {
      answer: 'Please type a question, or tap one of the topics below.',
      suggestions: defaultSuggestions,
    }
  }

  const match = replies.find((item) => item.keywords.some((keyword) => text.includes(keyword)))
  if (!match) {
    return {
      answer:
        'I am CV Customer Service, a basic FAQ assistant. I can answer questions about Bali, Phuket, booking, prices, visas, office address, and contact details. Try one of the topics below, or tap Plan a trip to speak with our team.',
      suggestions: defaultSuggestions,
    }
  }

  return {
    answer: match.answer,
    suggestions: match.suggestions ?? defaultSuggestions,
  }
}

export const greetingReply: FaqReply = {
  answer:
    'Hello, I am CV Customer Service. Ask about Bali, Phuket, booking, prices, visas, or our Quezon City office. I answer from a short FAQ — our team handles the actual booking.',
  suggestions: defaultSuggestions,
}
