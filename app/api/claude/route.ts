import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const apiKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Claude API key is not configured' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', // Claude 4 Sonnet
        max_tokens: body.max_tokens || 2000,
        temperature: body.temperature || 0.7,
        system: body.system,
        messages: body.messages
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Claude API Error:', errorData)
      return NextResponse.json(
        { error: errorData.error?.message || 'API request failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Server error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}