package com.books.book_service.dto;

import java.time.LocalDate;
import java.util.UUID;

public record BookResponse(
        UUID id,
        String title,
        String author,
        String isbn,
        LocalDate publicationDate
) {}