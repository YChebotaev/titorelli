package ru.titorelli.text_storage.controllers;

import com.fasterxml.jackson.databind.json.JsonMapper;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.titorelli.text_storage.helpers.UuidHelper;
import ru.titorelli.text_storage.repositories.TextRepository;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/metadata/{uuid}")
public class MetadataController {
    private final UuidHelper uuidHelper;
    private final JsonMapper jsonMapper = new JsonMapper();
    private final TextRepository textRepository;

    @PutMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Boolean> put(@PathVariable("uuid") UUID textUuid, @RequestBody String input) {
        final String uuidStr = uuidHelper.getForMetadata(textUuid);

        if (!validateJson(input)) {
            return ResponseEntity.badRequest().build();
        }

        if (textRepository.put(uuidStr, input)) {
            return ResponseEntity.ok(true);
        }

        return ResponseEntity.internalServerError().build();
    }

    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<String> get(@PathVariable("uuid") UUID textUuid) {
        final String uuidStr = uuidHelper.getForMetadata(textUuid);

        final Optional<String> metadataStr = textRepository.get(uuidStr);

        return ResponseEntity.of(metadataStr);
    }

    private @NotNull Boolean validateJson(@NotNull String input) {
        try {
            jsonMapper.readTree(input);

            return true;
        } catch (IOException e) {
            return false;
        }
    }
}
