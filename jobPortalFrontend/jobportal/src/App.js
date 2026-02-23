import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminJobs from "./pages/AdminJobs";
import MyApplications from "./pages/MyApplications";
import RequireAuth from "./auth/RequireAuth";
import ManagerApplications from "./pages/ManagerApplications";

export default function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Jobs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/jobs" element={<AdminJobs />} />
        </Route>
        
                <Route element={<RequireAuth allowedRoles={["MANAGER"]} />}>
                  <Route path="/manager/applications" element={<ManagerApplications />} />
                </Route>

        <Route element={<RequireAuth allowedRoles={["EMPLOYEE"]} />}>
          <Route path="/my-applications" element={<MyApplications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}