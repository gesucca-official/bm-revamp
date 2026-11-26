package com.gsc.bm.model.cards.base;

import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.base.beppe.Disassemble;
import com.gsc.bm.model.cards.base.beppe.JobWellDone;
import com.gsc.bm.model.cards.base.celestina.DragIntoTheTunnel;
import com.gsc.bm.model.cards.base.celestina.SpeedBoostedReflexes;
import com.gsc.bm.model.cards.base.common.ExcuseMeSorryCanYouStop;
import com.gsc.bm.model.cards.base.common.GotAnySpareChange;
import com.gsc.bm.model.cards.base.common.SleightOfHandTheft;
import com.gsc.bm.model.cards.base.common.SuddenDash;
import com.gsc.bm.model.cards.base.duccio.bound.LetUsGetUpAndYouGo;
import com.gsc.bm.model.cards.base.items.DiscountDoubleMalt;
import com.gsc.bm.model.cards.base.items.LethalMix;
import com.gsc.bm.model.cards.base.items.SaintBriacoHolyCard;
import com.gsc.bm.model.cards.base.items.WarmBlonde66;
import com.gsc.bm.model.cards.base.piera.DownInOne;
import com.gsc.bm.model.cards.base.piera.LastRound;
import com.gsc.bm.model.cards.base.piera.PointBlankBurp;
import com.gsc.bm.model.cards.base.sergio.GoodOldBlackmail;
import com.gsc.bm.model.cards.base.sergio.SeenThatScript;
import com.gsc.bm.model.cards.base.sergio.bound.LetUsDiscussInPrivate;
import com.gsc.bm.model.cards.base.spazienzio.ThatsEnough;
import com.gsc.bm.model.cards.base.tokens.BrokenBottle;

import java.util.List;

/**
 * SB-34 (D213): the explicit registry of the live Java classes of the Set Base, each with its {@code @CardId}. The loader looks a
 * {@code java: true} card up here first ({@code CardClasses.forId}); no classpath scanning, so the runner works without Spring.
 * {@code WarmBlonde66} (id {@code com.items.RottenBeer}) is a data card in the live set: it is here as the concrete superclass of
 * {@code DiscountDoubleMalt}, and the tests of the 1.x catalogue still instantiate it by id. The abstract {@code Countermove} has no id.
 */
public final class SetBaseClasses {

    public static final List<Class<? extends AbstractCard>> CLASSES = List.of(
            ThatsEnough.class,
            SpeedBoostedReflexes.class,
            DragIntoTheTunnel.class,
            LastRound.class,
            DownInOne.class,
            PointBlankBurp.class,
            Disassemble.class,
            JobWellDone.class,
            LetUsDiscussInPrivate.class,
            GoodOldBlackmail.class,
            SeenThatScript.class,
            LetUsGetUpAndYouGo.class,
            SleightOfHandTheft.class,
            SuddenDash.class,
            GotAnySpareChange.class,
            ExcuseMeSorryCanYouStop.class,
            DiscountDoubleMalt.class,
            LethalMix.class,
            SaintBriacoHolyCard.class,
            BrokenBottle.class,
            WarmBlonde66.class
    );

    private SetBaseClasses() {
    }
}
