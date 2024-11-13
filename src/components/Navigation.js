import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
    return (
        <nav className="bg-primary p-4">
            <ul className="flex space-x-4">
                <li>
                    <Link to="/" className="text-white hover:text-gray-200">
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/users" className="text-white hover:text-gray-200">
                        Users
                    </Link>
                </li>
                <li>
                    <Link to="/register-user" className="text-white hover:text-gray-200">
                        Register User
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation; 