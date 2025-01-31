package ru.titorelli.text_storage.controllers;

import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.titorelli.text_storage.repositories.TextRepository;

import java.nio.charset.Charset;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/")
public class IndexController {
    private final TextRepository textRepository;

    @GetMapping(value = "/{guid}", produces = MediaType.TEXT_PLAIN_VALUE)
    ResponseEntity<String> get(@PathVariable UUID guid) {
        final Optional<String> txt = textRepository.get(guid.toString());

        return ResponseEntity.of(txt);
    }

    @PutMapping(value = "/", consumes = MediaType.TEXT_PLAIN_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<UUID> put(@RequestBody(required = true) String txt) {
        final byte[] n = txt.getBytes(Charset.defaultCharset());
        final UUID u = UUID.nameUUIDFromBytes(n);
        final String s = u.toString();

        if (textRepository.put(s, txt)) {
            return ResponseEntity.ok(u);
        }

        return ResponseEntity.internalServerError().build();
    }
}
