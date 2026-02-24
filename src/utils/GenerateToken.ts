import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.Refresh_Key!;

export const GenerateToken = (userId: any) => {
    const accessToken = jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: "30m",
    });

    const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, {
        expiresIn: "3d",
    });

    return { accessToken, refreshToken };
};
