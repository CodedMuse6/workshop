import {RouterProvider } from 'react-router-dom'
import AuthContextProvider from "./Context/AuthContextProvider.tsx";
import './App.css'
import { router } from './router.tsx';
import FormContextProvider from './Context/FormContextProvider.tsx';

function App() {
return (
    <AuthContextProvider>
      <FormContextProvider>
      <RouterProvider router = {router} />
      </FormContextProvider>
    </AuthContextProvider>
  );
}

export default App
