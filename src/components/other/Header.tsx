import React, { useContext } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { UserContext } from "../../Context";

export default function Header(): React.ReactElement {
    const location = useLocation()
    const [user] = useContext(UserContext)
    
    /** ========== JSX ========== **/
    return <>
    <div className="flex flex-row justify-between items-center w-full h-20 px-5">
        <div className="w-12 h-12 opacity-0"></div>
        {
                <Link to="/dashboard"><p className="p-2 font-extrabold text-2xl hover:cursor-pointer" style={{ "fontFamily": "'Playwrite PL'" }}>ZìScreen</p></Link>
        }
        {
                user !== null ? <Link to="/profile"><img className="w-12 h-12 rounded-full" src="/media/profile.png" alt="profile" /></Link>
            : (location.pathname === "/") ? <Link to="/sign-in"><p className="text-xl mr-20 p-2 border-2 border-white rounded-md">Sign in</p></Link>
            : <div className="w-12 h-12 opacity-0"></div>
        }
    </div>
    
    <div className="max-w-screen-xl mx-auto my-10">
        <Outlet />
    </div>
    </>
}