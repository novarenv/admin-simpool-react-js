import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = props => {
    const year = new Date().getFullYear()

    return (
        <div className="abs-center wd-xl">
            <div className="text-center mb-4">
                <div className="text-lg mb-3">404</div>
                <p className="lead m-0">We couldn't find this page.</p>
                <p>The page you are looking for does not exists.</p>
            </div>
            <h1 className="text-center">
                <Link to="/simpool/" className="text-muted">Go to Dashboard</Link>
            </h1>
            <div className="p-3 text-center">
                <span>&copy; {year} - Simpool</span>
            </div>
        </div>
    )
}

export default NotFound;

