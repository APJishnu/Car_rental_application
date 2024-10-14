// utils/authMiddleware.ts
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export const useAuthMiddleware = (setModal: (message: string, status: "success" | "error") => void) => {
    const router = useRouter();

    const checkLogin =() => {
        const token = Cookies.get('userToken'); // Replace 'userToken' with your actual cookie name
        if (!token) {
            setModal("Please log in to continue and enjoy!", "error");
            setTimeout(() => {
                router.push('/user/user-login'); // Redirect to the login page
            }, 3000);
            return false; // User is not logged in
        }
        return true; // User is logged in
    };

    return { checkLogin };
};
