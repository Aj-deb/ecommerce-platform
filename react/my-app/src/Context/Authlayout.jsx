export const AuthLayout=({children,left})=>{
    return (
        <>
            <div className="bg-[#111827]  w-full min-h-screen flex items-center justify-center">
                <div className=" rounded-3xl overflow-hidden w-full max-w-6xl min-h-[600px] md:h-[calc(100vh-100px)] flex">
                    <div className=" w-1/2 h-full bg-gradient-to-br from-[#2F2A85] via-[#6D4CC9] to-[#C84E9E]">
                    {/* left side */}
                      <div className="w-full h-full">
                        {left}   
                      </div>
                    {/* right wali side */}
                    </div>
                    <div className="bg-[#FFFFFF] w-1/2">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AuthLayout