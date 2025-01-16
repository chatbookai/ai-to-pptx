// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
