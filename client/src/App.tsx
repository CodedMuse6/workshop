import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Login from "./routes/Login.tsx";
import {AdminDashboard} from "./routes/AdminDashboard.tsx";
import {CreateForm} from "./routes/CreateForm.tsx";
import {StudentForm} from "./routes/StudentForm.tsx";
import AuthContextProvider from "./Context/AuthContextProvider.tsx";
import {ProtectedRoute} from "./modules/components/ProtectedRoute.tsx";
import './App.css'

function App() {
return (
    <AuthContextProvider>
      <BrowserRouter>
      <Routes>
        {/* <Route path = "/login" element = {<Login/>} /> */}
        <Route
        path = "/admin"
        element = {
          <ProtectedRoute>
            <AdminDashboard/>
          </ProtectedRoute>
        }
        />
        <Route 
        path = "/admin/create"
        element = {
          <ProtectedRoute>
            <CreateForm />
          </ProtectedRoute>
        }
        />
        <Route path = "/form/:formId" element = {<StudentForm />} />
      </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App
