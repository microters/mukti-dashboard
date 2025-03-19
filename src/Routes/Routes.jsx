import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Layout/Dashboard";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import AllDoctors from "../components/ManageDoctors/AllDoctors/AllDoctors";
import AddDoctor from "../components/ManageDoctors/AddDoctor/AddDoctor";
import AddPatient from "../components/ManagePatients/AddPatient/AddPatient";
import AddBlog from "../components/Blogs/AddBlog/AddBlog";
import EditDoctor from "../components/ManageDoctors/EditDoctor/EditDoctor";
import AddDepartment from "../components/ManageDoctors/AddDepartment/AddDepartment";
import DepartmentList from "../components/ManageDoctors/All Department/All Department";
import EditDepartment from "../components/ManageDoctors/EditDepartment/EditDepartment";
import AddReviews from "../components/Reviews/AddReviews";
import AllPatient from "../components/ManagePatients/AllPatient/AllPatient";
import EditPatient from "../components/ManagePatients/EditDepartment/EditPatient";
import AddAppointment from "../components/Appointment/AddAppointment/AddAppointment";
import BlogList from "../components/Blogs/AllBlog/AllBlog";
import AddCategory from "../components/Blogs/Category/AddCategory";
import CategoryList from "../components/Blogs/Category/AllCategory";
import EditCategory from "../components/Blogs/Category/EditCategory";
import EditBlog from "../components/Blogs/EditBlog/EditBlog";
import HomepageForm from "../components/Manage Section/HomePage";
import AddPage from "../components/Manage Page/Add Page/AddPage";
import AllPages from "../components/Manage Page/AllPages/AllPages";
import EditPage from "../components/Manage Page/EditPage/EditPage";
import ProfilePage from "../components/ProfilePage";
import AboutPage from "../components/Manage Section/AboutPage";
import AppointmentList from "../components/Appointment/AppoinmentList/AllAppoinment";
import TodayAppointments from "../components/Appointment/AppoinmentList/TodayAppointments";



