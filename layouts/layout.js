"use client"
import { useEffect, useState } from 'react'
import { imageToSvg } from '../components/Utilities'
import Footer from './footer'
import Header from './header'
import Left from './left'
import Search from './search'

export default function Layout({ children, leftMenu }) {
    const [leftmenu, setLeftmenu] = useState(false)
    const [mobileMenu, setMobileMenu] = useState(false)
    const [OpenSearch, setOpenSearch] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            imageToSvg()
        }, 2000);

        if (leftMenu) {
            document.querySelector('.techwave_fn_wrapper').classList.add("fn__has_sidebar")
        }
    }, [])

    const activeTrueFalse = () => {
        setLeftmenu(!leftmenu)
        document.querySelector('.toggleMenu').classList.toggle("panel-opened")
    }

    const activeMobileMenu = () => {
        setMobileMenu(!mobileMenu)
        const wrapper = document.querySelector('.techwave_fn_wrapper')
        if (wrapper) {
            if (!mobileMenu) {
                wrapper.classList.add("mobile-panel-opened")
            } else {
                wrapper.classList.remove("mobile-panel-opened")
            }
        }
    }

    const searchToggle = () => {
        setOpenSearch(!OpenSearch)
    }

    return (
        <>
            <div className="techwave_fn_fixedsub">
                <ul />
            </div>
            <div className={`techwave_fn_wrapper ${mobileMenu ? 'mobile-panel-opened' : ''}`}>
                <div className="techwave_fn_wrap">
                    <Search OpenSearch={OpenSearch} searchToggle={searchToggle} />
                    <Header searchToggle={searchToggle} />
                    <Left 
                        activeTrueFalse={activeTrueFalse} 
                        activeMobileMenu={activeMobileMenu}
                        isMobileMenuOpen={mobileMenu}
                    />
                    <div className="techwave_fn_content">
                        <div className="techwave_fn_page">
                            {children}
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        </>
    )
}