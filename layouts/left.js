"use client"
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Lock, Zap } from 'lucide-react';


const data = [

    {
        title: "Find your Job Fit",
        pathname: "#",
        img: "/svg/lock.svg",
        
    },
    {
        title: "Manage Job Posts",
        pathname: "#",
        img: "/svg/lock.svg",
        
    },

    {
        title: "S24 Test Engine",
        pathname: "/s24-tests",
        img: "/svg/smallscreen.svg",
        
    },

    {
        title: "S24 Micro Courses",
        pathname: "#",
        // img: "/svg/video.svg",
        img: "/svg/lock.svg",
        
    },

    {
        title: "S24 Library Catalogs",
        pathname: "#",
        img: "/svg/lock.svg",
        
    },

    {
        title: "Cognitive Learning",
        pathname: "/games/the-missing-pet",
        img: "/svg/sun.svg",

    },

    {
        title: "Research Assistant",
        pathname: "#",
        img: "/svg/lock.svg",
        
    },
 
    // {
    //     title: "S24 Web Research",
    //     pathname: "/s24-web-research",
    //     img: "/svg/envelope.svg",
        
    // },
    // {
    //     title: "Mindtrack (Beta)",
    //     pathname: "/mindtrack",
    //     img: "/svg/filter.svg",        

    // },
    {
        title: "Learn English",
        pathname: "#",
        img: "/svg/lock.svg",
        

    },

    {
        title: "Marketplace",
        pathname: "#",
        img: "/svg/lock.svg"

    },
    {
        title: "Student Academy",
        pathname: "#",
        img: "/svg/lock.svg"
        
    },
    {
        title: "Feedback Form",
        pathname: "https://forms.gle/BRZ6FHYqAKUJJNGYA",
        img: "/svg/thunder.svg"

    },

    {
        title: "Update Password",
        pathname: "/update-password",
        img: "/svg/logout.svg"
    },
    {
        title: "Log Out",
        pathname: "#",
        img: "/svg/logout.svg"

    }

];



