import { PayloadAction, createSlice } from '@reduxjs/toolkit'
interface IIinitialState {
  postId: string
}
const initialState: IIinitialState = {
  postId: ''
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    startEditPost: (state, action: PayloadAction<string>) => {
      state.postId = action.payload
    },
    cancerEditPost: (state) => {
      state.postId = ''
    }
  }
})

const blogReducer = blogSlice.reducer
export const { startEditPost, cancerEditPost } = blogSlice.actions
export default blogReducer
