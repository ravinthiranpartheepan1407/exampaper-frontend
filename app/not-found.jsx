import Footer1 from "@/components/footers/Footer1";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import Header10 from "@/components/headers/Header10";
import { strongSinglePages } from "@/data/menu";
import Footer9 from "@/components/footers/Footer9";
export const metadata = {
  title:
    "Page Not Found || Resonance &mdash; One & Multi Page React Nextjs Creative Template",
  description:
    "Resonance &mdash; One & Multi Page React Nextjs Creative Template",
};
export default function MainAboutPage1() {
  return (
    <>
      <div className="theme-main">
        <div className="page" id="top">
          <>
            <div className="dark-mode">
              <div className="page bg-dark-1" id="top">
                <nav className="main-nav dark dark-mode transparent stick-fixed wow-menubar">
                  <Header10 links={strongSinglePages} />
                </nav>
            {/* End Navigation Panel */}
            <main id="main">
              {/* Home Section */}
              <section
                className="home-section bg-dark-1 bg-dark-alpha-60 light-content parallax-5"
                style={{
                  backgroundImage:
                    "url(/texture/eval-9.jpg)",
                }}
                id="home"
              >
                <div className="container min-height-100vh d-flex align-items-center pt-100 pb-100 pt-sm-120 pb-sm-120">
                  {/* Home Section Content */}
                  <div className="home-content">
                    <div className="row">
                      <div className="col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                        <div className="hs-wrap">
                          <div className="wow fadeInUp" data-wow-delay=".1s">
                            <h1 className="hs-title-12 mb-40 mb-sm-30">404</h1>
                          </div>
                          <div
                            className="mb-40 mb-sm-30 wow fadeInUp"
                            data-wow-delay=".2s"
                          >
                            <h2 className="section-descr mb-20">
                              The page you were looking for could not be found.
                            </h2>
                          </div>
                          <div
                            className="local-scroll wow fadeInUp"
                            data-wow-delay=".3s"
                          >
                            <Link
                              href={`/`}
                              className="btn btn-mod btn-w btn-round btn-medium btn-hover-anim"
                            >
                              <i className="mi-arrow-left size-24 align-center" />
                              <span>Back To Home Page</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* End Home Section Content */}
                </div>
              </section>
              {/* End Home Section */}
            </main>
            </div>
            </div>
          </>
          {/* <Footer1 dark /> */}
        </div>{" "}
      </div>
    </>
  );
}
