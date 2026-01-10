#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read credentials from .env
const envContent = readFileSync(join(__dirname, '.env'), 'utf8')
const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.*)/)[1].trim()
const SUPABASE_KEY = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim()

console.log('🔌 Connecting to Supabase...')
console.log('📍 URL:', SUPABASE_URL)

// Note: For executing DDL statements, we need the service_role key, not anon key
// The anon key has limited permissions
console.log('\n⚠️  IMPORTANT:')
console.log('To run database migrations, you need the SERVICE_ROLE key.')
console.log('The anon key in .env has limited permissions.\n')

console.log('📋 Next steps:')
console.log('1. Go to: https://supabase.com/dashboard/project/fjdkdoantfcwbnsqghlj/settings/api')
console.log('2. Copy the "service_role" key (secret)')
console.log('3. Or simply paste the SQL manually in the Supabase SQL Editor\n')

console.log('🌐 Quick link to SQL Editor:')
console.log('   https://supabase.com/dashboard/project/fjdkdoantfcwbnsqghlj/editor/sql\n')

console.log('📄 SQL file to copy: supabase-schema.sql')
