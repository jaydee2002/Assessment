package com.books.book_service.mapper;

import com.books.book_service.dto.BookRequest;
import com.books.book_service.dto.BookResponse;
import com.books.book_service.model.Book;

public final class BookMapper {
    private BookMapper() {}

    public static Book toEntity(BookRequest r) {
        return Book.builder()
                .title(r.title())
                .author(r.author())
                .isbn(r.isbn())
                .publicationDate(r.publicationDate())
                .build();
    }

    public static BookResponse toResponse(Book b) {
        return new BookResponse(b.getId(), b.getTitle(), b.getAuthor(), b.getIsbn(), b.getPublicationDate());
    }

    public static void update(Book b, BookRequest r) {
        b.setTitle(r.title());
        b.setAuthor(r.author());
        b.setIsbn(r.isbn());
        b.setPublicationDate(r.publicationDate());
    }
}