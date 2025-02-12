import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Layout/Dashboard";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import AllDoctors from "../components/ManageDoctors/AllDoctors/AllDoctors";
import AddDoctor from "../components/ManageDoctors/AddDoctor/AddDoctor";
import AddPatient from "../components/ManagePatients/AddPatient/AddPatient";
import AddBlog from "../components/Blogs/AddBlog/AddBlog";

// Importing necessary pages

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
    //   <PrivateRoute>
        <Dashboard />
    //   </PrivateRoute>
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

      /** Manage Patients **/
      {
        path: "all-patients",
        element: (
        //   <AdminRoute>
        <h1>Add doctor</h1>
            // <AllPatients />
        //   </AdminRoute>
        ),
      },
      {
        path: "add-patient",
        element: (
        //   <AdminRoute>
            <AddPatient />
        //   </AdminRoute>
        ),
      },

      /** Manage Appointments **/
      {
        path: "all-appointments",
        element: (
        //   <AdminRoute>
        <h1>Add doctor</h1>
            // <AllAppointments />
        //   </AdminRoute>
        ),
      },
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
        path: "todays-appointments",
        element: (
        //   <AdminRoute>
        <h1>Add doctor</h1>
            // <TodaysAppointments />
        //   </AdminRoute>
        ),
      },
      {
        path: "add-appointment",
        element: (
        //   <AdminRoute>
        <h1>Add doctor</h1>
            // <AddAppointment />
        //   </AdminRoute>
        ),
      },

      /** CMS & Blogs **/
      {
        path: "all-blogs",
        element: (
        //   <AdminRoute>
        <h1>Add doctor</h1>
            // <AllBlogs />
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
        path: "category-list",
        element: (
        //   <AdminRoute>
        <h1>Add doctor</h1>
            // <CategoryList />
        //   </AdminRoute>
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
    ],
  },
]);

