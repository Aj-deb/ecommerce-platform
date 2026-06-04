import React from "react"
export default function Leftside({ title, subtitle, buttontext, onClick,showbutton }) {
    return (
        <>
            <div className="h-full flex flex-col items-center justify-center gap-6 text-center">

                <h1 className="text-white text-5xl leading-[56px] font-semibold">
                    {title}
                </h1>

                <p className="text-white/80 text-base">
                    {subtitle}
                </p>
               { buttontext && <button onClick={onClick}
                    className="rounded-md w-1/2 px-6 py-2
                        bg-gray-400 text-gray-900
                        outline-none focus:outline-none"
                >
                    {buttontext}
                </button>}
            </div>
        </>
    )
}