import { HistoryEntry } from "@/types"
import AsyncStorage from "@react-native-async-storage/async-storage"

const HISTORY_KEY = "@ip_tracker_history"
const MAX_HISTORY = 50

export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as HistoryEntry[]
  } catch {
    return []
  }
}

export async function saveHistoryEntry(
  entries: HistoryEntry[],
  newEntry: HistoryEntry,
): Promise<HistoryEntry[]> {
  const filtered = entries
    .filter((e) => e.query !== newEntry.query)
    .slice(0, MAX_HISTORY - 1)
  const updated = [newEntry, ...filtered]
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  return updated
}

export async function removeHistoryEntry(
  entries: HistoryEntry[],
  id: string,
): Promise<HistoryEntry[]> {
  const updated = entries.filter((e) => e.id !== id)
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  return updated
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY)
}
