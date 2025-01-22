import './index.scss';
import React, { useEffect, useState } from 'react';
import MenuInterior from '../MenuInterior';
import 'primeicons/primeicons.css';
import { AuthContext } from '../../context/AuthContext';

export default function UserPosts() {
    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);

    return (
        <div>
            <MenuInterior />
            <div className='userPosts-wrapper-primary'>
                <div className='userPosts-wrapper-secondary'>
                    <div className='userPosts-header-wrapper'>
                        <h2>Your Posts</h2>
                        <i className="pi pi-send"></i>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    )
}