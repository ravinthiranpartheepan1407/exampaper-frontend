"use client"
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GraduationCap, Lock, StepForward, Zap } from 'lucide-react';


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
        title: "Mock Exams",
        pathname: "/mock-exams",
        img: "/svg/smallscreen.svg",
        
    },


    {
        title: "Micro Courses",
        pathname: "/micro-courses",
        // img: "/svg/video.svg",
        img: "/svg/cube.svg",
        
    },
    {
        title: "Find your Job Fit",
        pathname: "/job-search",
        img: "/svg/new.svg",
        
    },

    {
        title: "E-Notes Resources",
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
        pathname: "https://forms.office.com/r/8DFMQGJypx",
        img: "/svg/community.svg",
        

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
        title: "Manage Subscription",
        pathname: "/subscription",
        img: "/svg/billing.svg"

    },
    {
        title: "Feedback Form",
        pathname: "https://forms.cloud.microsoft/r/2iuZCvQBMr?origin=lprLink",
        img: "/svg/question.svg"

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

    const [userEmail, setUserEmail] = useState('');

    const [isToggle, setToggle] = useState(false)
    const toggleHandle = () => setToggle(!isToggle);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        try {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          setUserEmail(tokenData.email);
        } catch (err) {
          console.error('Error decoding token:', err);
        }
      }, []);

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const publicRoutes = ['/', '/register', '/verify-otp', '/micro-courses', '/job-search', '/job-search/list', '/job-search/[id]'];
        
        // If no token and not on public routes, redirect to login
        if (!token && !publicRoutes.includes(pathname)) {
            router.push("/")
        }
    }, [pathname, router]);

    const PERSONAL_EMAIL_DOMAINS = new Set([
        'gmail.com','yahoo.com','outlook.com','hotmail.com','live.com',
        'icloud.com','me.com','mac.com','aol.com','protonmail.com',
        'proton.me','yandex.com','mail.com','gmx.com',
        'rediffmail.com','msn.com','inbox.com'
    ]);

    const [showBusinessModal, setShowBusinessModal] = useState(false);

    const isPersonalEmail = (email) => {
        const domain = email.split('@')[1]?.toLowerCase();
        return PERSONAL_EMAIL_DOMAINS.has(domain);
    };


    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            // Get the authentication token from localStorage
            const token = localStorage.getItem('authToken');

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
                        <h2 className="group__title">Exam Paper Modules</h2>
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
                            {data.slice(8, 9).map((item, i) => (
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
                    {userEmail ? (
                    <div className="nav_group">
                        <h2 className="group__title">Support</h2>
                        <ul className="group__list">
                            {data.slice(11, 13).map((item, i) => (
                                <li key={i}>
                                    {item.title === "Manage Subscription" && isPersonalEmail(userEmail) ? (
                                    <a
                                        href="#"
                                        onClick={e => { e.preventDefault(); setShowBusinessModal(true); }}
                                        className={`fn__tooltip menu__item`}
                                        title={item.title}
                                    >
                                        <span className="icon"><img src={item.img} alt="" className="fn__svg" /></span>
                                        <span className="text">{item.title}</span>
                                    </a>
                                    ) : (
                                    <Link href={item.pathname} className={`fn__tooltip menu__item ${pathname === item.pathname ? "active" : ""}`} title={item.title}>
                                        <span className="icon"><img src={item.img} alt="" className="fn__svg" /></span>
                                        <span className="text">{item.title}</span>
                                    </Link>
                                    )}
                                </li>
                            ))}

                            <li className={`menu-item-has-children ${isToggle ? "closed" : ""}`} >
                                <a className="fn__tooltip menu__item" title="FAQ & Help" onClick={toggleHandle} >
                                    <span className="icon"><img src="svg/setting.svg" alt="" className="fn__svg" /></span>
                                    <span className="text">Settings</span>
                                    <span className="trigger"><img src="svg/arrow.svg" alt="" className="fn__svg" /></span>
                                </a>
                                <ul className="sub-menu" style={{ display: `${isToggle ? "block" : "none"}` }}>
                                    {data.slice(13, 17).map((item, i) => (
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
                    ):(
                        <>
                            <button className="evaluate-btn" title="Apply for Business English Graduate">
                                <GraduationCap style={{width: 15, color: 'black', marginTop: -1}} />&nbsp;<span>Apply for Business English Graduate</span>
                            </button>
                            <style jsx>{`
                            .evaluate-btn {
                                background-color: #bff2f7;
                                color: black;
                                border: none;
                                border-radius: 40px;
                                padding: 0.5rem 1rem;
                                font-size: 0.75rem;
                                cursor: pointer;
                                margin-left: 0rem;
                            }
                        `}</style>
                        </>
                    )}
                    {/* !#3 navigation group */}
                </div>
                {/* !content (left panel) */}
            </div>
            {showBusinessModal && (
                <div
                    onClick={() => setShowBusinessModal(false)}
                    style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999,
                    }}
                >
                    <div
                    onClick={e => e.stopPropagation()}
                    style={{
                        background: '#fff', borderRadius: 16, padding: 32,
                        maxWidth: 420, width: '90%', textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    }}
                    >
                    <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#15173D', marginBottom: 8 }}>
                        Business Account Required
                    </h2>
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>
                        Subscription management is only available to users with a business account.
                        Please sign in with your company email (e.g. you@yourcompany.com) to access this feature.
                    </p>
                    <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 24 }}>
                        Currently signed in as: <strong style={{ color: '#15173D' }}>{userEmail}</strong>
                    </p>
                    <button
                        onClick={() => setShowBusinessModal(false)}
                        style={{
                        padding: '10px 28px', background: '#15173D', color: '#fff',
                        border: 'none', borderRadius: 40, fontSize: 13,
                        fontWeight: 600, cursor: 'pointer',
                        }}
                    >
                        Got it
                    </button>
                    </div>
                </div>
                )}
        </>
    )
}
