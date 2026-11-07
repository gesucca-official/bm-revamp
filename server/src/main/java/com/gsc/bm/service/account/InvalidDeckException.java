package com.gsc.bm.service.account;

/** A deck that breaks the deck rules of regulation 1.12 R02; the message names the first broken rule. */
public class InvalidDeckException extends IllegalArgumentException {
    public InvalidDeckException(String message) {
        super(message);
    }
}
