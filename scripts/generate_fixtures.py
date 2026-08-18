"""Thin JSON-output wrapper around the validated poker_math.py — does not
modify that file. Two outputs:

1. Layer 1.5 fixture: 100,000 random 5-card hands, fixed seed, each hand's
   raw evaluate_5() tuple serialized as a plain JSON array preserving its
   exact variable length (no padding, no re-encoding) — see plan Verification
   section on why the wrapper must not normalize the tiebreaker shape.
2. Layer 2 fixture: equity/outs/range scenarios from the __main__ block,
   run once and dumped as JSON for the TS statistical-parity tests to
   compare against at their own (higher, noise-reducing) trial count.
"""
import json
import random
import sys
from pathlib import Path

sys.path.insert(0, "/media/brice/TradingData/poker-helper")
from poker_math import (  # noqa: E402
    DECK,
    calculate_equity,
    calculate_equity_multiway,
    calculate_equity_vs_range,
    count_outs,
    evaluate_5,
    outs_to_equity_rule,
    parse_range,
)

OUT_DIR = Path(__file__).resolve().parent.parent / "test" / "fixtures"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def gen_evaluator_fixture(n: int = 100_000, seed: int = 12345) -> None:
    rng = random.Random(seed)
    cases = []
    for _ in range(n):
        hand = rng.sample(DECK, 5)
        score = list(evaluate_5(hand))  # plain list, exact variable length preserved
        cases.append({"hand": hand, "score": score})
    with open(OUT_DIR / "evaluator_100k.json", "w") as f:
        json.dump(cases, f)
    print(f"Wrote {len(cases)} evaluator cases -> {OUT_DIR / 'evaluator_100k.json'}")


def gen_statistical_fixture() -> None:
    fixture = {}

    benchmarks = [
        (["Ah", "As"], ["Kh", "Ks"], "aa_vs_kk"),
        (["Ah", "Kh"], ["Qs", "Qd"], "aks_vs_qq"),
        (["7h", "2c"], ["Ah", "As"], "72o_vs_aa"),
        (["As", "Ks"], ["Qd", "Jd"], "aks_vs_qjs"),
    ]
    fixture["heads_up_known"] = {}
    for hero, villain, key in benchmarks:
        r = calculate_equity(hero, [], num_villains=1, villain_known=villain, trials=50000, seed=42)
        fixture["heads_up_known"][key] = {"win": r.win, "tie": r.tie, "lose": r.lose, "equity": r.equity}

    fixture["range_vs_range"] = {}
    ako_vs_qqplus = calculate_equity_vs_range(["Ah", "Ks"], [], "QQ+", trials=50000, seed=7)
    fixture["range_vs_range"]["ako_vs_qqplus"] = ako_vs_qqplus.equity

    wide = calculate_equity_vs_range(
        ["Ah", "Ks"], [], "22+,A2s+,K2s+,Q2s+,J2s+,A2o+,K9o+", trials=50000, seed=7
    )
    narrow = calculate_equity_vs_range(["Ah", "Ks"], [], "QQ+", trials=50000, seed=7)
    fixture["range_vs_range"]["wide_equity"] = wide.equity
    fixture["range_vs_range"]["narrow_equity"] = narrow.equity

    postflop = calculate_equity_vs_range(
        ["Ah", "Kd"], ["Ac", "7h", "2s"], "22+,AJs+,AQo+", trials=50000, seed=7
    )
    fixture["range_vs_range"]["postflop_tptk"] = postflop.equity

    fixture["multiway_dilution"] = {}
    heads_up = calculate_equity_multiway(["Ah", "As"], [], [["Kh", "Ks"]], trials=50000, seed=3)
    three_way = calculate_equity_multiway(
        ["Ah", "As"], [], [["Kh", "Ks"], ["Qd", "Qc"]], trials=50000, seed=3
    )
    four_way = calculate_equity_multiway(
        ["Ah", "As"], [], [["Kh", "Ks"], ["Qd", "Qc"], ["Jd", "Jc"]], trials=50000, seed=3
    )
    fixture["multiway_dilution"]["heads_up"] = heads_up.equity
    fixture["multiway_dilution"]["three_way"] = three_way.equity
    fixture["multiway_dilution"]["four_way"] = four_way.equity

    utg_open = "TT+,AQs+,AKo"
    bb_call = "22+,A2s+,K9s+,QTs+,JTs,ATo+,KJo+"
    rvr = calculate_equity_multiway(utg_open, [], [bb_call], trials=50000, seed=11)
    fixture["range_vs_range_preflop"] = rvr.equity

    hero_fd = ["Ah", "Kh"]
    flop_fd = ["2h", "7h", "9c"]
    villain_aa = ["Ad", "Ac"]
    villain_kk = ["Ks", "Kd"]
    outs_vs_aa = count_outs(hero_fd, flop_fd, villain_aa)
    outs_vs_kk = count_outs(hero_fd, flop_fd, villain_kk)
    fixture["outs"] = {
        "vs_aa": outs_vs_aa,
        "vs_kk": outs_vs_kk,
        "rule_of_4_flop": outs_to_equity_rule(outs_vs_aa, cards_to_come=2),
        "rule_of_2_turn": outs_to_equity_rule(outs_vs_aa, cards_to_come=1),
    }
    mc_flop = calculate_equity_multiway(hero_fd, flop_fd, [villain_aa], trials=50000, seed=9)
    fixture["outs"]["mc_flop_equity"] = mc_flop.equity

    mixed = calculate_equity_multiway(["Ah", "Ks"], [], ["QQ+", None], trials=50000, seed=5)
    no_extra = calculate_equity_multiway(["Ah", "Ks"], [], ["QQ+"], trials=50000, seed=5)
    fixture["mixed_spec"] = {"with_extra_villain": mixed.equity, "no_extra_villain": no_extra.equity}

    river_board = ["Ah", "Kd", "9c", "4h", "2s"]
    river = calculate_equity_multiway(["As", "Ks"], river_board, [["Qd", "Qc"]], trials=500, seed=1)
    fixture["river"] = {"win": river.win, "tie": river.tie, "lose": river.lose}

    chop_board = ["As", "Ks", "Qs", "Jd", "Th"]
    chop = calculate_equity_multiway(["2c", "3d"], chop_board, [["4h", "5c"]], trials=500, seed=1)
    fixture["chop"] = {"win": chop.win, "tie": chop.tie, "lose": chop.lose}

    fixture["range_combo_counts"] = {
        "AA": len(parse_range("AA")),
        "22+": len(parse_range("22+")),
        "AKs": len(parse_range("AKs")),
        "AKo": len(parse_range("AKo")),
        "ATs+": len(parse_range("ATs+")),
        "QQ+,AKs,AKo": len(parse_range("QQ+,AKs,AKo")),
        "AA+": len(parse_range("AA+")),
    }

    with open(OUT_DIR / "statistical_fixture.json", "w") as f:
        json.dump(fixture, f, indent=2)
    print(f"Wrote statistical fixture -> {OUT_DIR / 'statistical_fixture.json'}")


if __name__ == "__main__":
    gen_evaluator_fixture()
    gen_statistical_fixture()
