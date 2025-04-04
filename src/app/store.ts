import { configureStore } from '@reduxjs/toolkit'
import  counterReducer from './reducers/counterSlice'
import authReducer from './reducers/authSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch