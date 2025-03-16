import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Search () {

    const navigate = useNavigate();
    const location = useLocation();
    const [keyword, setKeyword] = useState("");

    const searchHandler = (e) => {
        e.preventDefault();
        navigate(`/search/${keyword}`);
    };

    const clearKeyword = () => {
        setKeyword("");
    };

    useEffect(() => {
        if(location.pathname === '/') {
            clearKeyword();
        }
    }, [location]);

    useEffect(() => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            setKeyword(speechResult);
            navigate(`/search/${speechResult}`);
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

        document.getElementById('voice_search_btn').addEventListener('click', startRecognition);

        return () => {
            document.getElementById('voice_search_btn').removeEventListener('click', startRecognition);
        };
    }, [navigate]);

    return (
        <form onSubmit={searchHandler}>
            <div className="input-group">
                <input
                    type="text"
                    id="search_field"
                    className="form-control"
                    placeholder="Enter Product Name ..."
                    onChange={(e) => { setKeyword(e.target.value) }}
                    value={keyword}
                />
                <div className="input-group-append">
                    <button id="search_btn" className="btn">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                    <button id="voice_search_btn" className="btn">
                        <i className="fa fa-microphone" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </form>
    );
}