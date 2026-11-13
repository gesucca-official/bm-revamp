package com.gsc.bm.model;

import com.gsc.bm.model.cards.Card;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.Timer;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import com.gsc.bm.model.game.status.Vulnerability;
import com.gsc.bm.service.factories.CardFactoryService;
import lombok.AccessLevel;
import lombok.Getter;
import org.apache.commons.collections4.queue.CircularFifoQueue;

import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;

@Getter
public abstract class Character implements Serializable {

    private final String bindingName;

    private final int itemsSize;
    private final Queue<Card> items;

    private final Map<Resource, Integer> resources = new EnumMap<>(Resource.class);
    private final List<Status> statuses = new ArrayList<>();
    private final Set<Resource> immunities = new HashSet<>();
    private final Set<Timer> timers = new LinkedHashSet<>();

    /** SB-16c: the rules of the match this character plays, set by {@link com.gsc.bm.model.game.Game#useRuleset}. */
    @Getter(AccessLevel.NONE)
    @JsonIgnore
    private Ruleset ruleset = Ruleset.LIVE;
    /** SB-16c: the card a search step asked for in the move being resolved (D50, point 6), or null. */
    @Getter(AccessLevel.NONE)
    @JsonIgnore
    private String requestedSearch;

    public void useRuleset(Ruleset ruleset) { this.ruleset = Objects.requireNonNull(ruleset); }

    @JsonIgnore
    public Ruleset ruleset() { return ruleset; }

    /** A search step asks to replace the draw that follows this move (D50, point 6). */
    public void requestSearch(String binding) { this.requestedSearch = binding; }

    /** The search asked for by the move just resolved, cleared. */
    public String takeRequestedSearch() {
        String requested = requestedSearch;
        requestedSearch = null;
        return requested;
    }

    /** SB-16g 2a: the vulnerability the search step of the move being resolved gives its author (D64, D69), or null. */
    @Getter(AccessLevel.NONE)
    @JsonIgnore
    private Vulnerability requestedVulnerability;

    /** SB-16g 2a: a search step with a vulnerability (D64, D69): the engine applies it after the move, with the playground rules. */
    public void requestVulnerability(Vulnerability vulnerability) { this.requestedVulnerability = vulnerability; }

    /** The vulnerability asked for by the move just resolved, cleared. */
    public Vulnerability takeRequestedVulnerability() {
        Vulnerability requested = requestedVulnerability;
        requestedVulnerability = null;
        return requested;
    }

    public Character(int hp, int speed, int itemsSize) {
        this(null, hp, speed, itemsSize);
    }

    /** With an explicit binding name, for characters described as data (set-base plan SB-6a, test sources only). */
    protected Character(String bindingName, int hp, int speed, int itemsSize) {
        this.bindingName = bindingName != null ? bindingName
                : this.getClass().getName().replace(CardFactoryService.BASE_CARDS_PKG, "");
        this.itemsSize = itemsSize;
        this.items = new CircularFifoQueue<>(itemsSize);
        // Regulation 1.11 R01: every character has all five resources; those its sheet does not state start at 0.
        for (Resource resource : Resource.values())
            this.resources.put(resource, 0);
        this.resources.put(Resource.HEALTH, hp);
        this.resources.put(Resource.ALERTNESS, speed);
    }

    public List<String> resolveTimeBasedEffects() {
        List<String> effectsReport = new ArrayList<>();

        // resources based effect
        if (!immunities.contains(Resource.TOXICITY) && resources.get(Resource.TOXICITY) != null && resources.get(Resource.TOXICITY) > 0)
            effectsReport.add("(TOXICITY effect) " +
                    takeDamage(new Damage(Damage.DamageType.POISON, resources.get(Resource.TOXICITY) / 2)));

        if (!immunities.contains(Resource.ALCOHOL) && resources.get(Resource.ALCOHOL) != null && resources.get(Resource.ALCOHOL) > 0) {
            effectsReport.add("(ALCOHOL effect) " +
                    loseResource(Resource.ALERTNESS, resources.get(Resource.ALCOHOL) / 2));
            effectsReport.add("(ALCOHOL effect) " +
                    loseResource(Resource.ALCOHOL, resources.get(Resource.ALCOHOL) / 2 + 1));
        }

        // resolve timers
        Set<Timer> expiredTimers = new HashSet<>();
        timers.forEach(timer -> {
            timer.timeTick();
            if (timer.getTimer() <= 0) {
                timer.getCallback().accept(this);
                // TODO capture output of callback to report
                effectsReport.add("Timer expired for " + timer.getName() + ": effect triggered");
                expiredTimers.add(timer);
            }
        });
        timers.removeAll(expiredTimers);

        // clear statuses
        List<Status> expiredStatuses = new ArrayList<>();  // concurrent access problem with foreach
        for (Status status : statuses) {
            status.aTurnIsPassed();
            if (status.getLastsForTurns() != null && status.getLastsForTurns() < 0)
                expiredStatuses.add(status);
        }
        statuses.removeAll(expiredStatuses);
        effectsReport.addAll(expiredStatuses.stream().map(s -> "Cleared out of " + s.getName() + " status").collect(Collectors.toList()));

        return effectsReport;
    }

