import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://cqrnlcrpnyyhxghqwpnm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxcm5sY3Jwbnl5aHhnaHF3cG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzOTc2OTgsImV4cCI6MjA1NTk3MzY5OH0.ZWYjte3-RHGV3Td7z3cdS3M6toHaMFqJSPJ0iFVd2X4'
)

export default supabase
