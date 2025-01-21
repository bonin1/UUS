package com.uus.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Map<String, Object> errorDetails = new HashMap<>();
        
        Integer statusCode = (Integer) request.getAttribute("javax.servlet.error.status_code");
        String message = (String) request.getAttribute("javax.servlet.error.message");
        
        errorDetails.put("status", statusCode != null ? statusCode : 500);
        errorDetails.put("message", message != null ? message : "Unknown error");
        errorDetails.put("path", request.getRequestURI());
        
        return new ResponseEntity<>(errorDetails, HttpStatus.valueOf(statusCode != null ? statusCode : 500));
    }
}
