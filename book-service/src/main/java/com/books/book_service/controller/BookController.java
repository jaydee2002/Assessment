package com.books.book_service.controller;

import com.books.book_service.dto.BookRequest;
import com.books.book_service.dto.BookResponse;
import com.books.book_service.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/books")
@Validated
public class BookController {

    private final BookService service;

    public BookController(BookService service) {
        this.service = service;
    }

    // POST /books
    @PostMapping
    public ResponseEntity<BookResponse> create(@RequestBody @Valid BookRequest request) {
        BookResponse created = service.create(request);
        // Location: /books/{id}
        return ResponseEntity
                .created(URI.create("/books/" + created.id()))
                .body(created);
    }

    // GET /books
    @GetMapping
    public List<BookResponse> findAll() {
        return service.findAll();
    }

    // GET /books/{id}
    @GetMapping("/{id}")
    public BookResponse findById(@PathVariable UUID id) {
        return service.findById(id);
    }

    // PUT /books/{id}
    @PutMapping("/{id}")
    public BookResponse update(@PathVariable UUID id, @RequestBody @Valid BookRequest request) {
        return service.updateBook(id, request);
    }

    // DELETE /books/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}