package ru.titorelli.text_storage.helpers;

import com.fasterxml.uuid.Generators;
import com.fasterxml.uuid.impl.NameBasedGenerator;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UuidHelper {
    private final UUID urlNamespace = UUID.fromString("6ba7b811-9dad-11d1-80b4-00c04fd430c8");
    private final UUID textNamespace = Generators.nameBasedGenerator(urlNamespace).generate("https://text.api.titorelli.ru/text");
    private final NameBasedGenerator textGenerator = Generators.nameBasedGenerator(textNamespace);
    private final UUID statsNamespace = Generators.nameBasedGenerator(urlNamespace).generate("https://text.api.titorelli.ru/stats");
    private final NameBasedGenerator statsGenerator = Generators.nameBasedGenerator(statsNamespace);
    private final UUID metadataNamespace = Generators.nameBasedGenerator(urlNamespace).generate("https://text.api.titorelli.ru/metadata");
    private final NameBasedGenerator metadataGenerator = Generators.nameBasedGenerator(metadataNamespace);

    public String getForText(@NotNull String txt) {
        return textGenerator.generate(txt).toString();
    }

    public String getForStats(@NotNull UUID textUuid) {
        return statsGenerator.generate(textUuid.toString()).toString();
    }

    public String getForStats(@NotNull String textUuidStr) {
        return statsGenerator.generate(textUuidStr).toString();
    }

    public String getForMetadata(@NotNull UUID textUuid) {
        return metadataGenerator.generate(textUuid.toString()).toString();
    }

    public String getForMetadata(@NotNull String textUuidStr) {
        return metadataGenerator.generate(textUuidStr).toString();
    }
}
