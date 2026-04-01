
"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const razorpayTK = process.env.RAZOR_TEST;

// Currency mapping constants
const CURRENCY_MAPPING = {
  'EU': 'EUR', // Europe: Euro
  'IN': 'INR', // India: Rupee
  'US': 'USD', // United States: Dollar
  'GB': 'GBP', // United Kingdom: Pound
  'DEFAULT': 'USD' // Default fallback
};

// Map of countries to their currency regions
const COUNTRY_TO_REGION = {
  // Europe (Euro)
  'DE': 'EU', 'FR': 'EU', 'IT': 'EU', 'ES': 'EU', 'NL': 'EU',
  'BE': 'EU', 'AT': 'EU', 'GR': 'EU', 'PT': 'EU', 'IE': 'EU',
  'FI': 'EU', 'SK': 'EU', 'LT': 'EU', 'SI': 'EU', 'LV': 'EU',
  'EE': 'EU', 'CY': 'EU', 'MT': 'EU', 'LU': 'EU',
  
  // India
  'IN': 'IN',
  
  // United States
  'US': 'US',
  
  // United Kingdom
  'GB': 'GB',
  
  // Add more country mappings as needed
};

// Define base price and conversion rates for each currency
// These prices represent the amount in the smallest currency unit (e.g., cents, paise)
const PRICING = {
  'USD': {
    basePrice: 1999, // $19.99 USD
    symbol: '$'
  },
  'EUR': {
    basePrice: 1999, // €19.99 EUR
    symbol: '€'
  },
  'INR': {
    basePrice: 39900, // ₹399 INR
    symbol: '₹'
  },
  'GBP': {
    basePrice: 1999, // £19.99 GBP
    symbol: '£'
  }
};

