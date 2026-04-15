"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import axios from 'axios';
import Image from 'next/image';
import AnimatedText from '@/components/common/AnimatedText';

import dynamic from "next/dynamic";
import Header10 from '@/components/headers/Header10';
import { strongSinglePages } from '@/data/menu';
import { toast } from 'react-toastify';
const ParallaxContainer = dynamic(
  () => import("@/components/common/ParallaxContainer"),
  {
    ssr: false, // Disable server-side rendering
  }
);

export default function OTPVerification() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://appbilberry.com/verifyotp/', {
        email,
        otp,
      });
      const { token } = response.data;
      toast.success("Registration Successful")
      router.push('/');
    } catch (error) {
      toast.error('OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
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
                          {/* Section Content */}
                          <div className="text-center">
                            <div className="row">
                              {/* Page Title */}
                              <div className="col-md-8 offset-md-2">
                                <h2
                                  style={{color: 'white'}}
                                  className="section-caption-border mb-30 mb-xs-20"
                                >
                                  OTP Verification
                                </h2>
                                <h1 className="hs-title-1 mb-0">
                                  {/* <span
                                    className="wow charsAnimIn"
                                    data-splitting="chars"
                                  >
                                    <AnimatedText text="Please enter OTP and verify your account" />
                                  </span> */}
                                  <p style={{color: 'white'}}>Please enter OTP and verify your account</p>
                                </h1>
                              </div>
                              {/* End Page Title */}
                            </div>
                          </div>
                          {/* End Section Content */}
                        </div>
                      </>
                    </ParallaxContainer>
                  </section>
    <section className="page-section bg-dark-1 light-content pt-0">
    <div className="container wow fadeInUp">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <form onSubmit={handleVerifyOtp} className="form contact-form">
            <div className="text-center mb-40">
              {/* <Image 
                src="https://lnzzqqhmqqpglzhcqxjw.supabase.co/storage/v1/object/public/icons/logo.png" 
                alt="Logo" 
                width={200} 
                height={150} 
                className="mb-30"
              /> */}
              {/* <h3 className='hs-title'>Verify Your Email</h3> */}
              <h5 style={{ color: 'grey' }} className='hs-title'>
                We&apos;ve sent a verification email from <strong>studypoints24app@gmail.com</strong> to your <strong>{email}</strong> account. If you don&apos;t see the OTP in your inbox, be sure to check your spam or junk folder.
              </h5>
            </div>
            
            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                name="otp"
                id="otp"
                className="input-lg round form-control"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            
            <div className="pt-10 mb-30">
              <button
                type="submit"
                className="submit_btn btn btn-white btn-mod btn-large btn-round btn-full btn-hover-anim"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </section>
    </main>
    </div>
    </div>
    </div>
  );
}