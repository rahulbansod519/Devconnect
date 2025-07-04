import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import HomePage from './components/HomePage'
import Layout from "./Layout";
import {
  PostsBannerList,
  fetchAllPost as allPost,
} from "./components/PostsBannerList";
import { PostView, fetchPostbyId } from "./components/PostView";
import PostForm from "./components/PostForm";
import { AuthorPost } from "./components/authorPost";
// import  SignInPage  from "./components/Login";

const routes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <h1>Page Not Found</h1>,

    children: [
      {
        path: "/",
        element: <PostsBannerList />,
        loader: allPost,
      },
      {
        path: "/posts/:id",
        element: <PostView />,
        loader: fetchPostbyId, // Fetch post by ID
      },
      {
        path: "post/submit",
        element: <PostForm />,
      },
      {
        path: "posts/author",
        element: <AuthorPost />,
   
      }

    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
