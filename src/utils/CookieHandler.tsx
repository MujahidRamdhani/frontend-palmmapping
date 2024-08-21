import React, { useEffect, useState } from 'react';

const CookieHandler: React.FC = () => {
    const [userEmail, setUserEmail] = useState<string | undefined>();

    const getCookieValue = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    useEffect(() => {
        const email = getCookieValue('userEmail');
        setUserEmail(email);
    }, []);

    return (
        <div>
            <p>All Cookies: {document.cookie}</p>
            <p>User Email: {userEmail}</p>
        </div>
    );
};

export default CookieHandler;
