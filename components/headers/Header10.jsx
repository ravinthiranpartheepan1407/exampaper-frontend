"use client";
import { toggleMobileMenu } from "@/utlis/toggleMobileMenu";
import Nav from "./components/Nav";
import Image from "next/image";
import LanguageSelect from "./components/LanguageSelect";
import Link from "next/link";
import { CalendarPlus, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Header10({ links }) {

  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const checkAuthAndRedirect = () => {
  //     // Check for token in local storage
  //     const token = localStorage.getItem('authToken');
      
  //     if (token) {
  //       try {
  //         // Verify token structure and decode
  //         const tokenParts = token.split('.');
  //         if (tokenParts.length !== 3) {
  //           throw new Error('Invalid token format');
  //         }

  //         const tokenData = JSON.parse(atob(tokenParts[1]));
          
  //         // Check if token is expired
  //         if (tokenData.exp && tokenData.exp * 1000 < Date.now()) {
  //           localStorage.removeItem('authToken');
  //           setIsLoading(false);
  //           return;
  //         }

  //         // Set user email and redirect to pitch review
  //         setUserEmail(tokenData.email);
  //         router.push('/s24-courses');
  //         return;
  //       } catch (err) {
  //         console.error('Error processing token:', err);
  //         localStorage.removeItem('authToken');
  //         setIsLoading(false);
  //         return;
  //       }
  //     }
      
  //     setIsLoading(false);
  //   };

  //   checkAuthAndRedirect();
  // }, [router]);

  return (
    <div className="main-nav-sub full-wrapper">
      {/* Logo  (* Add your text or image to the link tag. Use SVG or PNG image format. 
              If you use a PNG logo image, the image resolution must be equal 200% of the visible logo
              image size for support of retina screens. See details in the template documentation. *) */}
      <div className="nav-logo-wrap local-scroll">
        <a href="#top" className="logo font-alt">
          <Image
            src="/assets/images/demo-strong/logo-white.svg"
            alt="Your Company Logo"
            width={176}
            height={34}
          />
        </a>
      </div>
      {/* Mobile Menu Button */}
      <div
        onClick={toggleMobileMenu}
        className="mobile-nav"
        role="button"
        tabIndex={0}
      >
        <i className="mobile-nav-icon" />
        <span className="visually-hidden">Menu</span>
      </div>
      {/* Main Menu */}
      <div className="inner-nav desktop-nav">
        <ul className="clearlist scroll-nav local-scroll scrollspyLinks">
          <Nav links={links} />
        </ul>
        <ul className="items-end clearlist local-scroll">
          {/* Languages */}

          {/* <LanguageSelect /> */}

          {/* End Languages */}
          {links[0].href.includes("https://forms.gle/BRZ6FHYqAKUJJNGYA") ? (
            <li>
              <Link
                href={`https://forms.gle/BRZ6FHYqAKUJJNGYA`}
                className="opacity-1 no-hover"
              >
                <span className="link-hover-anim" data-link-animate="y">
                  <span className="icon-ellipse me-1" /> Feedback
                </span>
              </Link>
            </li>
          ) : (
          <>
            <li>
              <a href="https://calendly.com/ravinthiran1407/evalentum-product-demo" className="input-section opacity-1 no-hover">
                <span style={{backgroundColor: 'transparent'}} className="link-hover-anim" data-link-animate="y">
                  <GraduationCap size={18} style={{marginTop: -3}} /> Business English Graduate
                </span>
              </a>
            </li>
            {/* <li>
              <a href="https://forms.gle/BRZ6FHYqAKUJJNGYA" className="opacity-1 no-hover">
                <span className="link-hover-anim" data-link-animate="y">
                  <span className="icon-ellipse me-1" /> Feedback
                </span>
              </a>
            </li> */}
            </>
          )}
        </ul>
      </div>
      {/* End Main Menu */}
    </div>
  );
}
