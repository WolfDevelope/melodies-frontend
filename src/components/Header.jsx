import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { removeUser } from '../features/userSlice';
 
const Header = () => {
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const handleSignOut = () => {
        signOut(auth).then(() => {
            dispatch(removeUser());
            navigate('/login');
        });
    };
    
    return (
        <div className="flex justify-between items-center p-4">
            <Link to="/">Home</Link>
            <Link to="/library">Library</Link>
            <Link to="/profile">Profile</Link>
            {user ? (
                <button onClick={handleSignOut}>Sign Out</button>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </div>
    );
};

export default Header;
