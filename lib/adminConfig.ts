// Centralized admin configuration
export const ADMIN_EMAILS = [
  'oshoaeeb@gmail.com'
]

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email)
}