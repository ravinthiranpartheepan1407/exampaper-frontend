"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { AudioLines, Box, Info, Layers2, LockKeyhole, Plug, Rocket, Route, ScanEye, Search, ShoppingBasket, SquareActivity, Target, Trophy, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function DataHub() {

    const router = useRouter()

    // For filter
    const products = [
        { id: 1, category: 1, img: "https://res.cloudinary.com/dvcw9bqrx/image/upload/v1737555566/1_qd3bqf.png", purchase: "https://www.udemy.com/course/automating-ml-pipelines-for-song-recommendation-system/", title: 'Automating ML Pipelines for Song Recommendation System', hasBookmark: false, desc: "Basic Knowledge of Python programming, as it will be used for implementing machine learning algorithms and building ML pipeline microservices.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['MLOps', 'Machine Learning', 'Airflow', 'MLFlow'] },
        { id: 2, category: 1, img: "https://zdmueezfheensjrefapy.supabase.co/storage/v1/object/sign/rust-timers/Course-2.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJydXN0LXRpbWVycy9Db3Vyc2UtMi5wbmciLCJpYXQiOjE3Mzg4NTgxNzAsImV4cCI6MzMxNTY1ODE3MH0.TB_OV37Zx4ZTqF1ZJyeVS64zGi7CAzGzf00QrWHVbtA", purchase: "https://www.udemy.com/course/build-an-open-source-time-series-lib-from-scratch-in-rust/?couponCode=E313F297FD9D3E997787", title: 'Automating ML Pipelines for Song Recommendation System', hasBookmark: false, desc: "Basic Knowledge of Python programming, as it will be used for implementing machine learning algorithms and building ML pipeline microservices.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Rust', 'Machine Learning', 'Airflow', 'MLFlow'] },
        { id: 11, category: 2, img: "https://zdmueezfheensjrefapy.supabase.co/storage/v1/object/sign/rust-timers/Transformer.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJydXN0LXRpbWVycy9UcmFuc2Zvcm1lci5wbmciLCJpYXQiOjE3Mzc3MTI2MTksImV4cCI6MTc0MjAzMjYxOX0.Od9fEYklvlIubcrLMnN9Xb7A7sxGvDjtXzEO_gDoQ3M&t=2025-01-24T09%3A56%3A55.252Z", title: 'GameVisuals1', hasBookmark: false, desc: "A versatile model great at both photorealism and anime, includes noise offset training... by Lykon.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Buildings', 'Environments', 'Illustration', 'Textures', ''] },
        { id: 21, category: 3, purchase: "/speech-analysis", img: "https://zdmueezfheensjrefapy.supabase.co/storage/v1/object/sign/rust-timers/EvalSER.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJydXN0LXRpbWVycy9FdmFsU0VSLnBuZyIsImlhdCI6MTczODQyOTM1OSwiZXhwIjozMzE1MjI5MzU5fQ.5mu4AT0zzJzXjXvdxGoGm_GAjyBC7PfpOhfSBl_u-d4", title: 'Multilingual Speech Emotion Analysis', hasBookmark: false, desc: "EvalSER: A Perception AI model for detecting emotional patterns in voice data across multiple Indian languages for customer care call scoring and QA, emotion-based call routing, and post-call analysis. EvalSER AI supports not only English but also all 22 official Indian languages.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Buildings', 'Environments', 'Illustration', 'Textures', ''] },
        { id: 31, category: 4, purchase: "/marketplace/vertez", img: "https://zdmueezfheensjrefapy.supabase.co/storage/v1/object/sign/rust-timers/poster.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJydXN0LXRpbWVycy9wb3N0ZXIucG5nIiwiaWF0IjoxNzM5MTkzMTc2LCJleHAiOjMzMTU5OTMxNzZ9.VmTwTh3EOqdyxsOsMgeq62sp40KgRCpuC2LXVV6JqNg", title: 'Multilingual Speech Emotion Analysis', hasBookmark: false, desc: "EvalSER: A Perception AI model for detecting emotional patterns in voice data across multiple Indian languages for customer care call scoring and QA, emotion-based call routing, and post-call analysis. EvalSER AI supports not only English but also all 22 official Indian languages.", author_pic: "img/user/user.jpg", author_name: "Caden", tags: ['Buildings', 'Environments', 'Illustration', 'Textures', ''] },
        // Add more products with tags here
    ]

    // Initialize your component state
    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedTag, setSelectedTag] = useState('');
    const [bookmarkStates, setBookmarkStates] = useState(products.map(() => false));

    const handleOnClick = (index) => {
        setActiveIndex(index);
        setSelectedTag('');
    };

    const filteredProductsByCategory = activeIndex
        ? products.filter((product) => product.category === activeIndex)
        : null;


    const filteredProducts = selectedTag
        ? filteredProductsByCategory.filter((product) =>
            product.tags.includes(selectedTag)
        )
        : filteredProductsByCategory;

    const handleTagChange = (event) => {
        setSelectedTag(event.target.value);
    };

    const hasBookmarkSwitch = (productId) => {
        // Find the index of the product with the given productId
        const productIndex = filteredProducts.findIndex((product) => product.id === productId);

        if (productIndex !== -1) {
            // Toggle the bookmark state for the specific product
            const updatedBookmarkStates = [...bookmarkStates];
            updatedBookmarkStates[productIndex] = !bookmarkStates[productIndex];

            // Update the bookmark states
            setBookmarkStates(updatedBookmarkStates);
        }
    };




    return (
        <>
            <div className="techwave_fn_models_page">
                <div className="fn__title_holder">
                    <div className="container">
                    <div className="hero-section">
                        <div className="hero-content">
                            <h1 style={{color: 'white'}} className='hs-title-8'>Explore SP24&apos;s Marketplace</h1>
                            <p style={{color: '#E6EFF2'}} className='hs-title'>Get started with our Courses, Games, Books and Multimedia Templates in one place!</p>
                        </div>
                    </div>
                    </div>
                </div>
                {/* Models */}
                <div className="techwave_fn_models">
                    <div className="fn__tabs">
                        <div className="container">
                            <div className="tab_in">
                                <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}><Trophy style={{marginTop: -5}} /> Courses</a>
                                {/* <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}><Zap style={{marginTop: -5}} /> Builder Session</a> */}
                                <a className={activeIndex === 4 ? "active" : ""} onClick={() => handleOnClick(4)}><ShoppingBasket style={{marginTop: -5}} /> Books</a>
                                <a className={activeIndex === 5 ? "active" : ""}><LockKeyhole style={{marginTop: -5}} /> Games For Kids</a>
                                <a className={activeIndex === 3 ? "active" : ""} onClick={() => handleOnClick(3)}><Box style={{marginTop: -5}} /> Explore AI Models</a>

                            </div>
                        </div>
                    </div>
                    {/* models filter */}
                    <div className="container">
                        <div className="models__filter">
                            <div className="filter__left">
                                <div className="filter__search">
                                    <input type="text" placeholder="Search Asset" />
                                    <Link href="#" style={{backgroundColor: '#E6EFF2', padding: 9, textAlign: 'center', borderRadius: 40, width: 150}} className=""><span><Search size={16} style={{marginTop: -3}} /> Search</span></Link>
                                </div>
                            </div>
                            <div className="filter__right">
                                <div className="filter__category">
                                    <select onChange={handleTagChange}>
                                        <option value="" >All Categories</option>
                                        <option value="">Machine Learning</option>
                                        {/* <option value="Characters">Characters</option>
                                        <option value="Environments">Environments</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Illustration">Illustration</option>
                                        <option value="Graphical">Graphical</option>
                                        <option value="Photography">Photography</option>
                                        <option value="Textures">Textures</option> */}
                                        {/* Add more tag options here */}
                                    </select>
                                </div>
                                <div className="filter__order">
                                    <div className="fn__icon_options medium_size align_right">
                                        <span className="fn__icon_button">
                                            <img src="svg/filter.svg" alt="" className="fn__svg" />
                                        </span>
                                        <div className="fn__icon_popup">
                                            <ul>
                                                <li>
                                                    <Link href="#">Newest</Link>
                                                </li>
                                                <li>
                                                    <Link href="#">Oldest</Link>
                                                </li>
                                                <li>
                                                    <Link href="#">A-Z</Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* !models filter */}
                    <div className="container">
                        {/* models content */}
                        <div className="models__content">
                            <div className="models__results">
                                <div className="fn__preloader">
                                    <div className="icon" />
                                    <div className="text">Loading</div>
                                </div>
                                <div className="fn__tabs_content">
                                    <div id="tab1" className={activeIndex === 1 ? "tab__item active" : "tab__item"}>
                                        <ul className="fn__model_items">
                                            {/*  model item goes here */}{
                                                filteredProducts.map((product, index) => (
                                                    <li key={product.id} className="fn__model_item">
                                                        <div className="item cardz">
                                                            <a onClick={() => hasBookmarkSwitch(product.id)}
                                                                className={bookmarkStates[index] ? "fn__bookmark has__bookmark" : "fn__bookmark"}>
                                                                <img src="svg/bookmark.svg" alt="" className="fn__svg hasntbook" />
                                                                <img src="svg/bookmarked.svg" alt="" className="fn__svg hasbook" />
                                                            </a>
                                                            <div className="img">
                                                                <img src={product.img} alt="" />
                                                            </div>
                                                            {/* <div style={{backgroundColor: 'white'}} className="item__info">
                                                                <h3 className="hs-title-6"><Target size={18} style={{marginTop: -4}} /> {product.title}</h3>
                                                                <p className="desc"><Info size={16} style={{marginTop: -4}} /> {product.desc}</p>
                                                            </div> */}
                                                            <button style={{width: '100%', borderBottomLeftRadius: 10 , borderBottomRightRadius: 10, backgroundColor: '#E6EFF2', marginTop: 0, padding: 15}} onClick={() => router.push(product.purchase)}>
                                                                <span>                                                                    
                                                                    <h3 className="author_name"> <Zap color='black' size={18} />&nbsp;Purchase this Course</h3>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                    <div id="tab2" className={activeIndex === 2 ? "tab__item active" : "tab__item"}>
                                        <ul className="fn__model_items">
                                            {/*  model item goes here */}{
                                                filteredProducts.map((product, index) => (
                                                    <li key={product.id} className="fn__model_item">
                                                        <div className="item cardz">
                                                            <a onClick={() => hasBookmarkSwitch(product.id)}
                                                                className={bookmarkStates[index] ? "fn__bookmark has__bookmark" : "fn__bookmark"}>
                                                                <img src="svg/bookmark.svg" alt="" className="fn__svg hasntbook" />
                                                                <img src="svg/bookmarked.svg" alt="" className="fn__svg hasbook" />
                                                            </a>
                                                            <div className="img">
                                                                <img src={product.img} alt="" />
                                                            </div>
                                                            {/* <div className="item__info">
                                                                <h3 className="title">{product.title}</h3>
                                                                <p className="desc">{product.desc}</p>
                                                            </div>
                                                            <div className="item__author">
                                                                <img src={product.author_pic} alt="" />
                                                                <h3 className="author_name">{product.author_name}</h3>
                                                            </div> */}
                                                             <button style={{width: '100%', backgroundColor: '#E6EFF2', borderBottomLeftRadius: 10 , borderBottomRightRadius: 10, marginTop: 0, padding: 15}} onClick={() => router.push("/marketplace/builder-session")}>
                                                                <span>                                                                    
                                                                    <h3 className="author_name"> <Zap color='black' size={18} />&nbsp;Get your Tickets</h3>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                    <div id="tab3" className={activeIndex === 3 ? "tab__item active" : "tab__item"}>
                                        <ul className="fn__model_items">
                                            {/*  model item goes here */}{
                                                filteredProducts.map((product, index) => (
                                                    <li key={product.id} className="fn__model_item">
                                                        <div style={{borderTopLeftRadius: 40, borderTopRightRadius: 40}} className="item cardz">
                                                            {/* <a onClick={() => hasBookmarkSwitch(product.id)}
                                                                className={bookmarkStates[index] ? "fn__bookmark has__bookmark" : "fn__bookmark"}>
                                                                <img src="svg/bookmark.svg" alt="" className="fn__svg hasntbook" />
                                                                <img src="svg/bookmarked.svg" alt="" className="fn__svg hasbook" />
                                                            </a> */}
                                                            <div className="img">
                                                                <img style={{borderTopLeftRadius: 10, borderTopRightRadius: 10}}  src={product.img} alt="" />
                                                            </div>
                                                            <div style={{backgroundColor: 'white'}} className="item__info">
                                                                <h4 style={{fontWeight: 500, fontSize: 14}} className="title"><ScanEye size={16} style={{marginTop: -4}} /> {product.title}</h4>
                                                                <p style={{fontSize: 12}} className="desc">{product.desc}</p>
                                                            </div>
                                                            {/* <div className="item__author">
                                                                <img src={product.author_pic} alt="" />
                                                                <h3 className="author_name">{product.author_name}</h3>
                                                            </div> */}
                                                            <button onClick={() => router.push(product.purchase)} style={{width: '100%', backgroundColor: 'white', borderBottomLeftRadius: 40 , borderBottomRightRadius: 40 , marginTop: 0, padding: 15}}>
                                                                <span>                                                                    
                                                                    <h3 className="author_name"> <Zap color='black' size={18} />&nbsp;Go to Dashboard</h3>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                    <div id="tab4" className={activeIndex === 4 ? "tab__item active" : "tab__item"}>
                                        <ul className="fn__model_items">
                                            {/*  model item goes here */}{
                                                filteredProducts.map((product, index) => (
                                                    <li key={product.id} className="fn__model_item">
                                                        <div className="item cardzz">
                                                            <a onClick={() => hasBookmarkSwitch(product.id)}
                                                                className={bookmarkStates[index] ? "fn__bookmark has__bookmark" : "fn__bookmark"}>
                                                                <img src="svg/bookmark.svg" alt="" className="fn__svg hasntbook" />
                                                                <img src="svg/bookmarked.svg" alt="" className="fn__svg hasbook" />
                                                            </a>
                                                            <div className="img">
                                                                <img src={product.img} alt="" />
                                                            </div>
                                                            {/* <div className="item__info">
                                                                <h3 className="title">{product.title}</h3>
                                                                <p className="desc">{product.desc}</p>
                                                            </div> */}
                                                            <button onClick={() => router.push(product.purchase)} style={{width: '100%', backgroundColor: 'white', borderBottomLeftRadius: 40 , borderBottomRightRadius: 40 , marginTop: 0, padding: 15}}>
                                                                <span>                                                                    
                                                                    <h3 className="author_name"> <Zap color='black' size={18} />&nbsp;Go to Dashboard</h3>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="models__more">
                                <Link href="#" className="medium techwave_fn_button"><span>Load More</span></Link>
                            </div> */}
                        </div>
                        {/* !models content */}
                    </div>
                </div>
                {/* !Models */}
                <style jsx>
                    {`
                        .cardz{
                            box-shadow: 0 10px 30px rgba(0, 153, 255, 0.3),
                                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                                        backdrop-filter: blur(2px);   
                            z-index: 1;
                            border-radius: 10px;
                        }
                        .cardzz{
                            box-shadow: 0 10px 30px rgb(188, 177, 188),
                                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                                        backdrop-filter: blur(2px);   
                            z-index: 1;
                            border-radius: 10px;
                        }
                        .hero-section {
                        text-align: center;
                        margin-bottom: 40px;
                        background-image: url('./texture/match.jpg');
                        background-size: cover;
                        background-position: center;
                        background-blend-mode: overlay;
                        padding: 40px;
                        border-radius: 10px;
                        position: relative;
                        }

                        .hero-section::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(106, 44, 231, 0.16); /* Darkens the background image */
                        box-shadow: 0 10px 30px rgba(116, 37, 221, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(3px);     
                        z-index: 1;
                        border-radius: 10px;
                        }

                        .hero-content {
                        position: relative;
                        z-index: 2;
                        }

                        .hero-section h1 {
                        font-size: 2.5rem;
                        margin-bottom: 20px;
                        color: 'white';
                        }
                    `}
                </style>
            </div>

        </>
    )
}
