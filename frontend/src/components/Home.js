import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Loader from "./layouts/Loader";
import MetaData from "./layouts/MetaData";
import Product from "./product/Product";
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Import your custom CSS after Bootstrap

export default function Home() {
    const dispatch = useDispatch();
    const { products, loading, error, productsCount, resPerPage } = useSelector((state) => state.productsState);
    const [currentPage, setCurrentPage] = useState(1);

    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo);
    };

    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        }
        dispatch(getProducts(null, null, null, null, currentPage));
    }, [error, dispatch, currentPage]);

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Buy Best Products'} />
                    
                    <Carousel>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://i.pinimg.com/736x/c7/54/8d/c7548d7ba5592ffa3c217f6d00f83a5c.jpg"
                                alt="First slide"
                                style={{ height: '400px', objectFit: 'cover' }}
                            />
                            <Carousel.Caption>
                                <h3>fashion trends</h3>
                                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                                
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://i.pinimg.com/736x/0a/30/55/0a3055e7ae437712bf65907adc33982a.jpg"
                                alt="Second slide"
                                style={{ height: '400px', objectFit: 'cover' }}
                            />
                            <Carousel.Caption>
                                <h3></h3>
                                <p> </p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="https://i.pinimg.com/474x/f8/fe/21/f8fe2109acfaa0a69adf98cc0319b1ce.jpg"
                                alt="Third slide"
                                style={{ height: '400px', objectFit: 'cover' }}
                            />
                            <Carousel.Caption>
                                <h3></h3>
                                <p></p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>

                    <h1 id="products_heading">Fashion trends</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            {products && products.map(product => (
                                <Product col={3} key={product._id} product={product} />
                            ))}
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