// Importing necessary pages

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
   
 <Dashboard />
    ),
    errorElement: <ErrorPage />,
    children: [
      /** Manage Doctors **/
      {
        path: "all-doctors",
        element: (
        //   <AdminRoute>
        // <h1>Add doctor</h1>
            <AllDoctors/>
        //   </AdminRoute>
        ),
      },
      {
        path: "add-doctor",
        element: (
        //   <AdminRoute>
            <AddDoctor/>
        //   </AdminRoute>
        ),
      },
      {
        path: "/edit-doctor/:id",
        element: (
          // <AdminRoute>
            <EditDoctor />
          // </AdminRoute>
        ),
      },
      
      {
        path: "add-department",
        element: (
        //   <AdminRoute>
            <AddDepartment/>
        //   </AdminRoute>
        ),
      },
      {
        path: "all-department",
        element: (
        //   <AdminRoute>
            <DepartmentList/>
        //   </AdminRoute>
        ),
      },
      {
        path: "/edit-department/:id",
        element: (
        //   <AdminRoute>
            <EditDepartment/>
        //   </AdminRoute>
        ),
      },

      /** Manage Patients **/
   
      {
        path: "add-patient",
        element: (
        //   <AdminRoute>
            <AddPatient />
        //   </AdminRoute>
        ),
      },
      {
        path: "all-patients",
        element: (
        //   <AdminRoute>
            <AllPatient />
        //   </AdminRoute>
        ),
      },
      {
        path: "/edit-patient/:id",
        element: (
          // <AdminRoute>
            <EditPatient />
          // </AdminRoute>
        ),
      },
      {
        path: "add-reviews",
        element: (
        //   <AdminRoute>
            <AddReviews />
        //   </AdminRoute>
        ),
      },

      /** Manage Appointments **/
      
      {
        path: "upcoming-appointments",
        element: (
        //   <AdminRoute>
        <h1>Add doctor</h1>
            // <UpcomingAppointments />
        //   </AdminRoute>
        ),
      },
      
      {
        path: "add-appointment",
        element: (
        //   <AdminRoute>
            <AddAppointment />
        //   </AdminRoute>
        ),
      },
      {
        path: "all-appointments",
        element: (
        //   <AdminRoute>
            <AppointmentList />
        //   </AdminRoute>
        ),
      },
      {
        path: "todays-appointments",
        element: (
        //   <AdminRoute>
            <TodayAppointments />
        //   </AdminRoute>
        ),
      },

      /** CMS & Blogs **/
      {
        path: "all-blog",
        element: (
        //   <AdminRoute>
            <BlogList />
        //   </AdminRoute>
        ),
      },
      {
        path: "add-blog",
        element: (
        //   <AdminRoute>
            <AddBlog />
        //   </AdminRoute>
        ),
      },
      {
        path: "add-category",
        element: (
        //   <AdminRoute>
            <AddCategory />
        //   </AdminRoute>
        ),
      },
      {
        path: "all-category",
        element: (
        //   <AdminRoute>
            <CategoryList />
        //   </AdminRoute>
        ),
      },
      {
        path: "/edit-category/:id",
        element: (
          // <AdminRoute>
            <EditCategory />
          // </AdminRoute>
        ),
      },
     
      {
        path: "/edit-blog/:id",
        element: (
          // <AdminRoute>
            <EditBlog />
          // </AdminRoute>
        ),
      },
     

      /** Website Setup **/
      {
        path: "cookie-consent",
        element: (
        //   <AdminRoute>
        <h1>Add doctor</h1>
            // <CookieConsent />
        //   </AdminRoute>
        ),
      },
      {
        path: "error-page",
        element: (
        //   <AdminRoute>
        <h1>Add doctor</h1>
            // <ErrorPageMessage />
        //   </AdminRoute>
        ),
      },

      /** Settings & Configuration **/
      {
        path: "settings",
        element: (
        //   <AdminRoute>
        <h1>Add doctor</h1>
            // <GeneralSettings />
        //   </AdminRoute>
        ),
      },
      {
        path: "email-config",
        element: (
        //   <AdminRoute>
        <h1>Add doctor</h1>
            // <EmailConfig />
        //   </AdminRoute>
        ),
      },
      {
        path: "email-template",
        element: (
        //   <AdminRoute>
        <h1>Add doctor</h1>
            // <EmailTemplate />
        //   </AdminRoute>
        ),
      },
       /** Manage Page **/
       {
        path: "home-page",
        element: (
        //   <AdminRoute>
            <HomepageForm/>
        //   </AdminRoute>
        ),
      },
       {
        path: "about-page",
        element: (
        //   <AdminRoute>
            <AboutPage/>
        //   </AdminRoute>
        ),
      },
       {
        path: "header",
        element: (
        //   <AdminRoute>
            <Header/>
        //   </AdminRoute>
        ),
      },
       {
        path: "footer",
        element: (
        //   <AdminRoute>
            <Footer/>
        //   </AdminRoute>
        ),
      },
       
       {
        path: "add-page",
        element: (
        //   <AdminRoute>
            <AddPage/>
        //   </AdminRoute>
        ),
      },
       {
        path: "all-page",
        element: (
        //   <AdminRoute>
            <AllPages/>
        //   </AdminRoute>
        ),
      },
      {
        path: "/edit-page/:id",
        element: (
          // <AdminRoute>
            <EditPage />
          // </AdminRoute>
        ),
      },
      /** Others **/
      {
        path: "cache-clear",
        element: (
        //   <AdminRoute>
        <h1>Add doctor</h1>
            // <CacheClear />
        //   </AdminRoute>
        ),
      },
      {
        path: "profile",
        element: (
        //   <AdminRoute>
       <ProfilePage/>
            // <CacheClear />
        //   </AdminRoute>
        ),
      },
    ],
  },
]);

