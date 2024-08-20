// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import emailReducer from '@/redux-store/slices/email'

export const store = configureStore({
  reducer: {
    emailReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
