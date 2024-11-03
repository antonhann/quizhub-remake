import { Route, Routes } from 'react-router'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { Home } from './components/Pages/Home'
import { Login, Register } from './components/Pages/Auth'
import { SessionProvider } from './SessionContext'
import { Create } from './components/Pages/Create'
import { Library } from './components/Pages/Library'
import { NotFound } from './components/Pages/NotFound'
import React from 'react'
import { AppContainer } from './components/reusables/AppContainer'
import ViewSet from './components/Pages/ViewSet'

interface RouteConfig{
  path: string,
  component: React.FC
}

const ROUTES: RouteConfig[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/create",
    component: Create,
  },
  {
    path: "/my-library",
    component: Library,
  },
  {
    path: "/view-set/:id",
    component: ViewSet,
  },
  {
    path: "*",
    component: NotFound,
  },
];

function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          {ROUTES.map((route, index) => (
            <Route key={index} path={route.path} element={
            <AppContainer>
              <route.component />
            </AppContainer>
          } />
          ))}
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  )
}

/*
TASKS:
-handle not found page
*/
//npm run dev to run app
export default App