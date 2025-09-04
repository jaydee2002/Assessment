package com.books.book_service.service;

import com.books.book_service.dto.BookRequest;
import com.books.book_service.dto.BookResponse;
import com.books.book_service.exception.BookNotFoundException;
import com.books.book_service.exception.DuplicateIsbnException;
import com.books.book_service.mapper.BookMapper;
import com.books.book_service.repository.BookRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.books.book_service.mapper.BookMapper.*;

@Service
@Transactional
public class BookService {

    private final BookRepository repo;

    public BookService(BookRepository repo) { this.repo = repo; }

    public BookResponse create(BookRequest req) {
        if (repo.existsByIsbn(req.isbn())) {
            throw new DuplicateIsbnException(req.isbn());
        }
        var saved = repo.save(toEntity(req));
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<BookResponse> findAll() {
        return repo.findAll().stream().map(BookMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public BookResponse findById(UUID id) {
        var book = repo.findById(id).orElseThrow(() -> new BookNotFoundException(id));
        return toResponse(book);
    }

    public BookResponse updateBook(UUID id, BookRequest req) {
        var book = repo.findById(id).orElseThrow(() -> new BookNotFoundException(id));

        if (!book.getIsbn().equals(req.isbn()) && repo.existsByIsbn(req.isbn())) {
            throw new DuplicateIsbnException(req.isbn());
        }

        update(book, req);   // <- this now refers to BookMapper.update(...)
        try {
            return toResponse(repo.save(book));
        } catch (DataIntegrityViolationException e) {
            throw new DuplicateIsbnException(req.isbn());
        }
    }

    public void delete(UUID id) {
        if (!repo.existsById(id)) {
            throw new BookNotFoundException(id);
        }
        repo.deleteById(id);
    }
}