import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token
        
        if (!token) {
            return res.status(401).json({ message: "Please login first" }) // ✅ Changed 400 → 401
        }

        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET)  
        req.userId = verifyToken.userId

        next()

    } catch (error) {
        console.error("Auth error:", error.message) // ✅ Added logging
        return res.status(401).json({ message: "Invalid or expired token" }) // ✅ Changed 500 → 401
    }
}

export default isAuth