    // by default always apply statuses
    public String inflictDamage(Character target, Damage damage) {
        return inflictDamage(target, damage, Status.ALL);
    }

    public String inflictDamage(Character target, Damage damage, Set<StatusType> statusToBeApplied) {
        return target.takeDamage(
                applyStatusToDamage(damage, statusToBeApplied, StatusFlow.OUTPUT),
                Status.invertViewPoint(statusToBeApplied)
        );
    }

    public String takeDamage(Damage damage) {
        return takeDamage(damage, Status.ALL);
    }

    public String takeDamage(Damage damage, Set<StatusType> statusToBeApplied) {
        Damage received = applyStatusToDamage(damage, statusToBeApplied, StatusFlow.INPUT);
        int absorbed = 0;
        // D50, point 5 (playground only): ALCOHOL reduces HIT received by L/4, after statuses, not below zero; not CUT or POISON.
        if (ruleset.playground() && received.getType() == Damage.DamageType.HIT && resources.get(Resource.ALCOHOL) > 0) {
            int reduced = Math.max(0, received.getAmount() - resources.get(Resource.ALCOHOL) / Ruleset.ALCOHOL_ARMOR_DIVISOR);
            absorbed = Math.max(0, received.getAmount() - reduced);
            received.setAmount(reduced);
        }
        String line = loseResource(Resource.HEALTH, received.getAmount(), statusToBeApplied);
        return absorbed > 0 ? line + " (ALCOHOL armor: -" + absorbed + " HIT)" : line;
    }

    public String gainResource(Resource res, int amount) {
        return editResource(res, Math.abs(amount), Status.ALL);
    }

    public String loseResource(Resource res, int amount) {
        return editResource(res, -Math.abs(amount), Status.ALL);
    }

    public String loseResource(Resource res, int amount, Set<StatusType> toBeApplied) {
        return editResource(res, -Math.abs(amount), toBeApplied);
    }

    public String emptyResource(Resource res) {
        resources.putIfAbsent(res, 0);
        return editResource(res, -getResources().get(res), Set.of());
    }

    public boolean isDead() {
        return resources.get(Resource.HEALTH) <= 0;
    }

    // algebraic sum
    private String editResource(Resource res, int amount, Set<StatusType> toBeApplied) {
        resources.putIfAbsent(res, 0);
        int originalAmount = resources.get(res);
        int changed = resources.get(res) + applyStatusToResourceChange(res, amount, toBeApplied);
        // D50, point 3 (playground only): no resource goes below zero, HEALTH included.
        getResources().put(res, ruleset.playground() ? Math.max(0, changed) : changed);
        return res + ": " + originalAmount + "->" + resources.get(res) + " (" + (resources.get(res) - originalAmount) + ")";
    }

    private Damage applyStatusToDamage(Damage damage, Set<StatusType> toBeApplied, StatusFlow flow) {
        for (Status s : statuses)
            if (s.getImpactedProperty() instanceof Damage.DamageType
                    && damage.getType() == s.getImpactedProperty()
                    && toBeApplied.contains(s.getType())
                    && flow == s.getFlow()
            ) {
                damage.setType((Damage.DamageType) s.getTypeFunction().apply(damage.getType()));
                damage.setAmount(s.getAmountFunction().apply((float) damage.getAmount()).intValue());
                if (s.isSingleUse())
                    s.expended();
            }
        return damage;
    }

    private int applyStatusToResourceChange(Resource res, int amount, Set<StatusType> toBeApplied) {
        for (Status status : statuses)
            if (status.getImpactedProperty() == res && toBeApplied.contains(status.getType())) {
                if (status.isSingleUse())
                    status.expended();
                return status.getAmountFunction().apply((float) amount).intValue();
            }
        return amount;
    }
}
