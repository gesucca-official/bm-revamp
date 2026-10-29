package com.gsc.bm;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Tag;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Tag("context")
class BmServerApplicationTests extends SqliteContextSupport {

    @Test
    void contextLoads() {
    }

}
