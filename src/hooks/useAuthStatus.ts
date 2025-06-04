import { useEffect, useState } from 'react';

export function useAuthStatus() {
    const [isLogin, setIsLogin] = useState<boolean | null>(null);

    useEffect(() => {
        const checkLogin = () => {
            const status = localStorage.getItem('isLogin');
            setIsLogin(status === 'true');
        };

        checkLogin();

        const handleStorage = (event: StorageEvent) => {
            if (event.key === 'isLogin') {
                checkLogin();
            }
        };

        const handleLocalStorageChange = () => {
            checkLogin();
        };

        window.addEventListener('storage', handleStorage);
        window.addEventListener('localStorageChange', handleLocalStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('localStorageChange', handleLocalStorageChange);
        };
    }, []);


    return isLogin;
}
