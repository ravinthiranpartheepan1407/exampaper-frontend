
import React from 'react'
import Link from 'next/link'


export default function Signin() {
  return (
    <>
      <div className="techwave_fn_sign">
        <div className="sign__content">
          <form className="login">
            <div className="form__content">
            <span className="full_logo">
                <img src="/img/logo-desktop-full.png" alt="" className="desktop_logo" />
                <img src="/img/logo-desktop-full.png" alt="" className="retina_logo" />
            </span>
              <div className="form__username">
                <label htmlFor="user_login">Username or Email</label>
                <input type="text" className="input" id="user_login" autoCapitalize="off" autoComplete="username" aria-describedby="login-message" />
              </div>
              <div className="form__pass">
                <div className="pass_lab">
                  <label htmlFor="user_password">Password</label>
                  <Link href="#">Forget Password?</Link>
                </div>
                <input type="password" id="user_password" autoComplete="current-password" spellCheck="false" />
              </div>
              <div className="form__submit">
                <label className="fn__submit">
                  <input type="submit" name="submit" defaultValue="Sign In" />
                </label>
              </div>
              <div className="form__alternative">
                <div className="fn__lined_text">
                  <div className="line" />
                  <div className="text">Or</div>
                  <div className="line" />
                </div>
                <Link href="#" className="techwave_fn_button"><span>Sign in with Google</span></Link>
              </div>
            </div>
          </form>
          <div className="sign__desc">
            <p>Not a member? <Link href="/sign-up">Sign Up</Link></p>
          </div>
        </div>
      </div>

    </>
  )
}