import { supabase } from '@/supabaseClient'
import { Handler } from '@netlify/functions'

export const handler: Handler = async () => {
    const { error } = await supabase.from('my_list').select('id').limit(1)

    if (error) {
        console.error(error)
        return { statusCode: 500, body: 'fail' }
    }

    return { statusCode: 200, body: 'ok' }
}
