// Centralized admin configuration
export const ADMIN_EMAILS = [
  'admin@example.com',
  'your-actual-email@gmail.com', // ⚠️ REPLACE THIS with your actual email address
  'admin@papertrade-india.com',
  'oshoaeeb@gmail.com'
]

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email)
}