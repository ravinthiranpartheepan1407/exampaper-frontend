"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import axios from 'axios';
import Image from 'next/image';
import AnimatedText from '@/components/common/AnimatedText';
import { toast } from 'react-toastify';
import { RotateCcw, Loader } from 'lucide-react';
import dynamic from "next/dynamic";
const ParallaxContainer = dynamic(
  () => import("@/components/common/ParallaxContainer"),
  {
    ssr: false, // Disable server-side rendering
  }
);

export default function ResetPassword() {
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isRequestingCode, setIsRequestingCode] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [codeRequested, setCodeRequested] = useState(false);
    const router = useRouter()

    const [email, setEmail] = useState('');
    
    useEffect(() => {
        // Check for token in local storage
        const token = localStorage.getItem('authToken');
        if (!token) {
          // Redirect to login if no token
          router.push('/');
          return;
        }
      
        // Decode token to get user information
        let decodedEmail;
        try {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          decodedEmail = tokenData.email;
          setEmail(decodedEmail);
          console.log(decodedEmail)
        } catch (err) {
          console.error('Error decoding token:', err);
          router.push('/');
          return;
        }
    }, [router]);
  
    const handleRequestReset = async () => {
      if (!email) return;
      setIsRequestingCode(true);
      try {
        await axios.post('https://edevalentum.com/request-reset/', { email });
        toast.success('Password reset token sent to your email');
        setCodeRequested(true);
      } catch (error) {
        toast.error('Error requesting password reset');
      } finally {
        setIsRequestingCode(false);
      }
    };
  
    const handleResetPassword = async () => {
      if (!resetToken || !newPassword) return;
      setIsResettingPassword(true);
      try {
        await axios.post('https://edevalentum.com/reset-password/', { 
          email, 
          reset_token: resetToken, 
          new_password: newPassword 
        });
        toast.success('Password reset successfully');
        router.push("/update-password");
      } catch (error) {
        toast.error('Error resetting password');
        setIsResettingPassword(false);
      }
    };

  return (
    <div className="theme-main">
      <div className="dark-mode">
        <div className="page" id="top">
          <main id="main">
            <section className="page-section pt-0 pb-0" id="home">
              <ParallaxContainer
                className="page-section pb-100 pb-sm-60 light-content parallax-5"
                style={{backgroundColor: '#fbfbfb'}}
              >
                <>
                  <div className="position-absolute top-0 bottom-0 start-0 end-0 "></div>
                  <div className="container position-relative pt-50">
                    <div className="text-center">
                      <div className="row">
                        <div className="col-md-8 offset-md-2">
                          <h2 style={{color: '#a6264c'}} className="section-caption-border mb-30 mb-xs-20">
                            Update Password
                          </h2>
                          <h1 className="hs-title-1 mb-0">
                            {/* <span className="wow charsAnimIn" data-splitting="chars">
                              <AnimatedText text="Request verification code to update your password" />
                              <p></p>
                            </span> */}
                            <p style={{color: '#a6264c'}}>Request verification code to update your password</p>
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              </ParallaxContainer>
            </section>
            <section style={{backgroundColor: '#fbfbfb'}} className="page-section light-content pt-0">
              <div className="container wow fadeInUp">
                <div className="row">
                  <div className="col-md-6 offset-md-3">
                    <div className="form contact-form">
                      <div className="text-center mb-40">
                        <h5 style={{color: '#a6264c'}} className="hs-title">
                          {email && `Check for an email from evalentumapp@gmail.com sent to your ${email} account`}
                        </h5>
                      </div>
                      
                      <div className="form-group">
                        <input
                          style={{color: '#a6264c', borderColor: '#a6264c'}}
                          type="email"
                          className="input-lg round form-control"
                          placeholder="Enter Your Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          readOnly
                        />
                      </div>

                      <div className="pt-10 mb-30">
                        <button
                          type="button"
                          className="submit_btn btn btn-mod btn-large btn-round btn-full btn-hover-anim"
                          onClick={handleRequestReset}
                          disabled={isRequestingCode || !email}
                          style={{backgroundColor: '#a6264c'}}
                        >
                          {isRequestingCode ? (
                            <Loader className="animate-spin mr-2" />
                          ) : (
                            <i className="icon-mail mr-2" />
                          )} &nbsp;
                          Request Code
                        </button>
                      </div>

                      {codeRequested && (
                        <div className="mt-20">
                          <div className="form-group">
                            <input
                              type="text"
                              className="input-lg round form-control"
                              placeholder="Enter Verification Code"
                              value={resetToken}
                              onChange={(e) => setResetToken(e.target.value)}
                            />
                          </div>

                          <div className="form-group">
                            <input
                              type="password"
                              className="input-lg round form-control"
                              placeholder="Enter New Password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                          </div>

                          <div className="flex items-center justify-center pt-10 mb-30">
                            <button
                              type="button"
                              className="submit_btn btn btn-primary btn-mod btn-large btn-round mr-10"
                              onClick={handleResetPassword}
                              style={{ backgroundColor: '#FF9A00' }}
                              disabled={isResettingPassword || !resetToken || !newPassword}
                            >
                              {isResettingPassword ? (
                                <Loader className="animate-spin mr-2" />
                              ) : (
                                <RotateCcw className="icon-lock-reset mr-2" />
                              )} &nbsp;
                              Reset Password
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
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