package ru.titorelli.text_storage.controllers;

import com.fasterxml.uuid.Generators;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.titorelli.text_storage.repositories.TextRepository;

import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/")
public class IndexController {
    private final TextRepository textRepository;

    @PutMapping(
            value = "/",
            consumes = MediaType.TEXT_PLAIN_VALUE,
            produces = MediaType.TEXT_PLAIN_VALUE
    )
    ResponseEntity<String> put(@RequestBody(required = true) String txt) {
        final String uuidStr = getUUIDStringFromText(txt);

        if (textRepository.put(uuidStr, txt)) {
            return ResponseEntity.ok(uuidStr);
        }

        return ResponseEntity.internalServerError().build();
    }

    @GetMapping(
            value = "/{guid}",
            produces = MediaType.TEXT_PLAIN_VALUE
    )
    ResponseEntity<String> get(@PathVariable @NotNull UUID guid) {
        final Optional<String> txt = textRepository.get(guid.toString());

        return ResponseEntity.of(txt);
    }

    @PostMapping(
            value = "/get_hash",
            consumes = MediaType.TEXT_PLAIN_VALUE,
            produces = MediaType.TEXT_PLAIN_VALUE
    )
    ResponseEntity<String> hash(@RequestBody(required = true) String txt) {
        return ResponseEntity.ok(getUUIDStringFromText(txt));
    }

    @PostMapping(
            value = "/get_has/{guid}",
            consumes = MediaType.TEXT_PLAIN_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    ResponseEntity<Boolean> has(@RequestBody(required = true) String txt) {
        return ResponseEntity.ok(textRepository.has(getUUIDStringFromText(txt)));
    }

    private String getUUIDStringFromText(@NotNull String txt) {
        final UUID nameSpaceURL = UUID.fromString("6ba7b811-9dad-11d1-80b4-00c04fd430c8");
        final UUID namespaceUUID = Generators.nameBasedGenerator(nameSpaceURL).generate("https://text.api.titorelli.ru");
        final UUID uuid =  Generators.nameBasedGenerator(namespaceUUID).generate(txt);

        return uuid.toString();
    }
}
