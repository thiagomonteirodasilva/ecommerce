import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home"
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import Images from "./pages/Images";

const Layout = () => {
  return (
    <>
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/create',
    element: <Create />
  },
  {
    path: '/edit/:id',
    element: <Edit />
  },
  {
    path: '/images/:id',
    element: <Images />
  }
])

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router}/>
      </div>
    </div>
  );
}

export default App;
