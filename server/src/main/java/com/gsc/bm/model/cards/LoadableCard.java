package com.gsc.bm.model.cards;

public interface LoadableCard extends Card {

    void setGuiName(String name);

    void setGuiEffectDescription(String description);

    void setGuiImage(String image);

    void setGuiSprite(String sprite);

    void setGuiRole(String role, String gains);

    void setGuiDamage(String damage);

    void setGuiDamageAmount(String damageAmount);

    void setGuiExclusiveTo(String character);

    /** SB-19 (RP-28): the short text of an item's «In campo» effect; set only by the playground loader. */
    void setGuiInPlay(String inPlay);

}
