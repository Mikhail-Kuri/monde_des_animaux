package com.MikeCom.SystheseP.service.dto;

public class CommandeResponseDTO {
    private Long id;
    private String confirmationCode;
    private String message;

    public CommandeResponseDTO(Long id, String confirmationCode, String message) {
        this.id = id;
        this.confirmationCode = confirmationCode;
        this.message = message;
    }

    public CommandeResponseDTO() {
    }



    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getConfirmationCode() {
        return confirmationCode;
    }
    public void setConfirmationCode(String confirmationCode) {
        this.confirmationCode = confirmationCode;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}
