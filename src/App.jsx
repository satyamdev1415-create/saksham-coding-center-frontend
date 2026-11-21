import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseDetails from "./pages/CourseDetails";
import ApplicationForm from "./pages/ApplicationForm";
import Faculty from "./pages/Faculty";
import MainLayout from "./layouts/MainLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminFaculty from "./pages/admin/AdminFaculty";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminStudents from "./pages/admin/AdminStudents";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ContactMessages from "./pages/admin/ContactMessages";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Website Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetails />} />
          <Route path="/apply/:slug" element={<ApplicationForm />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/about" element={<About/>}/>
          <Route path="/contact"  element={<Contact/>}/>
        </Route>
        

        <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard/>}/>
            <Route path="/admin/courses" element={<AdminCourses/>}/>
            <Route path="/admin/faculty" element={<AdminFaculty/>}/>
            <Route path="/admin/applications" element={<AdminApplications/>}/>
            <Route path="//admin/contact-messages" element={<ContactMessages/>}/>

            <Route path="/admin/students" element={<AdminStudents/>}/>
        </Route>


        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;