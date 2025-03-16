import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Product({ product, col }) {
    const navigate = useNavigate();

    useEffect(() => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript.toLowerCase();
            if (speechResult.includes('view details')) {
                navigate(`/product/${product._id}`);
            }
        };

        recognition.onspeechend = () => {
            recognition.stop();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error detected: ' + event.error);
        };

        const startRecognition = () => {
            recognition.start();
        };

        const voiceViewDetailsBtn = document.getElementById(`voice_view_details_btn_${product._id}`);
        if (voiceViewDetailsBtn) {
            voiceViewDetailsBtn.addEventListener('click', startRecognition);
        }

        return () => {
            if (voiceViewDetailsBtn) {
                voiceViewDetailsBtn.removeEventListener('click', startRecognition);
            }
        };
    }, [navigate, product]);

    return (
        <div className={`col-sm-12 col-md-6 col-lg-${col} my-3`}>
            <div className="card p-3 rounded">
                {product.images.length > 0 &&
                <img
                    className="card-img-top mx-auto"
                    src={product.images[0].image}
                    alt={product.name}
                />}
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                        <Link to={`/product/${product._id}`}>{product.name}</Link>
                    </h5>
                    <div className="ratings mt-auto">
                        <div className="rating-outer">
                            <div className="rating-inner" style={{ width: `${product.ratings / 5 * 100}%` }}></div>
                        </div>
                        <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
                    </div>
                    <p className="card-text">${product.price}</p>
                    <Link to={`/product/${product._id}`} id="view_btn" className="btn btn-block">View Details</Link>
                    <button id={`voice_view_details_btn_${product._id}`} className="btn btn-secondary btn-block mt-2">Voice View Details</button>
                </div>
            </div>
        </div>
    );
}