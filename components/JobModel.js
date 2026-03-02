"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const JobModel = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedTag, setSelectedTag] = useState('');
    const [products, setProducts] = useState([]);
    const [displayCount, setDisplayCount] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [bookmarkStates, setBookmarkStates] = useState(products.map(() => false));

    const hasBookmarkSwitch = (productId) => {
        const productIndex = filteredProducts.findIndex((product) => product.ids === productId);
        if (productIndex !== -1) {
            const updatedBookmarkStates = [...bookmarkStates];
            updatedBookmarkStates[productIndex] = !bookmarkStates[productIndex];
            setBookmarkStates(updatedBookmarkStates);
        }
    };
    
    const handleTagChange = (event) => {
        setSelectedTag(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('jobs')
                    .select('ids, date_posted, date_created, title, organization, organization_url, date_validthrough, employment_type, url, organization_logo, countries_derived, locations_derived, linkedin_org_url, linkedin_org_size, linkedin_org_industry, linkedin_org_headquarters, linkedin_org_description');

                if (error) throw error;
                console.log("Fetched data: ", data);
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error("Data is not an array:", data);
                }
            } catch (err) {
                console.error("Error fetching data: ", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleOnClick = (index) => {
        setActiveIndex(index);
        setSelectedTag('');
    };

    const filteredProducts = products;

    console.log("Filtered products: ", filteredProducts);

    const handleLoadMore = () => {
        setDisplayCount(displayCount + 5);
    };

    const getActiveProducts = () => {
        switch (activeIndex) {
            case 1:
                return products.filter(product =>
                    product.title.toLowerCase().includes('data scientist')
                );
            case 2:
                return products.filter(product =>
                    product.title.toLowerCase().includes('data engineer')
                );
            case 3:
                return products.filter(product =>
                    product.title.toLowerCase().includes('machine learning') || product.title.toLowerCase().includes('ml')
                );
            case 4:
                return products.filter(product =>
                    product.title.toLowerCase().includes('data analyst')
                );
            default:
                return [];
        }
    };

    if (loading) return <div></div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="techwave_fn_models_page">
            <div className="fn__title_holder">
                <div className="container">
                    <h1 className="title">Builder Learning Space 1.0</h1>
                </div>
            </div>
            <div className="techwave_fn_models">
                <div className="fn__tabs">
                    <div className="container">
                        <div className="tab_in">
                            <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>Data Scientist</a>
                            <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>Data Engineer</a>
                            <a className={activeIndex === 3 ? "active" : ""} onClick={() => handleOnClick(3)}>Machine Learning</a>
                            <a className={activeIndex === 4 ? "active" : ""} onClick={() => handleOnClick(4)}>Data Analyst</a>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="models__filter">
                        <div className="filter__left">
                            <div className="filter__search">
                                <input type="text" placeholder="Search gallery" />
                                <Link href="#" className="techwave_fn_button"><span>Search</span></Link>
                            </div>
                        </div>
                        <div className="filter__right">
                            <div className="filter__category">
                                <select onChange={handleTagChange}>
                                    <option value="" >All Categories</option>
                                    <option value="Buildings">Buildings</option>
                                    <option value="Characters">Characters</option>
                                    <option value="Environments">Environments</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Illustration">Illustration</option>
                                    <option value="Graphical">Graphical</option>
                                    <option value="Photography">Photography</option>
                                    <option value="Textures">Textures</option>
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
                <div className="container">
                    <div className="models__content">
                        <div className="models__results">
                            <div className="fn__preloader">
                                <div className="icon" />
                                <div className="text"></div>
                            </div>
                            <div className="fn__tabs_content">
                                <div id="tab1" className={activeIndex === 1 ? "tab__item active" : "tab__item"}>
                                    <ul className="fn__model_items">
                                        {getActiveProducts().map(product => (
                                            <li key={product.ids} className="fn__model_item">
                                                <Link href={`/jobs/org/${product.ids}`}>
                                                    <div className="item">
                                                        <div className="img">
                                                            <img src={`https://lnzzqqhmqqpglzhcqxjw.supabase.co/storage/v1/object/public/fruits/16.png`}  />
                                                        </div>
                                                        <div className="item__info">
                                                            <h3 className="title">{product.title}</h3>
                                                            <p className="title">
                                                                {product.organization.split(' ').length > 3
                                                                    ? product.organization.split(' ').slice(0, 3).join(' ') + '...'
                                                                    : product.organization}
                                                            </p>
                                                            <p className="desc">
                                                                {product.employment_type.replace(/[\[\]']/g, '').replace(/_/g, ' ')}
                                                            </p>
                                                            <p className="desc">
                                                                {product.locations_derived.replace(/[\[\]']/g, '').replace(/_/g, ' ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div id="tab2" className={activeIndex === 2 ? "tab__item active" : "tab__item"}>
                                    <ul className="fn__model_items">
                                        {products.filter(product =>
                                            product.title.toLowerCase().includes('data engineer')
                                        ).map(product => (
                                            <li key={product.ids} className="fn__model_item">
                                                <Link href={`/jobs/org/${product.ids}`}>
                                                    <div className="item">
                                                        <div className="img">
                                                            <img src={`https://lnzzqqhmqqpglzhcqxjw.supabase.co/storage/v1/object/public/fruits/16.png`}  />
                                                        </div>
                                                        <div className="item__info">
                                                            <h3 className="title">{product.title}</h3>
                                                            <p className="title">
                                                                {product.organization.split(' ').length > 3
                                                                    ? product.organization.split(' ').slice(0, 3).join(' ') + '...'
                                                                    : product.organization}
                                                            </p>
                                                            <p className="desc">
                                                                {product.employment_type.replace(/[\[\]']/g, '').replace(/_/g, ' ')}
                                                            </p>
                                                            <p className="desc">
                                                                {product.locations_derived.replace(/[\[\]']/g, '').replace(/_/g, ' ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div id="tab3" className={activeIndex === 3 ? "tab__item active" : "tab__item"}>
                                    <ul className="fn__model_items">
                                        {products.filter(product =>
                                             product.title.toLowerCase().includes('machine learning') || product.title.toLowerCase().includes('ml')
                                        ).map(product => (
                                            <li key={product.ids} className="fn__model_item">
                                                <Link href={`/jobs/org/${product.ids}`}>
                                                    <div className="item">
                                                        <div className="img">
                                                            <img src={`https://lnzzqqhmqqpglzhcqxjw.supabase.co/storage/v1/object/public/fruits/16.png`}  />
                                                        </div>
                                                        <div className="item__info">
                                                            <h3 className="title">{product.title}</h3>
                                                            <p className="title">
                                                                {product.organization.split(' ').length > 3
                                                                    ? product.organization.split(' ').slice(0, 3).join(' ') + '...'
                                                                    : product.organization}
                                                            </p>
                                                            <p className="desc">
                                                                {product.employment_type.replace(/[\[\]']/g, '').replace(/_/g, ' ')}
                                                            </p>
                                                            <p className="desc">
                                                                {product.locations_derived.replace(/[\[\]']/g, '').replace(/_/g, ' ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div id="tab4" className={activeIndex === 4 ? "tab__item active" : "tab__item"}>
                                    <ul className="fn__model_items">
                                        {products.filter(product =>
                                            product.title.toLowerCase().includes('data analyst')
                                        ).map(product => (
                                            <li key={product.ids} className="fn__model_item">
                                                <Link href={`/jobs/org/${product.ids}`}>
                                                    <div className="item">
                                                        <div className="img">
                                                            <img src={`https://lnzzqqhmqqpglzhcqxjw.supabase.co/storage/v1/object/public/fruits/16.png`} />
                                                        </div>
                                                        <div className="item__info">
                                                            <h3 className="title">{product.title}</h3>
                                                            <p className="title">
                                                                {product.organization.split(' ').length > 3
                                                                    ? product.organization.split(' ').slice(0, 3).join(' ') + '...'
                                                                    : product.organization}
                                                            </p>
                                                            <p className="desc">
                                                                {product.employment_type.replace(/[\[\]']/g, '').replace(/_/g, ' ')}
                                                            </p>
                                                            <p className="desc">
                                                                {product.locations_derived.replace(/[\[\]']/g, '').replace(/_/g, ' ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </div>
                        {filteredProducts.length > displayCount && (
                            <div className="models__more">
                                <button onClick={handleLoadMore} className="medium techwave_fn_button">
                                    <span>Load More</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobModel;