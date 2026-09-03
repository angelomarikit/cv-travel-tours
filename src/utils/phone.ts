export function digitsOnly(value: string | null | undefined): string {
  return (value ?? '').replace(/\D/g, '')
}

export function toWhatsAppLink(phone: string | null | undefined): string {
  const digits = digitsOnly(phone)
  if (!digits) return ''
  const international = digits.startsWith('0') ? `63${digits.slice(1)}` : digits
  return `https://wa.me/${international}`
}

export function formatPhoneDisplay(phone: string | null | undefined): string {
  const digits = digitsOnly(phone)
  if (digits.length === 11 && digits.startsWith('0')) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
  }
  return phone?.trim() || ''
}
