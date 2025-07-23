const bcrypt = require('bcrypt');

const UserModel = require('../models/userModel');
const tokenService = require('./tokenService');
const UserDto = require('../dtos/userDto');
const AuthError = require('../exceptions/AuthError');

class UserService {
    async registration(username, email, password) {
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            throw AuthError.BadRequest(`User with this email (${email}) already exist`);
        }
        const hashedPassword = await bcrypt.hash(password, 3);
        const user = await UserModel.create({username, email, password: hashedPassword});
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto,
        }
    }

    async login(email, password) {
        const user = await UserModel.findOne({email});
        if (!user) {
            throw AuthError.BadRequest("User doesn't exist");
        }
        const isPasswordEq = await bcrypt.compare(password, user.password);
        if (!isPasswordEq) {
            throw AuthError.BadRequest("Wrong password");
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto,
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw AuthError.Unauthorized();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const foundToken = await tokenService.findToken(refreshToken);
        if(!userData || !foundToken) {
            throw AuthError.Unauthorized();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto,
        }
    }
}

module.exports = new UserService();