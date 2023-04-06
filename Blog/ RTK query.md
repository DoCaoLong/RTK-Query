# RTK query

## RTK query là gì?

RTK query là thư viện thuộc hệ sinh thái Redux giúp chúng ta quản lý việc gọi API và caching dễ dàng.

### Lý do RTK query xuất hiện

Giúp chúng ta hạn chế những việc lặp đi lặp lại trong quá trình fetch data.

Để fetch data trong React

- Khai báo useEffect và gọi API trong đó
- Xử lý cleanup function để tránh việc gọi duplicate data
- Tracking trạng thái loading để hiển thị skeleton
- Quản lý thời gian cache khi user tương tác với UI

Những việc này không khó, nhưng nó nhiều, nếu nhiều component cần implement cái này thì khá mệt. Nếu dùng với Redux thì mệt hơn nữa khi mỗi lần gọi API phải khai báo action, thunk các kiểu. Ngay cả khi khi chúng ta sử dụng `createAsyncThunk` cùng với `createSlice` thì vẫn còn những hạn chế khi chúng ta phải tự quản lý state loading hay tránh gọi duplicate request.

Những năm gần đây, cộng đồng React nhận ra rằng **fetch data và caching cũng là một nỗi lo khác cùng với việc quản lý state**.

RTK Query lấy cảm hứng từ những thư viện như Apollo Client, React Query, Urql và SWR nhưng được build trên Redux Toolkit

### 1.Create an API Slice
```js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IPost } from 'types/blog.type'

// Define a service using a base URL and expected endpoints
export const blogApi = createApi({
  reducerPath: 'Posts',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/posts' }),
  endpoints: (builder) => ({
    getPosts: builder.query<IPost, string>({
      query: () => `posts`
    })
  })
})

export const { useGetPostsQuery } = blogApi
```

### 2.Configure the Store
```js
import { configureStore } from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query'
import { blogApi } from 'pages/blogs/blog.service'

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [blogApi.reducerPath]: blogApi.reducer
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(blogApi.middleware)
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
```

### 3.Use Hooks in Components
```js
import * as React from 'react'
import { useGetPokemonByNameQuery } from './services/pokemon'

export default function App() {
  // Using a query hook automatically fetches data and returns query values
  const { data, error, isLoading } = useGetPokemonByNameQuery('bulbasaur')
  // Individual hooks are also accessible under the generated endpoints:
  // const { data, error, isLoading } = pokemonApi.endpoints.getPokemonByName.useQuery('bulbasaur')
  
  // render UI based on data and loading state
}
```