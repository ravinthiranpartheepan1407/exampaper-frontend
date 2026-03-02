import React from 'react'
 
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function loading() {
    return (
        <>
            <div className="techwave_fn_preloader enabled">
                <svg>
                    <circle className="first_circle" cx="50%" cy="50%" r={110} />
                    <circle className="second_circle" cx="50%" cy="50%" r={110} />
                </svg>
            </div>
        </>
    )
}
