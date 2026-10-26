package com.gsc.bm.repo.external;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class WebClientLogRecord {

    private String timestamp;

    private String additional;

    private String message;
}
