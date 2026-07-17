export const generateToken = (admin, statusCode, message, res) => {
    const token = admin.generateToken();

    const cookieOptions = {
        expires: new Date(
            Date.now() +
            Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res
        .status(statusCode)
        .cookie("token", token, cookieOptions)
        .json({
            success: true,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
                companyId: admin.companyId,
            },
            message,
            token,
        });
};