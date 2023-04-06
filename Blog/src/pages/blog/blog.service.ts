import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IPost } from '../../types/blog.type'

// Define a service using a base URL and expected endpoints
export const blogApi = createApi({
  reducerPath: 'blogApi', // Tên field trong Redux state
  tagTypes: ['Posts'], // Những kiểu tag cho phép dùng trong blogApi
  keepUnusedDataFor: 10, // Giữ data trong 10s sẽ xóa (mặc định 60s)
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000' }),
  endpoints: (builder) => ({
    getPosts: builder.query<IPost[], void>({
      query: () => `/posts`,
      /**
       * providesTags có thể là array hoặc callback return array
       * Nếu có bất kỳ một invalidatesTag nào match với providesTags này
       * thì sẽ làm cho getPosts method chạy lại
       * và cập nhật lại danh sách các bài post cũng như các tags phía dưới
       */
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Posts' as const, id })), { type: 'Posts', id: 'LIST' }]
          : [{ type: 'Posts', id: 'LIST' }]
    }),
    addPost: builder.mutation<IPost, Omit<IPost, 'id'>>({
      /**
       * invalidatesTags cung cấp các tag để báo hiệu cho những method nào có providesTags
       * match với nó sẽ bị gọi lại
       * Trong trường hợp này getPosts sẽ chạy lại
       */
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
      query: (body) => {
        return {
          url: '/posts',
          method: 'POST',
          body
        }
      }
    }),
    getPost: builder.query<IPost, string>({
      query: (id) => ({
        url: `/posts/${id}`
      }),
      providesTags: (result, error, id) => [{ type: 'Posts', id }]
    }),
    updatePost: builder.mutation<IPost, { id: string; body: IPost }>({
      query(data) {
        return {
          url: `/posts/${data.id}`,
          method: 'PUT',
          body: data.body
        }
      },
      invalidatesTags: (result, error, data) => [{ type: 'Posts', id: data.id }]
    }),
    deletePost: builder.mutation<{}, string>({
      query: (id) => {
        return {
          url: `/posts/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: (error, result, id) => [{ type: 'Posts', id }]
    })
  })
})

export const { useGetPostsQuery, useAddPostMutation, useGetPostQuery, useUpdatePostMutation, useDeletePostMutation } =
  blogApi
