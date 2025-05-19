package com.MikeCom.SystheseP.security.dto;

public class AuthenticationResponse {

    private String token;
    private String errorMessage; // Nouveau champ pour gérer les erreurs

    public AuthenticationResponse() {
    }

    public AuthenticationResponse(String token) {
        this.token = token;
    }

    public AuthenticationResponse(String token, String errorMessage) {
        this.token = token;
        this.errorMessage = errorMessage;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    private AuthenticationResponse(Builder builder) {
        this.token = builder.token;
        this.errorMessage = builder.errorMessage;
    }

    public static class Builder {
        private String token;
        private String errorMessage;

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        public Builder errorMessage(String errorMessage) { // Nouvelle méthode pour les erreurs
            this.errorMessage = errorMessage;
            return this;
        }

        public AuthenticationResponse build() {
            return new AuthenticationResponse(this);
        }
    }
}
