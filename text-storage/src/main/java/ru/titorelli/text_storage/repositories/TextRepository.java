package ru.titorelli.text_storage.repositories;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.rocksdb.Options;
import org.rocksdb.RocksDB;
import org.rocksdb.RocksDBException;
import org.springframework.stereotype.Repository;
import org.springframework.util.SerializationUtils;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Optional;

@Slf4j
@Repository
public class TextRepository {
    RocksDB db;

    public synchronized boolean put(String key, String val) {
        try {
            db.put(key.getBytes(), val.getBytes(Charset.defaultCharset()));

            return true;
        } catch (RocksDBException e) {
            log.error("Error saving entry. Cause: '{}', message: '{}'", e.getCause(), e.getMessage());

            return false;
        }
    }

    public synchronized Optional<String> get(String key) {
        try {
            byte[] bytes = db.get(key.getBytes());

            if (bytes == null)
                return Optional.empty();

            final String str = new String(bytes, StandardCharsets.US_ASCII);

            return Optional.of(str);
        } catch (RocksDBException e) {
            log.error(
                    "Error retrieving the entry with key: {}, cause: {}, message: {}",
                    key,
                    e.getCause(),
                    e.getMessage()
            );

            return Optional.empty();
        }
    }

    public synchronized Boolean has(String key) {
        return db.keyExists(key.getBytes());
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

        } catch (IOException | RocksDBException e) {
            log.error("Error initializng RocksDB. Exception: '{}', message: '{}'", e.getCause(), e.getMessage(), e);
        }
    }
}
