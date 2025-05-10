import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://elfvxyrlaslnfyfxaxoi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZnZ4eXJsYXNsbmZ5ZnhheG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MzQ2MDUsImV4cCI6MjA2MjQxMDYwNX0.aPgi4Q69t4lOYKvfWY_u5pzcgfrWjPPxbyaUVyWzmcA'

export const supabase = createClient(supabaseUrl, supabaseKey)
