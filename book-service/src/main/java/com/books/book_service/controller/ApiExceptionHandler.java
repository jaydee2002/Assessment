package com.books.book_service.controller;

import com.books.book_service.exception.BookNotFoundException;
import com.books.book_service.exception.DuplicateIsbnException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class ApiExceptionHandler {

    private ResponseEntity<Object> body(HttpStatus status, String message, Map<String, Object> extra) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", Instant.now().toString());
        error.put("status", status.value());
        error.put("error", status.getReasonPhrase());
        error.put("message", message);
        if (extra != null && !extra.isEmpty()) error.putAll(extra);
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity<Object> notFound(BookNotFoundException ex) {
        return body(HttpStatus.NOT_FOUND, ex.getMessage(), Map.of());
    }

    @ExceptionHandler(DuplicateIsbnException.class)
    public ResponseEntity<Object> duplicate(DuplicateIsbnException ex) {
        return body(HttpStatus.CONFLICT, ex.getMessage(), Map.of());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Object> badUuid(MethodArgumentTypeMismatchException ex) {
        return body(HttpStatus.BAD_REQUEST, "Invalid parameter: " + ex.getName(), Map.of("value", String.valueOf(ex.getValue())));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> badRequest(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(fe -> fieldErrors.put(fe.getField(), fe.getDefaultMessage()));
        return body(HttpStatus.BAD_REQUEST, "Validation failed", Map.of("fields", fieldErrors));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Object> missingParam(MissingServletRequestParameterException ex) {
        return body(HttpStatus.BAD_REQUEST, "Missing parameter: " + ex.getParameterName(), Map.of());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> generic(Exception ex) {
        return body(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error", Map.of("detail", ex.getClass().getSimpleName()));
    }
}