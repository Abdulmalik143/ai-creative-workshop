"""Shape Arabic lines with HarfBuzz and export outline + node + handle geometry for the Anatomy cover.
Run with a Python that has fonttools + uharfbuzz. Output coordinates are normalised so each line is 1000 units wide.
"""
import json, sys
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen

FONT = sys.argv[1]
OUT = sys.argv[2]
LINES = ["الذكاء الاصطناعي", "في المجالات الإبداعية"]

tt = TTFont(FONT)
gs = tt.getGlyphSet()
blob = hb.Blob.from_file_path(FONT)
face = hb.Face(blob)
font = hb.Font(face)

result = []
for text in LINES:
    buf = hb.Buffer()
    buf.add_str(text)
    buf.direction = "rtl"; buf.script = "Arab"; buf.language = "ar"
    hb.shape(font, buf, {"kern": True, "liga": True, "calt": True})
    x = 0
    ops = []  # (glyphname, xoff)
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = tt.getGlyphName(info.codepoint)
        ops.append((name, x + pos.x_offset, pos.y_offset))
        x += pos.x_advance
    total = x
    d_parts, nodes, handles, offs = [], [], [], []
    xmin, xmax, ymin, ymax = 1e9, -1e9, 1e9, -1e9
    def P(px, py, ox, oy):
        return (px + ox, py + oy)
    contours = []
    for name, ox, oy in ops:
        pen = RecordingPen()
        gs[name].draw(pen)
        cur = None
        for op, args in pen.value:
            if op == "moveTo":
                p = P(*args[0], ox, oy); cur = p
                contours.append(("M", [p])); nodes.append(p)
            elif op == "lineTo":
                p = P(*args[0], ox, oy); contours.append(("L", [p])); nodes.append(p); cur = p
            elif op == "curveTo":
                c1, c2, p = [P(*a, ox, oy) for a in args]
                contours.append(("C", [c1, c2, p])); nodes.append(p)
                handles.append((cur, c1)); handles.append((p, c2)); offs += [c1, c2]; cur = p
            elif op == "qCurveTo":
                pts = [P(*a, ox, oy) for a in args]
                contours.append(("Q", pts)); nodes.append(pts[-1]); offs += pts[:-1]
                handles += [(cur, pts[0]), (pts[-1], pts[-2])] if len(pts) > 1 else []
                cur = pts[-1]
            elif op == "closePath":
                contours.append(("Z", []))
    allp = [p for k, pts in contours for p in pts]
    xmin = min(p[0] for p in allp); xmax = max(p[0] for p in allp)
    ymin = min(p[1] for p in allp); ymax = max(p[1] for p in allp)
    s = 1000.0 / (xmax - xmin)
    def n(p): return [round((p[0] - xmin) * s, 1), round((ymax - p[1]) * s, 1)]
    d = ""
    for k, pts in contours:
        if k == "Z": d += "Z"
        else: d += k + " ".join(f"{n(p)[0]},{n(p)[1]}" for p in pts)
    result.append({
        "text": text,
        "d": d,
        "nodes": [n(p) for p in nodes],
        "offs": [n(p) for p in offs],
        "handles": [n(a) + n(b) for a, b in handles],
        "w": 1000.0, "rawW": xmax - xmin, "upem": tt["head"].unitsPerEm,
        "h": round((ymax - ymin) * s, 1),
    })
    print(text, "glyphs", len(ops), "nodes", len(nodes), "h/w", round((ymax-ymin)*s/1000, 3))
json.dump(result, open(OUT, "w"), ensure_ascii=False, separators=(",", ":"))
