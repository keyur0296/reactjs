import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./component/Login";
import { Register } from "./component/Register";
import { Counter } from "./component/Counter";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./component/ProtectedRoute";
import QuizApp from "./component/QuizeApp";
import PersistQuizApp from "./component/PersistQuizApp";

function App() {
  return (
    <div className="wrapper">
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/quiz" element={<QuizApp />} />
          <Route path="/persist-quiz" element={<PersistQuizApp />} />

          {/* Protected Route for Authenticated Users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/counter" element={<Counter />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
