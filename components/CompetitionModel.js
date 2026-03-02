"use client"; // Ensures that the component is rendered on the client side
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL; // Use NEXT_PUBLIC_ prefix for client-side
const supabaseKey = process.env.SUPABASE_KEY; // Use NEXT_PUBLIC_ prefix for client-side
const supabase = createClient(supabaseUrl, supabaseKey);

const CompetitionModel = () => {
    const [activeIndex, setActiveIndex] = useState(1); // Track the selected tab
    const [selectedTag, setSelectedTag] = useState(''); // Track selected tags
    const [products, setProducts] = useState([]); // Store products fetched from Supabase
    const [displayCount, setDisplayCount] = useState(5); // Number of items to display
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const [bookmarkStates, setBookmarkStates] = useState(products.map(() => false));

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

    
    const handleTagChange = (event) => {
        setSelectedTag(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('competitions')
                    .select('id, Title, URL, Description, image, Organization, Category, Reward, Deadline, Tags');

                if (error) throw error;

                console.log("Fetched data: ", data); // Log fetched data

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

    // Temporarily disable filtering to see all products
    const filteredProducts = products; // Change this line to see all products

    console.log("Filtered products: ", filteredProducts); // Log filtered results for debugging

    const handleLoadMore = () => {
        setDisplayCount(displayCount + 5); // Load 4 more items
    };

    if (loading) return <div></div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="techwave_fn_models_page">
            <div className="fn__title_holder">
                <div className="container">
                    <h1 className="title">Competitions</h1>
                </div>
            </div>
            <div className="techwave_fn_models">
                <div className="fn__tabs">
                    <div className="container">
                        <div className="tab_in">
                            <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>Machine Learning</a>
                            <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>Data Engineering</a>
                            <a className={activeIndex === 3 ? "active" : ""} onClick={() => handleOnClick(3)}>Bounties</a>
                            <a className={activeIndex === 4 ? "active" : ""} onClick={() => handleOnClick(4)}>Profiles</a>
                        </div>
                    </div>
                </div>
                {/* models filter */}
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
                                {filteredProducts.slice(0, displayCount).map((product) => (
                                    <li key={product.id} className="fn__model_item">
                                        <div className="item">
                                            <div className="img">
                                                <img src={product.image} alt={product.Title} />
                                            </div>
                                            <div className="item__info">
                                                <h3 className="title">{product.Title}</h3>
                                                {/* <p className="desc">{product.Description}</p> */}
                                                <p className="desc">Organization: {product.Organization}</p>
                                                <p className="desc">Reward: {product.Reward}</p>
                                                <p className="author_name">Deadline: {product.Deadline}</p>
                                                {/* <p><strong>Tags:</strong> {Array.isArray(product.Tags) ? product.Tags.join(', ') : product.Tags}</p>  */}
                                            </div>
                                        </div>
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

export default CompetitionModel;
