
import React from 'react'
import Link from 'next/link'


export default function UserProfile() {
  return (
    <>
      <div className="techwave_fn_user_profile_page">
        {/* Page Title */}
        <div className="techwave_fn_pagetitle">
          <h2 className="title">User Profile</h2>
        </div>
        {/* !Page Title */}
        <div className="container small">
          <div className="techwave_fn_user_profile">
            <div className="user__profile">
              <div className="user_avatar">
                <img src="img/user/user.jpg" alt=""  />
              </div>
              <div className="user_details">
                <ul>
                  <li>
                    <div className="item">
                      <h4 className="subtitle">Name</h4>
                      <h3 className="title">Caden Smith</h3>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <h4 className="subtitle">Username</h4>
                      <h3 className="title">@caddeomyth</h3>
                    </div>
                  </li>
                  <li>
                    <div className="item">
                      <h4 className="subtitle">Email Address</h4>
                      <h3 className="title">cadensmith@gmail.com</h3>
                    </div>
                  </li>
                </ul>
              </div>
              <Link href="/user-settings" className="user_edit fn__icon_button">
                <img src="svg/setting.svg" alt=""  className="fn__svg" />
              </Link>
            </div>
            <div className="user__plan">
              <div className="plan_left">
                <h4 className="subtitle">Your Plan</h4>
                <p className="info"><span>Personal Plan</span> - You will given 8000 tokens every month</p>
              </div>
              <div className="plan_right">
                <Link href="/pricing" className="token_upgrade techwave_fn_button"><span>Upgrade</span></Link>
              </div>
            </div>
            <div className="user__interests">
              <h4 className="title">What are your interests?</h4>
              <div className="fn__options_list">
                <ul>
                  <li>
                    <Link href="#" className="techwave_fn_button small__border enabled">
                      <span>Advertising</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="techwave_fn_button small__border disabled">
                      <span>Architecture</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="techwave_fn_button small__border disabled">
                      <span>Art</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="techwave_fn_button small__border disabled">
                      <span>Education</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="techwave_fn_button small__border disabled">
                      <span>Fashion</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="techwave_fn_button small__border disabled">
                      <span>Film TV</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="techwave_fn_button small__border disabled">
                      <span>Interior</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="techwave_fn_button small__border enabled">
                      <span>Marketing</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="techwave_fn_button small__border disabled">
                      <span>Graphics</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="techwave_fn_button small__border disabled">
                      <span>Games</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="techwave_fn_button small__border disabled">
                      <span>Stock Images</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="techwave_fn_button small__border disabled">
                      <span>Other</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}