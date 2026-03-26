import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Videos from "./pages/Videos";
import ProtectedRoute from "./components/ProtectedRoute";
import Analytics from "./pages/Analytics";
import Thumbnail from "./pages/Thumbnail";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public */}

        <Route path="/" element={<Landing />} />

        {/* Protected */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/analytics/:id"
  element={
    <ProtectedRoute>
      <Analytics />
    </ProtectedRoute>
  }
/>

        <Route
  path="/videos"
  element={
    <ProtectedRoute>
      <Videos />
    </ProtectedRoute>
  }
/>

<Route
  path="/thumbnail"
  element={
    <ProtectedRoute>
      <Thumbnail />
    </ProtectedRoute>
  }
/>

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;