package org.example.api.payload.response;

import lombok.Data;

@Data
public class DefaultResponse<T> {
    private String message;
    private boolean success = true;
    private T data;


    public DefaultResponse(String message, boolean success, T data) {
        this.message = message;
        this.success = success;
        this.data = data;
    }


}
