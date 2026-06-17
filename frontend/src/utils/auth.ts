import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const isTokenValid = (): boolean => {
    const token = Cookies.get("token");
    if (!token) return false; // Không có token

    try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Đổi sang giây
        
        // Kiểm tra xem thời gian hiện tại đã vượt qua thời hạn (exp) của token chưa
        return decoded.exp > currentTime; 
    } catch (error) {
        return false; // Token sai định dạng
    }
};