export default function Left({ activeTrueFalse, activeMobileMenu }) {
    const pathname = usePathname()

    const [isToggle, setToggle] = useState(false)
    const toggleHandle = () => setToggle(!isToggle);

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const publicRoutes = ['/', '/register', '/verify-otp'];

        // If no token and not on public routes, redirect to login
        if (!token && !publicRoutes.includes(pathname)) {
            router.push('/s24-tests');
        }
    }, [pathname, router]);


    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            // Get the authentication token from localStorage
            const token = localStorage.getItem('authToken');

            // // Logout API call with authorization header
            // await axios.post("http://localhost:8000/logout/", {}, {
            //     headers: {
            //         'Authorization': `Bearer ${token}`,
            //         'Content-Type': 'application/json'
            //     },
            //     withCredentials: true
            // });

            // Remove token from localStorage
            localStorage.removeItem('authToken');

            // Redirect to the sign-in page
            router.push("/");
        } catch (error) {
            console.error("Error logging out:", error.response?.data || error.message);
            alert("Logout failed. Please try again.");
        }
    };

    return (
        <>
            <div className="techwave_fn_leftpanel">
                <div className="mobile_extra_closer" />
                {/* logo (left panel) */}
                <div className="leftpanel_logo">
                    <Link href="/investment-thesis" className="fn_logo">
                        <span className="full_logo">
                            <img src="/texture/Evalentum-2.png" alt="" className="desktop_logo" />
                            <img src="/texture/Evalentum-2.png" alt="" className="retina_logo" />
                        </span>
                        <span className="short_logo">
                            <img src="/img/logo-desktop-mini.png" alt="" className="desktop_logo" />
                            <img src="/img/logo-retina-mini.png" alt="" className="retina_logo" />
                        </span>
                    </Link>
                    {/* <a className="fn__closer fn__icon_button desktop_closer" onClick={activeTrueFalse}>
                        <img src="/svg/arrow.svg" alt="" className="fn__svg" />
                    </a> */}
                    <a className="fn__closer fn__icon_button mobile_closer" onClick={activeMobileMenu}>
                        <img src="/svg/arrow.svg" alt="" className="fn__svg" />
                    </a>
                </div>
                {/* !logo (left panel) */}
                {/* content (left panel) */}
                <div className="leftpanel_content">

                    <div className="nav_group">
                        <h2 className="group__title">Studypoints24 Engine</h2>
                        <ul className="group__list">
                            {data.slice(2, 5).map((item, i) => (
                                <li key={i}>
                                    <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                        <span className="icon">
                                            <img src={item.img} alt="" className="fn__svg" />
                                        </span>
                                        <span className="text">{item.title}{item.counter && <span style={{backgroundColor: "#151515"}} className="count">{item.counter}</span>}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    
                    {/* #0 navigation group */}
                    {/* <div className="nav_group">
                        <h2 className="group__title">Job Search Engine</h2>
                        <ul className="group__list">
                            {data.slice(0, 2).map((item, i) => (
                                <li key={i}>
                                    <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                        <span className="icon">
                                            <img src={item.img} alt="" className="fn__svg" />
                                        </span>
                                        <span className="text">{item.title}{item.counter && <span style={{backgroundColor: "#151515"}} className="count">{item.counter}</span>}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div> */}


                    <div className="nav_group">
                        <h2 className="group__title">Edu Marketplace</h2>
                        <ul className="group__list">
                            {data.slice(8, 10).map((item, i) => (
                                <li key={i}>
                                    <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                        <span className="icon">
                                            <img src={item.img} alt="" className="fn__svg" />
                                        </span>
                                        <span className="text">{item.title}{item.counter && <span style={{backgroundColor: "#151515"}} className="count">{item.counter}</span>}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
{/* 
                    <div className="nav_group">
                        <h2 className="group__title">Business Network</h2>
                        <ul className="group__list">
                            {data.slice(3, 5).map((item, i) => (
                                <li key={i}>
                                    <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                        <span className="icon">
                                            <img src={item.img} alt="" className="fn__svg" />
                                        </span>
                                        <span className="text">{item.title}{item.counter && <span style={{backgroundColor: "#151515"}} className="count">{item.counter}</span>}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div> */}


                    {/* #1 navigation group */}
                    {/* !#1 navigation group */}
                    {/* #2 navigation group */}
                    {/* !#2 navigation group */}
                    {/* #3 navigation group */}
                    <div className="nav_group">
                        <h2 className="group__title">Support</h2>
                        <ul className="group__list">
                            {data.slice(10, 11).map((item, i) => (
                                <li key={i}>
                                    <Link href={item.pathname} className={`fn__tooltip menu__item ${pathname === item.pathname ? " active" : ""}`} title={item.title} >
                                        <span className="icon"><img src={item.img} alt="" className="fn__svg" /></span>
                                        <span className="text">{item.title}</span>
                                    </Link>
                                </li>
                            ))}

                            <li className={`menu-item-has-children ${isToggle ? "closed" : ""}`} >
                                <a className="fn__tooltip menu__item" title="FAQ & Help" onClick={toggleHandle} >
                                    <span className="icon"><img src="svg/setting.svg" alt="" className="fn__svg" /></span>
                                    <span className="text">Settings</span>
                                    <span className="trigger"><img src="svg/arrow.svg" alt="" className="fn__svg" /></span>
                                </a>
                                <ul className="sub-menu" style={{ display: `${isToggle ? "block" : "none"}` }}>
                                    {data.slice(11, 16).map((item, i) => (
                                        <li key={i}>
                                            {item.title === "Log Out" ? (
                                                <a
                                                    href="#"
                                                    onClick={handleLogout}
                                                    className="fn__tooltip menu__item"
                                                    title="Log Out"
                                                >
                                                    {/* <span className="icon">
                                                        <img src="/svg/logout.svg" alt="" className="fn__svg" />
                                                    </span> */}
                                                    <span className="text">Log Out</span>
                                                </a>
                                            ) : (
                                                <Link
                                                    href={item.pathname}
                                                    className={`fn__tooltip menu__item ${
                                                        pathname === item.pathname ? "active" : ""
                                                    }`}
                                                    title={item.title}
                                                >
                                                    {/* <span className="icon">
                                                        <img src={item.img} alt="" className="fn__svg" />
                                                    </span> */}
                                                    <span className="text">{item.title}</span>
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            {data.slice(17, 18).map((item, i) => (
                                <li key={i}>
                                    <Link href={item.pathname} className={`text ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                        <span className="icon"><img src={item.img} alt="" className="fn__svg" /></span>
                                        <span className="text">{item.title}</span>
                                    </Link>
                                </li>
                            ))}

                        </ul>
                    </div>
                    {/* !#3 navigation group */}
                </div>
                {/* !content (left panel) */}
            </div>
        </>
    )
}
