"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { toast } from 'react-toastify';
import { Check, X } from 'lucide-react';

export default function Account() {
  const router = useRouter();
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Registration State
  const [username, setUsername] = useState('');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [registrationPassword, setRegistrationPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [passwordValidity, setPasswordValidity] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const passwordValidationRegex = {
    length: /.{8,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
    specialChar: /[@$!%*?&]/
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const response = await axios.post('https://appbilberry.com/login/', {
        email: loginEmail,
        password: loginPassword,
      });
      if (response.data.token) {
        // Store the token in local storage
        localStorage.setItem('authToken', response.data.token);
        router.push('/mock-exams');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail 
        ? (error.response.data.detail === 'Email not verified. Please verify your email using the OTP sent.'
          ? 'Please verify your email using the OTP sent.'
          : 'Unable to access your account. Please ensure your email address and password are correct.')
        : 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  const handlePasswordChange = (text) => {
    setRegistrationPassword(text);
    const validity = {
      length: passwordValidationRegex.length.test(text),
      uppercase: passwordValidationRegex.uppercase.test(text),
      lowercase: passwordValidationRegex.lowercase.test(text),
      number: passwordValidationRegex.number.test(text),
      specialChar: passwordValidationRegex.specialChar.test(text),
    };
    setPasswordValidity(validity);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isAgreed) {
      toast.error('You must agree to the terms and conditions.');
      return;
    }

    if (Object.values(passwordValidity).includes(false)) {
      toast.error('Password does not meet the required criteria.');
      return;
    }

    setRegistrationLoading(true);
    try {
      const response = await axios.post('https://appbilberry.com/register/', {
        username: username,
        email: registrationEmail,
        password: registrationPassword,
      });
      setIsOtpSent(true);
    } catch (error) {
      console.error(error);
      toast.error('Registration failed.');
    } finally {
      setRegistrationLoading(false);
    }
  };

  return (
    <div className="container wow fadeInUp">
      {/* Nav Tabs */}
      <div className="align-center mb-40 mb-sm-30">
        <ul
          className="nav nav-tabs tpl-minimal-tabs animate"
          id="myTab-account"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <a
              href="#account-login"
              className="nav-link active"
              id="account-login-tab"
              data-bs-toggle="tab"
              role="tab"
              aria-controls="account-login"
              aria-selected="true"
            >
              Login
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              href="#account-registration"
              className="nav-link"
              id="account-registration-tab"
              data-bs-toggle="tab"
              role="tab"
              aria-controls="account-registration"
              aria-selected="false"
            >
              Registration
            </a>
          </li>
        </ul>
      </div>
      
      {/* Tab panes */}
      <div
        className="tab-content tpl-minimal-tabs-cont section-text"
        id="myTabContent-1"
      >
        {/* Login Tab */}
        <div
          className="tab-pane fade show active"
          id="account-login"
          role="tabpanel"
          aria-labelledby="account-login-tab"
        >
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <form onSubmit={handleLogin} className="form contact-form">
                <div className="mb-30">
                  <div className="form-group">
                    <label htmlFor="username">Email</label>
                    <input
                      type="email"
                      name="username"
                      id="username"
                      className="input-lg round form-control"
                      placeholder="Enter email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="input-lg round form-control"
                      placeholder="Enter password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="row mb-30">
                  <div className="col-6">
                    <div className="form-tip pt-10">
                      <a href="/reset-password">Forgot Password?</a>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-end">
                      <button
                        type="submit"
                        className="submit_btn btn btn-white btn-mod btn-large btn-round btn-hover-anim"
                        id="login-btn"
                        disabled={loginLoading}
                      >
                        {loginLoading ? 'Logging in...' : 'Login'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-tip bg-gray-light-1 round p-3 form-tip-2">
                  <i className="icon-info size-16" />
                  All fields are required. By logging in, you agree to the{' '}
                  <span>Terms & Conditions</span> and{' '}
                  <a href="/privacy-policy">Privacy Policy</a>.
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Registration Tab */}
        <div
          className="tab-pane fade"
          id="account-registration"
          role="tabpanel"
          aria-labelledby="account-registration-tab"
        >
          <div className="row">
            <div className="col-md-6 offset-md-3">
              {!isOtpSent ? (
                <form onSubmit={handleRegister} className="form contact-form">
                  <div className="clearfix">
                    <div className="form-group">
                      <label htmlFor="reg-email">Email</label>
                      <input
                        type="email"
                        name="reg-email"
                        id="reg-email"
                        className="input-lg round form-control"
                        placeholder="Enter email"
                        value={registrationEmail}
                        onChange={(e) => setRegistrationEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="reg-username">Username</label>
                      <input
                        type="text"
                        name="reg-username"
                        id="reg-username"
                        className="input-lg round form-control"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="reg-password">Password</label>
                      <input
                        type="password"
                        name="reg-password"
                        id="reg-password"
                        className="input-lg round form-control"
                        placeholder="Enter password"
                        value={registrationPassword}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        required
                      />
                      {registrationPassword && (
                        <div style={{
                          marginTop: '16px',
                          padding: '16px',
                          borderRadius: '8px',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '12px',
                        }}>
                          <small style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: passwordValidity.length ? '#198754' : '#dc3545',
                            fontSize: '13px'
                          }}>
                            {passwordValidity.length ? <Check size={16} style={{ marginRight: '8px' }} /> : <X size={16} style={{ marginRight: '8px' }} />}
                            At least 8 characters
                          </small>

                          <small style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: passwordValidity.uppercase ? '#198754' : '#dc3545',
                            fontSize: '13px'
                          }}>
                            {passwordValidity.uppercase ? <Check size={16} style={{ marginRight: '8px' }} /> : <X size={16} style={{ marginRight: '8px' }} />}
                            At least 1 uppercase letter
                          </small>

                          <small style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: passwordValidity.lowercase ? '#198754' : '#dc3545',
                            fontSize: '13px'
                          }}>
                            {passwordValidity.lowercase ? <Check size={16} style={{ marginRight: '8px' }} /> : <X size={16} style={{ marginRight: '8px' }} />}
                            At least 1 lowercase letter
                          </small>

                          <small style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: passwordValidity.number ? '#198754' : '#dc3545',
                            fontSize: '13px'
                          }}>
                            {passwordValidity.number ? <Check size={16} style={{ marginRight: '8px' }} /> : <X size={16} style={{ marginRight: '8px' }} />}
                            At least 1 number
                          </small>

                          <small style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: passwordValidity.specialChar ? '#198754' : '#dc3545',
                            fontSize: '13px',
                            gridColumn: '1 / -1'  // Makes this span the full width
                          }}>
                            {passwordValidity.specialChar ? <Check size={16} style={{ marginRight: '8px' }} /> : <X size={16} style={{ marginRight: '8px' }} />}
                            At least 1 special character
                          </small>
                        </div>
                      )}
                    </div>
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="terms-agreement"
                        checked={isAgreed}
                        onChange={() => setIsAgreed(!isAgreed)}
                      />
                      <label className="form-check-label" htmlFor="terms-agreement">
                        I agree to the{' '}
                        <span>Terms & Conditions</span> and{' '}
                        <a href="/privacy-policy">Privacy Policy</a>
                      </label>
                    </div>
                  </div>
                  <div className="pt-10 mb-30">
                    <button
                      type="submit"
                      className="submit_btn btn btn-mod btn-white btn-large btn-round btn-full btn-hover-anim"
                      id="reg-btn"
                      disabled={registrationLoading || !isAgreed || Object.values(passwordValidity).includes(false)}
                    >
                      {registrationLoading ? 'Registering...' : 'Register'}
                    </button>
                  </div>
                  <div className="form-tip bg-gray-light-1 round p-3 form-tip-2">
                    <i className="icon-info size-16" />
                    All fields are required. By registering, you agree to the{' '}
                    <span>Terms & Conditions</span> and{' '}
                    <a href="/privacy-policy">Privacy Policy</a>.
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <h3>OTP Verification</h3>
                  <p>An OTP has been sent to {registrationEmail}</p>
                  <button
                    onClick={() => router.push(`/verify-otp?email=${registrationEmail}`)}
                    className="btn btn-mod btn-white btn-large btn-round btn-full btn-hover-anim"
                  >
                    Proceed to OTP Verification
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}