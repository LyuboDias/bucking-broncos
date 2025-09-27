import { NextRequest, NextResponse } from 'next/server'
import { getRace, getPlayersForRace, getBetsForRace } from '@/lib/data'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const race = await getRace(params.id)
    
    if (!race) {
      return NextResponse.json(
        { error: 'Race not found' },
        { status: 404 }
      )
    }

    const players = await getPlayersForRace(race.id)
    const bets = await getBetsForRace(race.id)

    return NextResponse.json(
      { race, players, bets },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    )
  } catch (error) {
    console.error('Error fetching race stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
