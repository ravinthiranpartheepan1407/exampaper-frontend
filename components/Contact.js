'use client'
import React, { useState } from 'react'
import Link from 'next/link'

export default function Contact() {

  const [form, setForm] = useState({ email: "", name: "", phone: "", msg: "" });
  const [active, setActive] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const { email, name, phone, msg } = form;
  const onSubmit = (e) => {
    e.preventDefault();
    if (email && name && phone && msg) {
      setSuccess(true);
      setTimeout(() => {
        setForm({ email: "", name: "", phone: "", msg: "" });
        setSuccess(false);
      }, 2000);
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  };

  return (
    <>
      <div className="techwave_fn_contact_page">
        {/* Page Title */}
        <div className="techwave_fn_pagetitle">
          <h2 className="title">Contact Us</h2>
        </div>
        {/* !Page Title */}
        <div className="contactpage">
          <div className="container small">
            <p>We value your feedback, inquiries, and suggestions. Please feel free to reach out to us using the contact form below. Our dedicated team is ready to assist you with any questions or concerns you may have.</p>
            <p>Please fill out the form with your contact information and a detailed message, and we will get back to you as soon as possible. Your privacy is important to us, and we will never share your information with third parties.</p>
            <div className="fn_contact_form">
              <form onSubmit={(e) => onSubmit(e)} className="contact_form" id="contact_form" autoComplete="off">
                <div className="input_list">
                  <ul>
                    <li className={`input_wrapper ${active === "name" || name ? "active" : ""
                      }`}>
                      <input onFocus={() => setActive("name")}
                        onBlur={() => setActive(null)}
                        onChange={(e) => onChange(e)}
                        value={name}
                        name="name"
                        id="name"
                        type="text"
                        placeholder="Full Name *" />
                    </li>
                    <li className={`input_wrapper ${active === "email" || email ? "active" : ""
                      }`}>
                      <input onFocus={() => setActive("email")}
                        onBlur={() => setActive(null)}
                        onChange={(e) => onChange(e)}
                        value={email}
                        name="email"
                        id="email"
                        type="email"
                        placeholder="Email *" />
                    </li>
                    <li className={`input_wrapper ${active === "phone" || phone ? "active" : ""
                      }`}>
                      <input onFocus={() => setActive("phone")}
                        onBlur={() => setActive(null)}
                        onChange={(e) => onChange(e)}
                        value={phone}
                        name="phone"
                        id="tel"
                        type="text"
                        placeholder="Phone *" />
                    </li>
                    <li className={`input_wrapper ${active === "message" || msg ? "active" : ""
                      }`}>
                      <textarea onFocus={() => setActive("message")}
                        onBlur={() => setActive(null)}
                        name="msg"
                        onChange={(e) => onChange(e)}
                        value={msg}
                        id="message"
                        placeholder="Message *" />
                    </li>
                    <li>
                      <div>
                        <button
                          className='techwave_fn_button'
                          type="submit"
                          id="send_message"
                          value="Send Message"
                        >Send Message
                          </button>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="returnmessage" style={{ display: success ? "block" : "none" }} >
                  <span className="contact_success">
                    Your message has been received, We will contact you soon
                  </span>
                </div>

                <div
                  className="empty_notice"
                  style={{ display: error ? "block" : "none" }}
                >
                  <span>Please Fill Required Fields!</span>
                </div>
              </form>
            </div>
            <div className="fn__space__30" />
            <hr data-h={2} />
            <div className="fn__space__10" />
            <p>In case you prefer to contact us through other means, you can also find our phone number and mailing address listed below. We strive to provide exceptional customer service and ensure that your experience with us is seamless.</p>
            <p>Thank you for choosing us as your trusted resource. We look forward to hearing from you!</p>
            <p>Contact Information:<br />
              Phone: <span className="heading_color">[Insert Phone Number]</span><br />
              Address: <span className="heading_color">[Insert Mailing Address]</span></p>
            <p>Please note that our office hours are [Insert Office Hours]. While we endeavor to respond to all inquiries promptly, there may be slight delays during weekends and holidays.</p>
          </div>
        </div>
      </div>

    </>
  )
}