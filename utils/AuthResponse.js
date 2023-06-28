class AuthResponse {
    constructor(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}

module.exports = {AuthResponse}