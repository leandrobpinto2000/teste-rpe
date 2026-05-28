package com.exemplo.orderservice.shared.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.List;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        int statusCode,
        String message,
        OffsetDateTime timestamp,
        String path,
        List<FieldErrorItem> fields
) {
}
