import { useEffect } from 'react'
import "./index.css"
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import  Homepage  from './Pages/Homepage.jsx'
import Interview  from './Pages/Interview.jsx'
import Dashboard from './Pages/Dashboard.jsx';
import MainPage from './Pages/Mainpage.jsx';
import Register from './Pages/Register.jsx';
import Login from './Pages/login.jsx';
import { useDispatch,useSelector } from 'react-redux';
import { setUser } from './Redux/Slice.js';
import Axios from 'axios';
function App() {
const dispatch = useDispatch();
  const { isAuthenticated, status } = useSelector(state => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await Axios.get(
          "http://localhost:3000/auth/me",
          { withCredentials: true }
        );

        if (res.data.user) {
          dispatch(setUser(res.data.user));
        } else {
          dispatch(clearUser());
        }
      } catch {
        dispatch(clearUser());
      }
    };

    checkAuth();
  }, [dispatch]);
  return (
   <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
   </div>
  )
}

export default App
