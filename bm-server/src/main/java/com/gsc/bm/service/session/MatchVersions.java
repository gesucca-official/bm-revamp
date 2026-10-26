package com.gsc.bm.service.session;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;
import static com.gsc.bm.repo.external.MatchEventRepository.sha256;

/** Identifies the actual loaded artifact/classes, rules and catalog, including dirty builds. */
@Component
public class MatchVersions {
    private final Map<String, Object> versions;
    public MatchVersions() {
        try {
            byte[] rules = resource("analysis/game-rules.md");
            String rulesText = new String(rules, StandardCharsets.UTF_8).replace("\r\n", "\n");
            var version = java.util.regex.Pattern.compile("Versione \\*\\*([0-9.]+) —").matcher(rulesText);
            if (!version.find()) { throw new IllegalStateException("Missing rules version"); }
            java.net.URL source = MatchVersions.class.getProtectionDomain().getCodeSource().getLocation();
            // Boot may expose BOOT-INF/classes through a nested jar URL.
            while (source.getProtocol().equals("jar")) { source = org.springframework.util.ResourceUtils.extractJarFileURL(source); }
            Path location = Path.of(source.toURI());
            String code;
            if (Files.isDirectory(location)) {
                var digest = java.security.MessageDigest.getInstance("SHA-256");
                List<Path> classes;
                try (var paths = Files.walk(location.resolve("com/gsc/bm"))) {
                    classes = paths.filter(p -> p.toString().endsWith(".class")).sorted().collect(Collectors.toList());
                }
                if (classes.isEmpty()) { throw new IllegalStateException("Missing application classes"); }
                for (Path file : classes) {
                    digest.update(location.relativize(file).toString().replace('\\', '/').getBytes(StandardCharsets.UTF_8));
                    digest.update((byte) 0); digest.update(Files.readAllBytes(file));
                }
                code = org.apache.commons.codec.binary.Hex.encodeHexString(digest.digest());
            } else { code = sha256(Files.readAllBytes(location)); }
            versions = Collections.unmodifiableMap(MatchSnapshot.fields("codeSha256", code, "codeFormat", Files.isDirectory(location) ? "sorted-class-files" : "jar",
                    "rulesVersion", version.group(1), "rulesSha256", sha256(rulesText.getBytes(StandardCharsets.UTF_8)),
                    "catalogSha256", sha256(resource("cards.sqlite")), "rulesCatalogSha256", sha256(resource("analysis/rules-catalog.json"))));
        } catch (Exception e) { throw new IllegalStateException("Cannot identify match versions", e); }
    }
    private byte[] resource(String name) throws java.io.IOException {
        try (var in = new ClassPathResource(name).getInputStream()) { return in.readAllBytes(); }
    }
    public Map<String, Object> get() { return versions; }
}
