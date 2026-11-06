package com.gsc.bm.model.cards;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marks an int field holding one of a Java card's numbers. Its initializer is the value of the live game; the
 * playground of set-base plan SB-6a (test sources only) reads and overrides it by name. Live code never changes it.
 * Keep such fields private and without getters, so the JSON views do not expose them.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Tunable {
}
