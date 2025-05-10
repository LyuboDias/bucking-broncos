"use server"

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
    return { success: true, data: await createRace(name) }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function addPlayerAction(raceId: string, name: string, odds: number) {
  try {
    return { success: true, data: await addPlayerToRace(raceId, name, odds) }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateRaceStatusAction(raceId: string, status: "upcoming" | "open" | "settled") {
  try {
    return { success: true, data: await updateRaceStatus(raceId, status) }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function setRaceWinnerAction(raceId: string, playerId: string) {
  try {
    return { success: true, data: await setRaceWinner(raceId, playerId) }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function setRaceSecondPlaceAction(raceId: string, playerId: string) {
  try {
    return { success: true, data: await setRaceSecondPlace(raceId, playerId) }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function setRaceThirdPlaceAction(raceId: string, playerId: string) {
  try {
    return { success: true, data: await setRaceThirdPlace(raceId, playerId) }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function placeBetAction(userId: string, raceId: string, playerId: string, amount: number) {
  try {
    return { success: true, data: await placeBet(userId, raceId, playerId, amount) }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function settleRaceAction(raceId: string) {
  try {
    return { success: true, data: await settleRace(raceId) }
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
    return { success: true, data: await deleteRace(raceId) }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
