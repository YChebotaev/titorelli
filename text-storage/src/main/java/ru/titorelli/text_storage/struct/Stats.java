package ru.titorelli.text_storage.struct;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.json.JsonMapper;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@AllArgsConstructor
@NoArgsConstructor
@JsonSerialize
@Getter
@Setter
public class Stats {
    private JsonMapper jsonMapper = new JsonMapper();
    private Long createdAt = 0L;
    private Integer length = 0;
    private Long lastAccess = 0L;
    private Long countRead = 0L;

    public static Optional<Stats> fromJSONBytes(byte[] jsonBytes) {
        final JsonMapper jsonMapper = new JsonMapper();
        final Stats stats;

        try {
            stats = jsonMapper.readValue(jsonBytes, Stats.class);
        } catch (IOException e) {
            log.error("Cannot parse stats from bytes");

            return Optional.empty();
        }


        return Optional.of(stats);
    }

    public Optional<String> toJSON() {
        final String str;

        try {
            str = jsonMapper.writeValueAsString(this);
        } catch (IOException e) {
            return Optional.empty();
        }

        return Optional.of(str);
    }

    public Optional<byte[]> toJSONBytes() {
        final byte[] bytes;

        try {
            bytes = jsonMapper.writeValueAsBytes(this);
        } catch (IOException e) {
            return Optional.empty();
        }

        return Optional.of(bytes);
    }
}
