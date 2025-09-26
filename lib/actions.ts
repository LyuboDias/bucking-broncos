"use server"

import { revalidatePath } from "next/cache"
import {
  createRace,
  addPlayerToRace,
  updateRaceStatus,
  setRaceWinner,
  placeBet,
  settleRace,
  createUser,
  updateUserBalance,
  deleteRace,
  setRaceSecondPlace,
  setRaceThirdPlace,
} from "./data"

export async function createRaceAction(name: string) {
  try {
    const result = await createRace(name)
    if (result) {
      revalidatePath("/")
      revalidatePath("/races")
      revalidatePath("/admin")
      revalidatePath("/admin/races")
    }
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function addPlayerAction(raceId: string, name: string, odds: number) {
  try {
    const result = await addPlayerToRace(raceId, name, odds)
    if (result) {
      revalidatePath("/")
      revalidatePath("/races")
      revalidatePath(`/races/${raceId}`)
      revalidatePath("/admin")
      revalidatePath("/admin/races")
      revalidatePath(`/admin/races/${raceId}`)
    }
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateRaceStatusAction(raceId: string, status: "upcoming" | "open" | "closed" | "settled") {
  try {
    const result = await updateRaceStatus(raceId, status)
    if (result) {
      revalidatePath("/")
      revalidatePath("/races")
      revalidatePath(`/races/${raceId}`)
      revalidatePath("/admin")
      revalidatePath("/admin/races")
      revalidatePath(`/admin/races/${raceId}`)
    }
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function setRaceWinnerAction(raceId: string, playerId: string) {
  try {
    const result = await setRaceWinner(raceId, playerId)
    if (result) {
      revalidatePath("/")
      revalidatePath("/races")
      revalidatePath(`/races/${raceId}`)
      revalidatePath("/admin")
      revalidatePath("/admin/races")
      revalidatePath(`/admin/races/${raceId}`)
    }
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function setRaceSecondPlaceAction(raceId: string, playerId: string) {
  try {
    const result = await setRaceSecondPlace(raceId, playerId)
    if (result) {
      revalidatePath("/")
      revalidatePath("/races")
      revalidatePath(`/races/${raceId}`)
      revalidatePath("/admin")
      revalidatePath("/admin/races")
      revalidatePath(`/admin/races/${raceId}`)
    }
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function setRaceThirdPlaceAction(raceId: string, playerId: string) {
  try {
    const result = await setRaceThirdPlace(raceId, playerId)
    if (result) {
      revalidatePath("/")
      revalidatePath("/races")
      revalidatePath(`/races/${raceId}`)
      revalidatePath("/admin")
      revalidatePath("/admin/races")
      revalidatePath(`/admin/races/${raceId}`)
    }
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function placeBetAction(userId: string, raceId: string, playerId: string, amount: number) {
  try {
    const result = await placeBet(userId, raceId, playerId, amount)
    if (result) {
      revalidatePath("/")
      revalidatePath("/races")
      revalidatePath(`/races/${raceId}`)
      revalidatePath("/leaderboard")
      revalidatePath(`/admin/races/${raceId}`)
    }
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function settleRaceAction(raceId: string) {
  try {
    const result = await settleRace(raceId)
    if (result) {
      revalidatePath("/")
      revalidatePath("/races")
      revalidatePath(`/races/${raceId}`)
      revalidatePath("/leaderboard")
      revalidatePath("/admin")
      revalidatePath("/admin/races")
      revalidatePath(`/admin/races/${raceId}`)
    }
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function createUserAction(name: string, email: string, isAdmin = false) {
  try {
    return { success: true, data: await createUser(name, email, isAdmin) }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateUserBalanceAction(userId: string, newBalance: number) {
  try {
    return { success: true, data: await updateUserBalance(userId, newBalance) }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteRaceAction(raceId: string) {
  try {
    const result = await deleteRace(raceId)
    if (result) {
      revalidatePath("/")
      revalidatePath("/races")
      revalidatePath("/admin")
      revalidatePath("/admin/races")
    }
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
