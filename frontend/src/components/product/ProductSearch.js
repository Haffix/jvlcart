import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import Loader from "../layouts/Loader";
import MetaData from "../layouts/MetaData";
import Product from "../product/Product";
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination';
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Slider from "rc-slider";
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

export default function ProductSearch() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const { products, loading, error, productsCount, resPerPage } = useSelector((state) => state.productsState);
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([1, 1000]);
    const [category, setCategory] = useState('');
    const [rating, setRating] = useState(0);

    const { keyword } = useParams();
    const categories = [
        'Electronics',
        'Mobile Phones',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ];

    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo);
        updateSearchParams({ page: pageNo });
    };

    const handleCategoryClick = (category) => {
        setCategory(category);
        setCurrentPage(1);
        updateSearchParams({ category, page: 1 });
    };

    const handlePriceChange = (price) => {
        setPrice(price);
        updateSearchParams({ price: `${price[0]}-${price[1]}` });
    };

    const handleRatingClick = (rating) => {
        setRating(rating);
        updateSearchParams({ rating });
    };

    const updateSearchParams = (newParams) => {
        const updatedParams = { ...Object.fromEntries(searchParams.entries()), ...newParams };
        setSearchParams(updatedParams);
    };

    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        }

        const queryParams = Object.fromEntries(searchParams.entries());
        const priceRange = queryParams.price ? queryParams.price.split('-').map(Number) : [1, 1000];
        const selectedCategory = queryParams.category || '';
        const selectedRating = queryParams.rating || 0;
        const page = queryParams.page || 1;

        setPrice(priceRange);
        setCategory(selectedCategory);
        setRating(Number(selectedRating));
        setCurrentPage(Number(page));

        dispatch(getProducts(keyword, priceRange, selectedCategory, selectedRating, page));
    }, [dispatch, error, keyword, searchParams]);

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Buy Best Products'} />
                    <h1 id="products_heading">Search Products</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            <div className="col-6 col-md-3 mb-5 mt-5">
                                {/* Price Filter */}
                                <div className="px-5">
                                    <h4 className="mb-3">Price</h4>
                                    <Slider
                                        range
                                        marks={{
                                            1: "$1",
                                            1000: "$1000"
                                        }}
                                        min={1}
                                        max={1000}
                                        defaultValue={price}
                                        value={price}
                                        onChange={handlePriceChange}
                                        handleRender={renderProps => (
                                            <Tooltip overlay={`$${renderProps.props['aria-valuenow']}`}>
                                                <div {...renderProps.props}></div>
                                            </Tooltip>
                                        )}
                                    />
                                </div>
                                <hr className="my-5" />
                                {/* Category Filter */}
                                <div className="mt-5">
                                    <h3 className="mb-3">Categories</h3>
                                    <ul className="pl-0">
                                        {categories.map(category => (
                                            <li
                                                style={{
                                                    cursor: "pointer",
                                                    listStyleType: "none"
                                                }}
                                                key={category}
                                                onClick={() => handleCategoryClick(category)}
                                            >
                                                {category}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <hr className="my-5" />
                                {/* Ratings Filter */}
                                <div className="mt-5">
                                    <h4 className="mb-3">Ratings</h4>
                                    <ul className="pl-0">
                                        {[5, 4, 3, 2, 1].map(star => (
                                            <li
                                                style={{
                                                    cursor: "pointer",
                                                    listStyleType: "none"
                                                }}
                                                key={star}
                                                onClick={() => handleRatingClick(star)}
                                            >
                                                <div className="rating-outer">
                                                    <div
                                                        className="rating-inner"
                                                        style={{
                                                            width: `${star * 20}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-6 col-md-9">
                                <div className="row">
                                    {products && products.length > 0 ? (
                                        products.map(product => (
                                            <Product key={product._id} product={product} />
                                        ))
                                    ) : (
                                        <h2 className="mt-5 text-center">No Products Found</h2>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                    {productsCount > 0 && productsCount > resPerPage ?
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                onChange={setCurrentPageNo}
                                totalItemsCount={productsCount}
                                itemsCountPerPage={resPerPage}
                                nextPageText={'Next'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass={'page-item'}
                                linkClass={'page-link'}
                            />
                        </div> : null}
                </Fragment>
            }
        </Fragment>
    );
}