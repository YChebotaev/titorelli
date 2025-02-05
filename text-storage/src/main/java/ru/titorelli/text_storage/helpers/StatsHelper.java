package ru.titorelli.text_storage.helpers;

import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.rocksdb.RocksDB;
import org.rocksdb.RocksDBException;
import org.springframework.stereotype.Indexed;
import ru.titorelli.text_storage.struct.Stats;

import java.util.Optional;

@Slf4j
@Indexed
public class StatsHelper {
    private final RocksDB db;

    public StatsHelper(@NotNull RocksDB db) {
        this.db = db;
    }

    public Boolean init(@NotNull String key, @NotNull String txt) {
        Stats statsObj = new Stats();
        statsObj.setCreatedAt(System.currentTimeMillis());
        statsObj.setLength(txt.length());

        Optional<byte[]> statsBytesOptional = statsObj.toJSONBytes();

        if (statsBytesOptional.isPresent()) {
            try {
                db.put(key.getBytes(), statsBytesOptional.get());

                return true;
            } catch (RocksDBException e) {
                log.error("Error saving stats. Cause: '{}', message: '{}'", e.getCause(), e.getMessage());

                return false;
            }
        }

        return false;
    }

    public Boolean incrReads(@NotNull String key) {
        final Stats stats;
        final Optional<Stats> statsOptional = getStats(key);

        if (statsOptional.isPresent()) {
            stats = statsOptional.get();

            stats.setLastAccess(System.currentTimeMillis());
            stats.setCountRead(stats.getCountRead() + 1);

            final byte[] statsBytes;
            final Optional<byte[]> statsBytesOptional = stats.toJSONBytes();

            if (statsBytesOptional.isPresent()) {
                statsBytes = statsBytesOptional.get();

                try {
                    db.put(key.getBytes(), statsBytes);

                    return true;
                } catch (RocksDBException e) {
                    log.error("Error retrieving the entry with key: {}, cause: {}, message: {}", key, e.getCause(), e.getMessage());

                    return false;
                }
            }
        }

        return false;
    }

    public Optional<Stats> getStats(@NotNull String key) {
        try {
            byte[] bytes = db.get(key.getBytes());

            if (bytes == null) return Optional.empty();

            return Stats.fromJSONBytes(bytes);
        } catch (RocksDBException e) {
            log.error("Error retrieving the entry with key: {}, cause: {}, message: {}", key, e.getCause(), e.getMessage());

            return Optional.empty();
        }
    }
}
