import { Route, Routes } from 'react-router-dom';
import './App.css';
import UserLayout from './layout/user/UserLayout';
import AdminLayout from './layout/admin/AdminLayout';
import Login from './layout/user/Login/Login';
import Logup from './layout/user/Logup/Logup';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Logup />} />
        <Route path='/admin/*' element={<AdminLayout />} />
        <Route path='/*' element={<UserLayout />} />
      </Routes>
    </div>
  );
}

export default App;
