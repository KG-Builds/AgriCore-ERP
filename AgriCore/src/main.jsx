import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {createBrowserRouter,RouterProvider} from 'react-router';
import Layout from "./Layout.jsx";
import Login2 from "./components/Login2.jsx"
// import CrudDashboard
//     from "./components/mui material-ui v7.3.4 docs-data_material_getting-started_templates_crud-dashboard/CrudDashboard.js";
const router=createBrowserRouter([
    {path:'/',
    element:<Layout/>,
    children:[
        {path:'',
        element:<Login2/>},
        {path:"dashboard",
        element:<Login2/>}]}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
