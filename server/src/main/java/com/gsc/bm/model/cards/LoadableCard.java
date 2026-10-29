package com.gsc.bm.model.cards;

public interface LoadableCard extends Card {

    void setGuiName(String name);

    void setGuiEffectDescription(String description);

    void setGuiImage(String image);

    void setGuiSprite(String sprite);

    void setGuiRole(String role, String gains);

    void setGuiDamage(String damage);

}
