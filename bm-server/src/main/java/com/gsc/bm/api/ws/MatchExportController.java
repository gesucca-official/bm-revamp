package com.gsc.bm.api.ws;

import com.gsc.bm.service.session.MatchArchiveService;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import java.security.Principal;

@Controller
public class MatchExportController {
    private final MatchArchiveService archives;
    public MatchExportController(MatchArchiveService archives) { this.archives = archives; }
    @MessageMapping("/archive/{gameId}/export")
    @SendToUser("/queue/archive/{gameId}/export")
    public Object export(@DestinationVariable String gameId, Principal principal) {
        return archives.export(gameId, principal.getName());
    }
    @MessageExceptionHandler
    @SendToUser("/queue/account/error")
    public String unavailable(Exception failure) { return "Match export unavailable"; }
}
