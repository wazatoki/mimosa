import jwt from 'jsonwebtoken'
import config from 'config'

// アクセストークンは有効期限30分
export function createAccessToken(userID) {

    const SECRET_KEY = config.secret_key

    const payload = {
        userID: userID
    };
    const option = {
        expiresIn: config.access_token_expires
    }
    const token = jwt.sign(payload, SECRET_KEY, option);

    return token
}

// リフレッシュトークンは有効期限１日
export function createRefreshToken(userID) {

    const SECRET_KEY = config.secret_key

    const payload = {
        userID: userID
    };
    const option = {
        expiresIn: config.refresh_token_expires
    }
    const token = jwt.sign(payload, SECRET_KEY, option);

    return token
}

export function verifyToken(req, res, next) {

    const SECRET_KEY = config.secret_key

    const authHeader = req.headers["authorization"];
    //HeaderにAuthorizationが定義されているか
    if (authHeader !== undefined) {
        //Bearerが正しく定義されているか
        if (authHeader.split(" ")[0] === "Bearer") {
            try {

                // 認証成功の場合
                const token = jwt.verify(authHeader.split(" ")[1], SECRET_KEY);

                req.authorizedUserID = token.userID
                next();

            } catch (e) {
                //tokenエラー
                console.log(e.message);
                res.json({ error: e.message })
            }
        } else {
            res.json({ error: "header format error" });
        }
    } else {
        res.json({ error: "header error" });
    }
}