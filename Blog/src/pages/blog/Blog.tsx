import React from 'react'
import CreatePost from './components/CreatePost'
import PostList from './components/PostList'

export default function Blog() {
  return (
    <div className='p-5 mx-auto max-w-screen-xl px-4 md:px-8'>
      <CreatePost />
      <PostList />
    </div>
  )
}
