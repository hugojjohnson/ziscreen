import React from "react";
import { Link } from "react-router-dom";


export default function Welcome(): React.ReactElement {
    return <>
        <div className="flex flex-col items-center w-full h-screen">
            <h1 className="text-7xl animate-fadeIn mt-[30vh] mb-[4vh]">Become a Hanzi Boss.</h1>
            <p className="text-4xl mb-[6vh]">A simple and effective way to learn to write Simplified Chinese</p>
            <Link to={"/sign-up"}><button className="mt-5 p-3 border-[1px] border-black rounded-md text-xl">Get started</button></Link>
        </div>
        
      {/* <!-- Footer --> */}
       <div>

       </div>    
    </>
}