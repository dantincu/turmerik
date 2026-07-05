"""
Merge Desert Sand colors into a Visual Studio .vstheme file.

Usage:
    python merge_vstheme_colors.py <base.vstheme> <chrome-colors.json> <output.vstheme>

The base .vstheme must come from Visual Studio itself (VSIX Project > Add New Item >
Custom Theme) so its Category/Color GUIDs are valid. This script only rewrites the
Background/Foreground "Source" hex values of <Color Name="..."> elements whose Name
matches an entry in chrome-colors.json — it never invents or removes GUIDs.

After running, it prints which mapping entries were found (applied) and which were
not found in the base file (so the mapping can be corrected against your actual VS
version instead of guessed).
"""
import json
import sys
import xml.etree.ElementTree as ET


def hex_to_source(hex_color: str) -> str:
    h = hex_color.lstrip("#").upper()
    if len(h) == 6:
        h = "FF" + h  # vstheme Source values are ARGB
    return h


def main():
    if len(sys.argv) != 4:
        print(__doc__)
        sys.exit(1)

    base_path, colors_path, out_path = sys.argv[1:4]

    tree = ET.parse(base_path)
    root = tree.getroot()

    with open(colors_path, "r", encoding="utf-8") as f:
        mapping = json.load(f)["colors"]

    applied = []
    missing = set(mapping.keys())

    for color_el in root.iter("Color"):
        name = color_el.get("Name")
        if name not in mapping:
            continue
        spec = mapping[name]
        changed = False
        if "background" in spec:
            bg = color_el.find("Background")
            if bg is not None:
                bg.set("Source", hex_to_source(spec["background"]))
                changed = True
        if "foreground" in spec:
            fg = color_el.find("Foreground")
            if fg is not None:
                fg.set("Source", hex_to_source(spec["foreground"]))
                changed = True
        if changed:
            applied.append(name)
            missing.discard(name)

    tree.write(out_path, encoding="utf-8", xml_declaration=True)

    print(f"Applied {len(applied)} color(s):")
    for name in sorted(applied):
        print(f"  + {name}")

    if missing:
        print(f"\n{len(missing)} mapping entry(ies) not found in {base_path}:")
        for name in sorted(missing):
            print(f"  - {name}")
        print(
            "\nThese names may not exist in your VS version, or may need a different "
            "spelling. Share the base .vstheme's Color Name list and the mapping can "
            "be corrected precisely."
        )

    print(f"\nWrote {out_path}")


if __name__ == "__main__":
    main()
