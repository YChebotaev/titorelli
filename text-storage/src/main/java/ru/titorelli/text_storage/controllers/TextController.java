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
@RequestMapping("/text")
public class TextController {
    private final JsonMapper jsonMapper = new JsonMapper();
    private final TextRepository textRepository;
    private final UuidHelper uuidHelper;

    @PutMapping(value = "", consumes = MediaType.TEXT_PLAIN_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    ResponseEntity<String> put(@RequestBody(required = true) String txt) {
        final String uuidStr = uuidHelper.getForText(txt);

        if (textRepository.put(uuidStr, txt)) {
            textRepository.getStatsHelper().init(uuidHelper.getForStats(uuidStr), txt);

            return ResponseEntity.ok(uuidStr);
        }

        return ResponseEntity.internalServerError().build();
    }

    @PutMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    ResponseEntity<String> put(@NotNull @RequestPart("text") String txt, @NotNull @RequestPart("metadata") String metadataStr) {
        if (!validateJson(metadataStr)) {
            return ResponseEntity.badRequest().build();
        }

        final String textUuid = uuidHelper.getForText(txt);
        final String metadataUuid = uuidHelper.getForMetadata(textUuid);

        if (textRepository.put(textUuid, txt)) {
            textRepository.getStatsHelper().init(uuidHelper.getForStats(textUuid), txt);
        } else {
            return ResponseEntity.internalServerError().build();
        }

        if (!textRepository.put(metadataUuid, metadataStr)) {
            return ResponseEntity.internalServerError().build();
        }

        return ResponseEntity.ok(textUuid);
    }

    @GetMapping(value = "/{guid}", produces = MediaType.TEXT_PLAIN_VALUE)
    ResponseEntity<String> get(@PathVariable @NotNull UUID guid) {
        final Optional<String> txt = textRepository.get(guid.toString());

        textRepository.getStatsHelper().incrReads(uuidHelper.getForStats(guid));

        return ResponseEntity.of(txt);
    }

    @PostMapping(value = "/get_hash", consumes = MediaType.TEXT_PLAIN_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    ResponseEntity<String> hash(@RequestBody(required = true) String txt) {
        return ResponseEntity.ok(uuidHelper.getForText(txt));
    }

    @PostMapping(value = "/get_has/{guid}", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Boolean> getHasByGuid(@PathVariable @NotNull UUID guid) {
        return ResponseEntity.ok(textRepository.has(guid.toString()));
    }

    @PostMapping(value = "/get_has", consumes = MediaType.TEXT_PLAIN_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Boolean> getHasByText(@RequestBody(required = true) String txt) {
        return ResponseEntity.ok(textRepository.has(uuidHelper.getForText(txt)));
    }

    private Boolean validateJson(@NotNull String input) {
        try {
            jsonMapper.readTree(input);

            return true;
        } catch (IOException e) {
            return false;
        }
    }
}
