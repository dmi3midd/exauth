const jwt = require('jsonwebtoken');
const tokenModel = require('../models/tokenModel');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_EXPIRATION});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_EXPIRATION});
        return {
            accessToken,
            refreshToken,
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({refreshToken});
        return tokenData;
    }

    async saveToken(userId, refreshToken) {
        const token = await tokenModel.findOne({user: userId});
        if (token) {
            token.refreshToken = refreshToken;
            return token.save();
        }
        const newToken = await tokenModel.create({user: userId, refreshToken});
        return newToken.save();
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({refreshToken});
        return tokenData;
    }
}

module.exports = new TokenService();