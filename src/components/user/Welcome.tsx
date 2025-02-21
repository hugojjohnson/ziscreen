import React from "react";
import { Link } from "react-router-dom";


export default function Welcome(): React.ReactElement {
    return <>
        <div className="flex flex-col items-center w-full h-screen">
            <h1 className=" text-4xl animate-fadeIn mt-[40vh]">A simple template for your web app.</h1>
            <Link to={"/sign-up"}><button className="mt-5 p-3 border-[1px] border-black rounded-md text-xl">Get started</button></Link>
        </div>
        
      {/* <!-- Footer --> */}
       <div>

       </div>    
    </>
}