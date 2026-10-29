package com.gsc.bm.repo.internal;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "CRD001_GUI")

@NoArgsConstructor
@Getter
@EqualsAndHashCode
public class CardsGuiRecord implements Serializable {

    @Id
    @Column(name = "C_REF_CLASS")
    private String clazz;

    @Column(name = "T_GUI_NAME")
    private String guiName;

    @Column(name = "T_GUI_DESCRIPTION")
    private String guiDescription;

    @Column(name = "T_GUI_IMAGE")
    private String guiImage;

    @Column(name = "T_GUI_SPRITE")
    private String guiSprite;

    // Descriptive only (regulation 1.7 R07a): no rule reads them.
    @Column(name = "T_GUI_ROLE")
    private String guiRole;

    @Column(name = "T_GUI_GAINS")
    private String guiGains;

    // Descriptive only (regulation 1.9 R07a): nominal damage types, no rule reads them.
    @Column(name = "T_GUI_DAMAGE")
    private String guiDamage;

}
