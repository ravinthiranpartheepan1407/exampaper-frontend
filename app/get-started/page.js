import Footer1 from "@/components/footers/Footer1";
import Link from "next/link";
import dynamic from "next/dynamic";
import { strongSinglePages } from "@/data/menu";
import Layout from '@/layouts/layout'

const ParallaxContainer = dynamic(
  () => import("@/components/common/ParallaxContainer"),
  {
    ssr: false, // Disable server-side rendering
  }
);

import Header1Multipage from "@/components/headers/Header1Multipage";
import AnimatedText from "@/components/common/AnimatedText";
import Image from "next/image";

import React from "react";

import { menuItemsDark } from "@/data/menu";
import Account from "@/components/others/Account";
import Header10 from "@/components/headers/Header10";
import ExamMarket from "@/components/ExamMarket";

export const metadata = {
  title:
    "Studypoints24",
  description:
    "Studypoints24 - Learning made easy and accessible!",
};
export default function GetStarted() {
  return (
    <>
      <div className="theme-main">
        <div className="dark-mode">
          <div className="page bg-dark-1" id="top">
            <nav className="main-nav dark dark-mode transparent stick-fixed wow-menubar">
              <Header10 links={strongSinglePages} />
            </nav>
            <main id="main">
              <section className="page-section pt-0 pb-0" id="home">
                <ParallaxContainer
                  className="page-section pb-100 pb-sm-60 bg-dark-1 bg-dark-alpha-70 light-content parallax-5"
                  style={{
                    backgroundImage:
                      "url(/texture/eval-9.jpg)",
                  }}
                >
                  <>
                    <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-gradient-dark"></div>
                    <div className="container position-relative pt-50">

                      <div className="text-center">
                        <div className="row">

                          <div className="col-md-8 offset-md-2">
                            <h2
                              style={{color: 'white'}}
                              className="section-caption-border mb-30 mb-xs-20 wow fadeInUp"
                              data-wow-duration="1.2s"
                            >
                              Account
                            </h2>
                            <h1 style={{color: 'white'}} className="hs-title-1 mb-0">
                              <span
                                className="wow charsAnimIn"
                                data-splitting="chars"
                              >
                                <AnimatedText text="Make Today a Day to Learn Something New" />
                              </span>
                            </h1>
                          </div>

                        </div>
                      </div>

                    </div>
                  </>
                </ParallaxContainer>
              </section>
              <>
                <>
                  <section className="page-section bg-dark-1 light-content pt-0">
                    <Account />
                  </section>


                  <hr className="mt-0 mb-0 white" />
                </>

                <section className="page-section">
                  <div className="container position-relative">

                    <div className="position-relative">
                      <div
                        className="decoration-21 d-none d-lg-block"
                        data-rellax-y=""
                        data-rellax-speed="0.7"
                        data-rellax-percentage="0.5"
                      >
                        {/* <Image
                          width={148}
                          height={148}
                          src="/assets/images/decoration-3.svg"
                          className="svg-shape"
                          alt=""
                        />  */}
                      </div>
                    </div>

                    <div className="row wow fadeInUp">
                      <div className="col-md-6 offset-md-1 col-lg-5 offset-lg-2 text-md-start mb-sm-30">
                        <p className="section-descr mb-0">
                          Have any questions? Contact us,
                          and we'll start productive cooperation.
                        </p>
                      </div>
                      <div className="col-md-4 col-lg-3 text-md-end">
                        <div className="local-scroll">
                          <Link
                            href={'https://forms.gle/BRZ6FHYqAKUJJNGYA'}
                            className="btn btn-mod btn-white btn-large btn-round btn-hover-anim"
                          >
                            <span>Contact us</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            </main>

          </div>{" "}
        </div>
      </div>
    </>
  );
}
