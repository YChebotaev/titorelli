package ru.titorelli.text_storage.controllers;

import com.fasterxml.jackson.databind.json.JsonMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.titorelli.text_storage.helpers.UuidHelper;
import ru.titorelli.text_storage.repositories.TextRepository;
import ru.titorelli.text_storage.struct.Stats;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/stats/{uuid}")
public class StatsController {
    private final UuidHelper uuidHelper;
    private final JsonMapper jsonMapper = new JsonMapper();
    private final TextRepository textRepository;

    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<String> get(@PathVariable("uuid") UUID textUuid) {
        final String uuidStr = uuidHelper.getForStats(textUuid);

        final Optional<String> statsOptionalStr = getStatsAsStr(uuidStr);

        if (statsOptionalStr.isPresent()) {
            return ResponseEntity.of(statsOptionalStr);
        }

        return ResponseEntity.notFound().build();
    }

    private Optional<String> getStatsAsStr(@NotNull String statsUidStr) {
        final Optional<Stats> statsOptional = textRepository.getStats(statsUidStr);

        return statsOptional.flatMap(Stats::toJSON);
    }
}
