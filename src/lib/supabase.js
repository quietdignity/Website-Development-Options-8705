import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://sdfnpskccbvilzpcpzzo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkZm5wc2tjY2J2aWx6cGNwenpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNzUyNjEsImV4cCI6MjA2Njc1MTI2MX0.dkIxMqlYhxNNWbYhiDjelZnLzpdl0OIU84T51hHCXis'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables')
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})