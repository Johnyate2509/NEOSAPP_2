import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://yldsbetsmxnjbvlpbvbc.supabase.co"
const supabaseKey = "sb_publishable_ZGRS7LGODQnydu7pqN2ysQ_xTBHsQEc"

export const supabase = createClient(supabaseUrl, supabaseKey)