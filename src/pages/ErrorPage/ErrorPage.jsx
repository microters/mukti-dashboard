import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    const goBack = () => {
        window.history.back();
      };
    return (
        <div>
            <Link>
                <button className="my-btn" onClick={goBack}>
                    Go Back
                </button>
            </Link>
        </div>
    );
};

export default ErrorPage;