export default function PricingList() {
  const router = useRouter(); // Initialize router
  const [activeIndex, setActiveIndex] = useState(1);
  const [userEmail, setUserEmail] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currencyCode, setCurrencyCode] = useState(CURRENCY_MAPPING.DEFAULT);
  const [formattedPrice, setFormattedPrice] = useState('');
  
  const handleOnClick = (index) => {
    setActiveIndex(index);
  };

  // Format price for display based on currency
  const formatPriceForDisplay = (price, currencyCode) => {
    switch(currencyCode) {
      case 'USD':
      case 'EUR':
      case 'GBP':
        // Convert cents to dollars/euros/pounds with 2 decimal places
        return (price / 100).toFixed(2);
      case 'INR':
        // Convert paise to rupees with no decimal places
        return (price / 100).toLocaleString('en-IN');
      default:
        return (price / 100).toString();
    }
  };

  // Detect user's location and set currency
  const detectUserCurrency = async () => {
    try {
      // Get user's country code using IP geolocation
      const locationResponse = await fetch('https://ipapi.co/json/');
      const locationData = await locationResponse.json();
      const countryCode = locationData.country_code;
      
      // Determine currency based on country code
      if (countryCode) {
        const region = COUNTRY_TO_REGION[countryCode] || 'DEFAULT';
        const detectedCurrency = CURRENCY_MAPPING[region] || CURRENCY_MAPPING.DEFAULT;
        setCurrencyCode(detectedCurrency);
        
        // Format price based on detected currency
        const price = PRICING[detectedCurrency].basePrice;
        const formatted = formatPriceForDisplay(price, detectedCurrency);
        setFormattedPrice(formatted);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      // Continue with default currency
      setCurrencyCode(CURRENCY_MAPPING.DEFAULT);
      setFormattedPrice(formatPriceForDisplay(PRICING[CURRENCY_MAPPING.DEFAULT].basePrice, CURRENCY_MAPPING.DEFAULT));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const decodedEmail = tokenData.email;
      setUserEmail(decodedEmail);
      
      // Check subscription only once on component mount, not every 30 days
      checkSubscription(decodedEmail);
      
      // Detect user's currency based on location
      detectUserCurrency();
    } catch (err) {
      console.error('Error decoding token:', err);
      router.push('/');
    }
  }, [router]);

  const checkSubscription = async (email) => {
    if (!email) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('subscription, subscription_expiry')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, user might not exist
          console.log('User not found in database');
          setSubscription(null);
        } else {
          console.error('Error checking subscription:', error);
          toast.error('Failed to load subscription information');
        }
      } else if (data) {
        if (data.subscription === 'premium' && data.subscription_expiry) {
          const expiryDate = new Date(data.subscription_expiry);
          if (expiryDate < new Date()) {
            await updateExpiredSubscription(email);
            setSubscription(null);
            toast.info('Your premium subscription has expired!');
          } else {
            setSubscription(data.subscription);
          }
        } else {
          setSubscription(data.subscription);
        }
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
      toast.error('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const updateExpiredSubscription = async (email) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          subscription: null,
          subscription_expiry: null 
        })
        .eq('email', email);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating expired subscription:', err);
    }
  };

  const getFreeButtonContent = () => {
    if (isLoading) {
      return <button className="upgrade-plan" disabled><span>Loading...</span></button>;
    }
    if (subscription === 'premium') {
      return <button className="upgrade-plan" disabled><span>Plan Upgraded</span></button>;
    }
    return(
      <>
       <button className="plan-button" disabled><span>Current Plan</span></button>
        <style jsx>{`
            .plan-button{  
              padding: 0.5rem 1rem;
              background: #F8FAFC !important;
              border-radius: 40px;
              border-style: dotted;
              cursor: pointer;
              color: white;
              font-weight: 500;
              font-size: 0.84rem;
              border-radius: 40px;
              background: #15173D !important;
              border: 8px solid #F8FAFC !important;
              box-shadow: 0 8px 4px rgba(187, 205, 255, 0.44);
            }
          `}
        </style>
      </>
    )
  };

  const getPremiumButtonContent = () => {
    if (isLoading) {
      return <button className="upgrade-plan" disabled><span>Loading...</span></button>;
    }
    if (subscription === 'premium') {
    return (
      <>
       <button className="plan-button" disabled><span>Current Plan</span></button>
        <style jsx>{`
            .plan-button{  
              padding: 0.5rem 1rem;
              background: #F8FAFC !important;
              border-radius: 40px;
              border-style: dotted;
              cursor: pointer;
              color: white;
              font-weight: 500;
              font-size: 0.84rem;
              border-radius: 40px;
              background: #15173D !important;
              border: 8px solid #F8FAFC !important;
              box-shadow: 0 8px 4px rgba(187, 205, 255, 0.44);
            }
          `}
        </style>
      </>
    )
    }
    return (
    <>
      <button 
        onClick={handlePayment}
        className='upgrade-plan'
      >
        <span>Upgrade Plan</span>
      </button>
      <style jsx>{`
            .upgrade-plan{  
              padding: 0.5rem 1rem;
              background: #F8FAFC !important;
              border-radius: 40px;
              border-style: dotted;
              cursor: pointer;
              color: #15173D;
              font-weight: 500;
              font-size: 0.84rem;
              border-radius: 40px;
              background: white !important;
              border: 4px solid #F8FAFC !important;
              box-shadow: 0 8px 4px rgba(187, 205, 255, 0.44);
            }
          `}
      </style>
    </>
    );
  };

  const updateSubscriptionStatus = async (email) => {
    try {
      // For production, use 30 days:
      const expiryDate = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));

      const { data, error } = await supabase
        .from('users')
        .update({ 
          subscription: 'premium',
          subscription_expiry: expiryDate.toISOString()
        })
        .eq('email', email);

      if (error) {
        console.error('Error updating subscription:', error);
        throw error;
      }

      console.log('Subscription updated successfully');
      return true;
    } catch (err) {
      console.error('Error in updateSubscriptionStatus:', err);
      throw err;
    }
  };

  const handlePayment = () => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      initializeRazorpay();
      return;
    }

    // Load Razorpay script if not already loaded
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = initializeRazorpay;
    script.onerror = () => {
      toast.error('Failed to load payment gateway. Please try again later.');
    };
    document.body.appendChild(script);
  };

  const initializeRazorpay = () => {
    try {
      // Get price in appropriate currency
      const price = PRICING[currencyCode].basePrice;
      const symbol = PRICING[currencyCode].symbol;
      
      const options = {
        key: razorpayTK, // Should come from environment variable
        amount: price.toString(),
        currency: currencyCode,
        name: "Exam Paper - Job Screening",
        description: `Premium Subscription (${symbol}${formattedPrice})`,
        handler: async function(response) {
          if (response.razorpay_payment_id) {
            try {
              setIsLoading(true);
              await updateSubscriptionStatus(userEmail);
              setSubscription('premium');
              toast.success(`Payment of ${symbol}${formattedPrice} successful! Your premium subscription is now active.`);
            } catch (err) {
              toast.error('Upgrade failed! Please contact support.');
            } finally {
              setIsLoading(false);
            }
          }
        },
        prefill: {
          name: userEmail || "",
          email: userEmail || "",
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      toast.error('Failed to initialize payment. Please try again.');
    }
  };
  
  // Function to display the price with symbol
  const displayPrice = () => {
    const symbol = PRICING[currencyCode].symbol;
    return `${symbol}${formattedPrice}`;
  };

  return (
    <>
      {/* toggle pricing */}
      <div className="pricing__toggle">
        <div className="toggle_in">
          <a onClick={() => handleOnClick(1)}  className={activeIndex === 1 ? "active" : ""}>Monthly Subscription</a>
          {/* <a onClick={() => handleOnClick(2)} className={activeIndex === 2 ? " active" : ""}>Yearly </a> */}
          <span className="bg" style={activeIndex===1 ? {"left":"10px","width":"140.875px"} : {"left":"128.875px","width":"134.594px"}} />
        </div>
      </div>
      {/* !toggle pricing */}
      {/* pricing tabs */}
      <div className="pricing__tabs">
        <div className={activeIndex === 1 ? "pricing__tab active" : "pricing__tab"} id="tab1">
          {/* Mobile Pricing Table (shortcode) */}
          <div className="fn__mobile_pricing">
            {/* First Plan */}
            <div className="pricing__item">
              <div className="pricing__item_holder">
                <div className="pricing__item__header">
                  <h2 className="title">Free</h2>
                  <h3 className="price"><span>₹0</span> / month</h3>
                   <p className="desc">Limited Seat Capacity<br /><span>and</span> Other Free Features</p>
                  <p className="purchase">
                    {getFreeButtonContent()}
                  </p>
                </div>
                <div className="pricing__item__heading">
                  <h2 className="title">Job Search Engine</h2>
                </div>
                <div className="pricing__item_list">
                  <div className="pricing__item_list_item">
                    <h4 className="title">Email Invitation</h4>
                    <p className="desc">5 Emails</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Applicant Volume</h4>
                    <p className="desc">5/Job</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Job Post capacity</h4>
                    <p className="desc">3/Business</p>
                  </div>
                </div>
                {/* <div className="pricing__item__heading">
                  <h2 className="title">Other Free Features</h2>
                </div>
                <div className="pricing__item_list">
                  <div className="pricing__item_list_item">
                    <h4 className="title">AI Test Engine</h4>
                    <p className="desc">-</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">S24 Courses + AI</h4>
                    <p className="desc">-</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Candidate Search Engine</h4>
                    <p className="desc">+</p>
                  </div>
                </div> */}
                <div className="pricing__item_footer">
                  {getFreeButtonContent()}
                </div>
              </div>
            </div>
            {/* !First Plan */}
            {/* Second Plan */}
            <div className="pricing__item">
              <div className="pricing__item_holder">
                <div className="popular"><span>Most Popular</span></div>
                <div className="pricing__item__header">
                  <h2 className="title">Premium</h2>
                  <h3 className="price"><span>{displayPrice()}</span> / month</h3>
                  <p className="desc">Extended Seat Capacity<br /><span>and</span> Free Features</p>
                  <p className="purchase">
                    {/* <Link href="#" className="upgrade-plan"><span>Buy Premium</span></Link> */}
                    {getPremiumButtonContent()}
                  </p>
                </div>
                <div className="pricing__item__heading">
                  <h2 className="title">Job Search Engine</h2>
                </div>
                <div className="pricing__item_list">
                  <div className="pricing__item_list_item">
                    <h4 className="title">Email Invitation</h4>
                    <p className="desc">20 Emails</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Applicant Volume</h4>
                    <p className="desc">20/Job</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Job Post Volume</h4>
                    <p className="desc">10/Business</p>
                  </div>
                  
                </div>
                {/* <div className="pricing__item__heading">
                  <h2 className="title">Other Free Features</h2>
                </div>
                <div className="pricing__item_list">
                  <div className="pricing__item_list_item">
                    <h4 className="title">AI Test Engine</h4>
                    <p className="desc">-</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">S24 Courses + AI</h4>
                    <p className="desc">-</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Candidate Search Engine</h4>
                    <p className="desc">+</p>
                  </div>
                </div> */}
                <div className="pricing__item_footer">
                  {getPremiumButtonContent()}
                </div>
              </div>
            </div>
            {/* !Second Plan */}
            {/* Third Plan */}
            <div className="pricing__item">
              <div className="pricing__item_holder">
                <div className="pricing__item__header">
                  <h2 className="title">Enterprise</h2>
                  <h3 className="price"><span>Contact us</span></h3>
                  <p className="desc">Get iny<br /><span>Touch</span> with us</p>
                  <p className="purchase">
                    <Link href="/contact" className="upgrade-plan"><span>Contact us</span></Link>
                  </p>
                </div>
                <div className="pricing__item__heading">
                  <h2 className="title">Job Search Engine</h2>
                </div>
                <div className="pricing__item_list">
                  <div className="pricing__item_list_item">
                    <h4 className="title">Email Invitation</h4>
                    <p className="desc">Contact us</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Applicant Volume</h4>
                    <p className="desc">Contact us</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Job Post Volume</h4>
                    <p className="desc">Contact us</p>
                  </div>
                </div>
                {/* <div className="pricing__item__heading">
                  <h2 className="title">Other Free Features</h2>
                </div>
                <div className="pricing__item_list">
                  <div className="pricing__item_list_item">
                    <h4 className="title">AI Test</h4>
                    <p className="desc">-</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">S24 Courses + AI</h4>
                    <p className="desc">+</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Candidate Search Engine</h4>
                    <p className="desc">+</p>
                  </div>
                </div> */}
                <div className="pricing__item_footer">
                  <Link href="#" className="upgrade-plan"><span>Contact us</span></Link>
                </div>
              </div>
            </div>
            {/* !First Plan */}
          </div>
          {/* /Mobile Pricing Table (shortcode) */}
          <div className="pricing__content">
            {/* table's header */}
            <div className="pricing__header">
              <div className="item_row">
                <div className="item_col" />
                <div className="item_col">
                  <h2 className="title hs-title-6">Free</h2>
                  <h3 className="price"><span>₹0</span> / month</h3>
                   <p className="desc">Limited Seat Capacity<br /><span>and</span> Other Free Features</p>
                  <p className="purchase">
                    {getFreeButtonContent()}
                  </p>
                </div>
                <div className="item_col">
                  <div className="popular"><span>Most Popular</span></div>
                  <h2 className="title">Premium</h2>
                  <h3 className="price"><span>{displayPrice()}</span> / month</h3>
                  <p className="desc">Extended Seat Capacity<br /><span>and</span> Free Features</p>
                  <p className="purchase">
                    {/* <Link href="#" className="upgrade-plan"><span>Buy Premium</span></Link> */}
                    {getPremiumButtonContent()}
                  </p>
                </div>
                <div className="item_col">
                  <h2 className="title">Enterprise</h2>
                  <h3 className="price"><span>Contact us</span></h3>
                  <p className="desc">Get in<br /><span>Touch</span> with us!</p>
                  <p className="purchase">
                    <Link href="/contact" className="upgrade-plan"><span>Contact us</span></Link>
                  </p>
                </div>
              </div>
            </div>
            {/* !table's header */}
            {/* table's heading */}
            <div className="pricing__heading">
              <div className="item"><span className="title">Job Search Engine</span></div>
              <div className="item wide" />
            </div>
            {/* !table's heading */}
            {/* table's options */}
            <div className="pricing__fields">
              <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">Email Invitation</span>
                </div>
                <div className="item_col">
                  <span className="option_text">5 Emails</span>
                </div>
                <div className="item_col">
                  <span className="option_text">20 Emails</span>
                </div>
                <div className="item_col">
                  <span className="option_text">Contact us</span>
                </div>
              </div>
              
              <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">Applicant Volume</span>
                </div>
                <div className="item_col">
                  <span className="option_text">5/Job</span>
                </div>
                <div className="item_col">
                  <span className="option_text">20/Job</span>
                </div>
                <div className="item_col">
                  <span className="option_text">Contact us</span>
                </div>
              </div>

              
              <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">Job Post Volume</span>
                </div>
                <div className="item_col">
                  <span className="option_text">3/Business</span>
                </div>
                <div className="item_col">
                  <span className="option_text">10/Business</span>
                </div>
                <div className="item_col">
                  <span className="option_text">Contact us</span>
                </div>
              </div>
              
            </div>
            {/* !table's options */}
            {/* table's heading */}
            {/* <div className="pricing__heading">
              <div className="item"><span className="title">Other Free Features</span></div>
              <div className="item wide" />
            </div>

            <div className="pricing__fields">
              <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">AI Test Engine</span>
                </div>
                <div className="item_col">
                  <span className="option_text">-</span>
                </div>
                <div className="item_col">
                  <span className="option_text">-</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
              </div>
              <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">S24 Courses + AI</span>
                </div>
                <div className="item_col">
                  <span className="option_text">-</span>
                </div>
                <div className="item_col">
                  <span className="option_text">-</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
              </div>
              <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">Candidate Search Engine</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
              </div>
            </div> */}
            {/* !table's options */}
            {/* table's footer */}
            <div className="pricing__footer">
              <div className="item_row">
                <div className="item_col" />
                <div className="item_col">
                  {getFreeButtonContent()}
                </div>
                <div className="item_col">
                {getPremiumButtonContent()}
                </div>
                <div className="item_col">
                  <Link href="#" className="upgrade-plan"><span>Contact us</span></Link>
                </div>
              </div>
            </div>
            {/* !table's footer */}
          </div>
        </div>
        <div className={activeIndex === 2 ? "pricing__tab active" : "pricing__tab"} id="tab2">
          {/* Mobile Pricing Table (shortcode) */}
          <div className="fn__mobile_pricing">
            {/* First Plan */}
            <div className="pricing__item">
              <div className="pricing__item_holder">
                <div className="pricing__item__header">
                  <h2 className="title">Free</h2>
                  <h3 className="price"><span>₹0</span> / month</h3>
                   <p className="desc">Limited Seat Capacity<br /><span>and</span> Other Free Features</p>
                  <p className="purchase">
                    {getFreeButtonContent()}
                  </p>
                </div>
                <div className="pricing__item__heading">
                  <h2 className="title">Job Search Engine</h2>
                </div>
                <div className="pricing__item_list">
                  <div className="pricing__item_list_item">
                    <h4 className="title">Email Invitation</h4>
                    <p className="desc">Free Catalogs</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Applicant Volume</h4>
                    <p className="desc">5</p>
                  </div>
                </div>
                {/* <div className="pricing__item__heading">
                  <h2 className="title">Other Free Features</h2>
                </div>
                <div className="pricing__item_list">
                  <div className="pricing__item_list_item">
                    <h4 className="title">AI Test Engine</h4>
                    <p className="desc">-</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">S24 Courses + AI</h4>
                    <p className="desc">-</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Candidate Search Engine</h4>
                    <p className="desc">+</p>
                  </div>
                </div> */}
                <div className="pricing__item_footer">
                  {getFreeButtonContent()}
                </div>
              </div>
            </div>
            {/* !First Plan */}
            {/* Second Plan */}
            <div className="pricing__item">
              <div className="pricing__item_holder">
                <div className="popular"><span>Most Popular</span></div>
                <div className="pricing__item__header">
                  <h2 className="title">Premium</h2>
                  <h3 className="price"><span>₹49.99</span> / month</h3>
                  <p className="desc">billed yearly<br /><span>₹49.99</span> billed monthly</p>
                  <p className="purchase">
                  {getPremiumButtonContent()}
                  </p>
                </div>
                <div className="pricing__item__heading">
                  <h2 className="title">Job Search Engine</h2>
                </div>
                <div className="pricing__item_list">
                  <div className="pricing__item_list_item">
                    <h4 className="title">Email Invitation</h4>
                    <p className="desc">Premium Catalogs</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Applicant Volume</h4>
                    <p className="desc">50</p>
                  </div>
                </div>
                {/* <div className="pricing__item__heading">
                  <h2 className="title">Other Free Features</h2>
                </div>
                <div className="pricing__item_list">
                  <div className="pricing__item_list_item">
                    <h4 className="title">AI Test Engine</h4>
                    <p className="desc">-</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">S24 Courses + AI</h4>
                    <p className="desc">-</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Candidate Search Engine</h4>
                    <p className="desc">+</p>
                  </div>
                </div> */}
                <div className="pricing__item_footer">
                {getPremiumButtonContent()}
                </div>
              </div>
            </div>
            {/* !Second Plan */}
            {/* Third Plan */}
            <div className="pricing__item">
              <div className="pricing__item_holder">
                <div className="pricing__item__header">
                  <h2 className="title">Enerprice</h2>
                  <h3 className="price"><span>Contact us</span></h3>
                  <p className="desc">Get in<br /><span>Touch</span> with us</p>
                  <p className="purchase">
                    <Link href="/contact" className="upgrade-plan"><span>Contact us</span></Link>
                  </p>
                </div>
                <div className="pricing__item__heading">
                  <h2 className="title">Job Search Engine</h2>
                </div>
                <div className="pricing__item_list">
                  <div className="pricing__item_list_item">
                    <h4 className="title">Email Invitation</h4>
                    <p className="desc">Contact us</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Applicant Volume</h4>
                    <p className="desc">5</p>
                  </div>
                  {/* <div className="pricing__item_list_item">
                    <h4 className="title">Upscales per month</h4>
                    <p className="desc">7,500</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Background removals</h4>
                    <p className="desc">15,000</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Pending jobs</h4>
                    <p className="desc">+</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Private generations</h4>
                    <p className="desc">+</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Priority infrastructure</h4>
                    <p className="desc">+</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Relaxed generation</h4>
                    <p className="desc">+</p>
                  </div> */}
                </div>
                {/* <div className="pricing__item__heading">
                  <h2 className="title">Other Free Features</h2>
                </div>
                <div className="pricing__item_list">
                  <div className="pricing__item_list_item">
                    <h4 className="title">AI Test Engine</h4>
                    <p className="desc">-</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">S24 Courses + AI</h4>
                    <p className="desc">+</p>
                  </div>
                  <div className="pricing__item_list_item">
                    <h4 className="title">Candidate Search Engine</h4>
                    <p className="desc">+</p>
                  </div>
                </div> */}
                <div className="pricing__item_footer">
                  <Link href="#" className="upgrade-plan"><span>Contact us</span></Link>
                </div>
              </div>
            </div>
            {/* !First Plan */}
          </div>
          {/* /Mobile Pricing Table (shortcode) */}
          <div className="pricing__content">
            {/* table's header */}
            <div className="pricing__header">
              <div className="item_row">
                <div className="item_col" />
                <div className="item_col">
                  <h2 className="title">Free</h2>
                  <h3 className="price"><span>₹0</span> / month</h3>
                   <p className="desc">Limited Seat Capacity<br /><span>and</span> Other Free Features</p>
                  <p className="purchase">
                    {getFreeButtonContent()}
                  </p>
                </div>
                <div className="item_col">
                  <div className="popular"><span>Most Popular</span></div>
                  <h2 className="title">Premium</h2>
                  <h3 className="price"><span>₹49.99</span> / month</h3>
                  <p className="desc">billed yearly<br /><span>₹49.00</span> billed monthly</p>
                  <p className="purchase">
                  {getPremiumButtonContent()}
                  </p>
                </div>
                <div className="item_col">
                  <h2 className="title">Enterprice</h2>
                  <h3 className="price"><span>Contact us</span></h3>
                  <p className="desc">Get in<br /><span>Touch</span> with us</p>
                  <p className="purchase">
                    <Link href="/contact" className="upgrade-plan"><span>Contact us</span></Link>
                  </p>
                </div>
              </div>
            </div>
            {/* !table's header */}
            {/* table's heading */}
            <div className="pricing__heading">
              <div className="item"><span className="title">Job Search Engine</span></div>
              <div className="item wide" />
            </div>
            {/* !table's heading */}
            {/* table's options */}
            <div className="pricing__fields">
              <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">Email Invitation</span>
                </div>
                <div className="item_col">
                  <span className="option_text">Free Catalogs</span>
                </div>
                <div className="item_col">
                  <span className="option_text">Premium Catalogs</span>
                </div>
                <div className="item_col">
                  <span className="option_text">Contact us</span>
                </div>
              </div>
              <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">Applicant Volume</span>
                </div>
                <div className="item_col">
                  <span className="option_text">5</span>
                </div>
                <div className="item_col">
                  <span className="option_text">50</span>
                </div>
                <div className="item_col">
                  <span className="option_text">Contact us</span>
                </div>
              </div>
              {/* <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">Upscales per month</span>
                </div>
                <div className="item_col">
                  <span className="option_text">1,500</span>
                </div>
                <div className="item_col">
                  <span className="option_text">3,500</span>
                </div>
                <div className="item_col">
                  <span className="option_text">7,500</span>
                </div>
              </div>
              <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">Background removals</span>
                </div>
                <div className="item_col">
                  <span className="option_text">4,000</span>
                </div>
                <div className="item_col">
                  <span className="option_text">8,000</span>
                </div>
                <div className="item_col">
                  <span className="option_text">15,000</span>
                </div>
              </div>
              <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">Pending jobs</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
              </div>
              <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">Private generations</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
              </div>
              <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">Priority infrastructure</span>
                </div>
                <div className="item_col">
                  <span className="option_text">—</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
              </div>
              <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">Relaxed generation</span>
                </div>
                <div className="item_col">
                  <span className="option_text">—</span>
                </div>
                <div className="item_col">
                  <span className="option_text">—</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
              </div> */}
            </div>
            {/* !table's options */}
            {/* table's heading */}
            <div className="pricing__heading">
              <div className="item"><span className="title">Other Free Features</span></div>
              <div className="item wide" />
            </div>

            <div className="pricing__fields">
              <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">AI test Engine</span>
                </div>
                <div className="item_col">
                  <span className="option_text">-</span>
                </div>
                <div className="item_col">
                  <span className="option_text">-</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
              </div>

              <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">S24 Courses + AI</span>
                </div>
                <div className="item_col">
                  <span className="option_text">—</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
              </div>
              <div className="item_row">
                <div className="item_col">
                  <span className="heading_text">Candidate Search Engine</span>
                </div>
                <div className="item_col">
                  <span className="option_text">—</span>
                </div>
                <div className="item_col">
                  <span className="option_text">—</span>
                </div>
                <div className="item_col">
                  <span className="option_text">+</span>
                </div>
              </div>
            </div>
            {/* !table's options */}
            {/* table's footer */}
            <div className="pricing__footer">
              <div className="item_row">
                <div className="item_col" />
                <div className="item_col">
                  {getFreeButtonContent()}
                </div>
                <div className="item_col">
                {getPremiumButtonContent()}
                </div>
                <div className="item_col">
                  <Link href="#" className="upgrade-plan"><span><span>Upgrade Plan</span></span></Link>
                </div>
              </div>
            </div>
            {/* !table's footer */}
          </div>
        </div>
      </div>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Lustria&family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&display=swap');
        `}
      </style>
      {/* !pricing tabs */}
    </>
  )
}