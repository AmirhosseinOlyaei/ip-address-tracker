import {
  clearHistory,
  loadHistory,
  removeHistoryEntry,
  saveHistoryEntry,
} from "@/services/historyService"
import { buildAppError, getOwnIp, lookupIp } from "@/services/ipService"
import {
  HistoryEntry,
  IpGeoData,
  IpTrackerAction,
  IpTrackerState,
} from "@/types"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react"

interface IpTrackerContextValue extends IpTrackerState {
  lookup: (query: string) => Promise<void>
  lookupSelf: () => Promise<void>
  removeEntry: (id: string) => Promise<void>
  clearSearchHistory: () => Promise<void>
}

const IpTrackerContext = createContext<IpTrackerContextValue | undefined>(
  undefined,
)

function reducer(
  state: IpTrackerState,
  action: IpTrackerAction,
): IpTrackerState {
  switch (action.type) {
    case "LOOKUP_START":
      return { ...state, status: "loading", error: null }
    case "LOOKUP_SUCCESS":
      return {
        ...state,
        status: "success",
        current: action.payload,
        error: null,
      }
    case "LOOKUP_ERROR":
      return { ...state, status: "error", error: action.payload }
    case "LOAD_HISTORY":
      return { ...state, history: action.payload }
    case "ADD_HISTORY":
      return {
        ...state,
        history: [
          action.payload,
          ...state.history.filter((h) => h.query !== action.payload.query),
        ],
      }
    case "CLEAR_HISTORY":
      return { ...state, history: [] }
    default:
      return state
  }
}

const initialState: IpTrackerState = {
  current: null,
  history: [],
  status: "idle",
  error: null,
}

export function IpTrackerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const stateRef = React.useRef(state)
  stateRef.current = state

  const performLookup = useCallback(
    async (data: IpGeoData, queryLabel: string) => {
      dispatch({ type: "LOOKUP_SUCCESS", payload: data })
      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        query: queryLabel,
        data,
        timestamp: Date.now(),
      }
      const updatedHistory = await saveHistoryEntry(
        stateRef.current.history,
        entry,
      )
      dispatch({ type: "LOAD_HISTORY", payload: updatedHistory })
    },
    [],
  )

  const lookup = useCallback(
    async (query: string) => {
      dispatch({ type: "LOOKUP_START" })
      try {
        const data = await lookupIp(query)
        await performLookup(data, query.trim())
      } catch (e) {
        dispatch({ type: "LOOKUP_ERROR", payload: buildAppError(e) })
      }
    },
    [performLookup],
  )

  const lookupSelf = useCallback(async () => {
    dispatch({ type: "LOOKUP_START" })
    try {
      const ip = await getOwnIp()
      const data = await lookupIp(ip)
      await performLookup(data, ip)
    } catch (e) {
      dispatch({ type: "LOOKUP_ERROR", payload: buildAppError(e) })
    }
  }, [performLookup])

  const removeEntry = useCallback(async (id: string) => {
    const updated = await removeHistoryEntry(stateRef.current.history, id)
    dispatch({ type: "LOAD_HISTORY", payload: updated })
  }, [])

  const clearSearchHistory = useCallback(async () => {
    await clearHistory()
    dispatch({ type: "CLEAR_HISTORY" })
  }, [])

  const lookupSelfRef = React.useRef(lookupSelf)
  lookupSelfRef.current = lookupSelf

  useEffect(() => {
    loadHistory().then((entries) =>
      dispatch({ type: "LOAD_HISTORY", payload: entries }),
    )
    lookupSelfRef.current()
  }, [])

  const value = useMemo<IpTrackerContextValue>(
    () => ({ ...state, lookup, lookupSelf, removeEntry, clearSearchHistory }),
    [state, lookup, lookupSelf, removeEntry, clearSearchHistory],
  )

  return (
    <IpTrackerContext.Provider value={value}>
      {children}
    </IpTrackerContext.Provider>
  )
}

export function useIpTracker(): IpTrackerContextValue {
  const ctx = useContext(IpTrackerContext)
  if (!ctx)
    throw new Error("useIpTracker must be used within IpTrackerProvider")
  return ctx
}
