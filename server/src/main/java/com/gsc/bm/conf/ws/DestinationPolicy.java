package com.gsc.bm.conf.ws;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.game.ComPlayer;
import com.gsc.bm.service.session.GameSessionService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.util.Set;

@Component
public class DestinationPolicy {
    private final GameSessionService games;
    private final ObjectMapper mapper;
    @org.springframework.beans.factory.annotation.Autowired
    private com.gsc.bm.service.session.MatchArchiveService archives;
    public DestinationPolicy(@org.springframework.context.annotation.Lazy GameSessionService games, ObjectMapper mapper) { this.games = games; this.mapper = mapper; }
    private void require(boolean condition) { if (!condition) { throw new AccessDeniedException("Destination denied"); } }
    private void member(String game, String user) {
        try {
            var player = games.getGame(game).getPlayers().get(user);
            require(player != null && !(player instanceof ComPlayer));
        } catch (IllegalArgumentException e) { throw new AccessDeniedException("Destination denied"); }
    }
    public void check(String user, String destination, boolean subscribe, Object payload) {
        require(user != null && destination != null);
        if (subscribe) {
            if (Set.of("/topic/connections/users", "/user/queue/game/quick/1v1/ready",
                    "/user/queue/game/quick/ffa/ready", "/topic/game/quick/ffa/joined",
                    "/user/queue/game/error", "/user/queue/session/resume", "/user/queue/session/logout", "/user/queue/session/queue/leave", "/user/queue/account/data", "/user/queue/account/error", "/user/queue/illegalMove",
                    "/user/queue/game/quick/1vCom/ready", "/user/queue/game/open/1vCom/ready", "/user/queue/game/open/1vCom/error").contains(destination)) { return; }
            String[] p = destination.split("/");
            if (p.length == 6 && p[1].equals("user") && p[2].equals("queue") && p[3].equals("archive") && p[5].equals("export")) {
                archives.requireExport(p[4], user); return;
            }
            if (p.length == 5 && p[1].equals("topic") && p[2].equals("game") &&
                    Set.of("update", "move").contains(p[4])) { member(p[3], user); return; }
            if (p.length == 6 && p[1].equals("user") && p[2].equals("queue") && p[3].equals("game") && Set.of("view", "leave").contains(p[5])) {
                if (p[5].equals("leave")) { require(games.canLeave(p[4], user)); }
                else { member(p[4], user); }
                return;
            }
        } else {
            if (Set.of("/app/session/resume", "/app/session/logout", "/app/session/queue/leave", "/app/connections/users/tell/me", "/app/game/quick/ffa/join/com", "/app/game/quick/ffa/start").contains(destination)) { return; }
            String body = payload instanceof byte[] ? new String((byte[]) payload, StandardCharsets.UTF_8) : String.valueOf(payload);
            if (Set.of("/app/game/quick/1vCom/join", "/app/game/quick/1v1/join", "/app/game/quick/ffa/join").contains(destination)) {
                require(user.equals(body)); return;
            }
            String[] p = destination.split("/");
            if (p.length == 5 && p[1].equals("app") && p[2].equals("archive") && p[4].equals("export")) {
                archives.requireExport(p[3], user); return;
            }
            if ((p.length == 5 || p.length == 6) && p[1].equals("app") && p[2].equals("user")) {
                require(user.equals(p[3]) && ((p.length == 5 && Set.of("account", "deck").contains(p[4])) ||
                        (p.length == 6 && p[4].equals("deck") && p[5].equals("delete")))); return;
            }
            if (p.length == 8 && p[1].equals("app") && p[2].equals("game") && p[3].equals("open") &&
                    p[4].equals("1vCom") && p[5].equals("join")) { require(user.equals(p[6])); return; }
            if (p.length == 6 && p[1].equals("app") && p[2].equals("game") && Set.of("view", "leave").contains(p[5])) {
                require(user.equals(p[4]));
                if (p[5].equals("leave")) { require(games.canLeave(p[3], user)); }
                else { member(p[3], user); }
                return;
            }
            if (p.length == 5 && p[1].equals("app") && p[2].equals("game") && p[4].equals("move")) {
                member(p[3], user);
                try {
                    JsonNode move = mapper.readTree(body);
                    require(move != null && user.equals(move.path("playerId").asText()) && p[3].equals(move.path("gameId").asText()));
                } catch (java.io.IOException e) { throw new AccessDeniedException("Invalid command"); }
                return;
            }
        }
        throw new AccessDeniedException("Destination denied");
    }
}
