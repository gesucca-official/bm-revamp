package com.gsc.bm.model.cards;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * SB-34 (D213): the stable identifier of the card a class implements, its {@code binding} in the set file. The id never changes,
 * even when the card or its class is renamed; the class name follows the card's current name. Not inherited: each concrete class
 * declares its own. A class without it keeps the rule of the historical classes: the id is its name without
 * {@code com.gsc.bm.model.cards.}.
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface CardId {
    String value();
}
