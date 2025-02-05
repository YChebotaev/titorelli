package ru.titorelli.text_storage.repositories;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.rocksdb.Options;
import org.rocksdb.RocksDB;
import org.rocksdb.RocksDBException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import ru.titorelli.text_storage.helpers.StatsHelper;
import ru.titorelli.text_storage.helpers.UuidHelper;
import ru.titorelli.text_storage.struct.Stats;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Optional;

@Slf4j
@Repository
public class TextRepository {
    @Autowired
    private UuidHelper uuidHelper;
    private RocksDB db;
    @Getter
    private StatsHelper statsHelper;

    public synchronized boolean put(@NotNull String key, @NotNull String val) {
        try {
            db.put(key.getBytes(), val.getBytes(Charset.defaultCharset()));

            return true;
        } catch (RocksDBException e) {
            log.error("Error saving entry. Cause: '{}', message: '{}'", e.getCause(), e.getMessage());

            return false;
        }
    }

    public synchronized Optional<String> get(@NotNull String key) {
        try {
            byte[] bytes = db.get(key.getBytes());

            if (bytes == null) return Optional.empty();

            final String str = new String(bytes, StandardCharsets.US_ASCII);

            return Optional.of(str);
        } catch (RocksDBException e) {
            log.error("Error retrieving the entry with key: {}, cause: {}, message: {}", key, e.getCause(), e.getMessage());

            return Optional.empty();
        }
    }

    public synchronized Boolean has(@NotNull String key) {
        return db.keyExists(key.getBytes());
    }

    public synchronized Optional<Stats> getStats(@NotNull String key) {
        return statsHelper.getStats(key);
    }

    @PostConstruct
    void initialize() {
        RocksDB.loadLibrary();

        final Options opts = new Options();
        opts.setCreateIfMissing(true);

        final File baseDir = new File("data/text", "db.rocks");

        try {
            Files.createDirectories(baseDir.getParentFile().toPath());
            Files.createDirectories(baseDir.getAbsoluteFile().toPath());

            db = RocksDB.open(opts, baseDir.getAbsolutePath());

            statsHelper = new StatsHelper(db);
        } catch (IOException | RocksDBException e) {
            log.error("Error initializng RocksDB. Exception: '{}', message: '{}'", e.getCause(), e.getMessage(), e);
        }
    }
}
