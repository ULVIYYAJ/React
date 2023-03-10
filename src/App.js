import './App.css';
import React, { useEffect } from 'react';
import "react-toastify/dist/ReactToastify.css";
import { Route, BrowserRouter, Routes, Navigate, } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import NavBar from './components/NavBar';
import Cart from './components/Cart';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Registration from './pages/Registration';
import Login from './pages/Login';
import { auth, handleUserProfile } from './firebase/utils';
import Recovery from './pages/Recovery';
import { setCurrentUser } from './redux/User/user.actions';
import { useDispatch} from 'react-redux';
import Dashboard from './pages/Dashboard';
import WithAuth from './hoc/withAuth';

const App = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    const authListener = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await handleUserProfile(userAuth);
        userRef.onSnapshot(snapshot => {
          dispatch(setCurrentUser({
            id: snapshot.id,
            ...snapshot.data()
          }));
        });
      }
        dispatch(setCurrentUser(userAuth));
    });
    return ()=>{
      authListener();
    };
  }, [setCurrentUser]);

  return (
    <div className='App'>
      <BrowserRouter>
        <ToastContainer>
        </ToastContainer>
        <NavBar />
        <Routes>
          <Route path='/cart' exact element={<Cart />}  />
          <Route path='/' exact element={<Home />}  />
          <Route path="/" element={<Navigate to="not-found" />} />
          <Route path="not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="not-found" />} />
          <Route path='/registration' exact element={<Registration />} />
          <Route path='/login' element={<Login/>} />
          <Route path='/recovery' exact element={<Recovery />} />  
          <Route path='/dashboard' element={<WithAuth><Dashboard /></WithAuth>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
