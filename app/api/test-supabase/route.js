import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test the connection with current credentials
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Simple test query
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: 'Database query failed - check RLS policies or table existence'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      keyValid: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      details: 'Connection failed - check your API credentials'
    }, { status: 500 })
  }
}