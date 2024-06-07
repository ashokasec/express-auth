import { cookie, jwt_secrets } from "@/config";
import { gen_jwt_token, verifyToken } from "@/utilities/gen.token";

export const verify_request = async (req: any, res: any, next: any) => {
    try {
        const { access_token, refresh_token } = req.cookies;

        if (!access_token || !refresh_token) {
            return res.status(403).json({ error: "No Authorization Token Provided" });
        }

        try {
            const token = await verifyToken(access_token, jwt_secrets.access_token.secret);
            req.user = token.email;
            next();
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                try {
                    const user_info = await verifyToken(refresh_token, jwt_secrets.refresh_token.secret);
                    const payload = { email: user_info.email };
                    const new_access_token = await gen_jwt_token(payload, jwt_secrets.access_token.secret, jwt_secrets.access_token.expiry);

                    res.cookie(cookie.ACCESS_TOKEN, new_access_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production', // Set secure flag in production
                        sameSite: 'strict',
                    });

                    req.user = user_info.email;
                    next();
                } catch (refreshError: any) {
                    if (refreshError.name === 'TokenExpiredError' || refreshError.name === 'JsonWebTokenError') {
                        res.clearCookie(cookie.ACCESS_TOKEN);
                        res.clearCookie(cookie.REFRESH_TOKEN);
                        return res.status(403).json({ error: "Session expired. Please refresh the page." });
                    } else {
                        console.error(refreshError);
                        return res.status(500).json({ error: "Internal Server Error" });
                    }
                }
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(403).json({ error: "Invalid token" });
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
