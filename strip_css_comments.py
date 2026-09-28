"""Remove commented-out CSS code from vis-layout.css (declarations and whole rules).
Keeps real comments (section headers, explanations). Run from the repo root, then review with `git diff`.
Usage: python3 strip_css_comments.py assets/css/vis-layout.css
"""
import re, sys
path = sys.argv[1]
s = open(path, encoding="utf-8").read()

def is_code(body):
    # a comment counts as "code" if it holds a declaration (prop: value;) or a rule block ({ })
    return bool(re.search(r"[\w-]+\s*:\s*[^;]+;", body)) or "{" in body

removed = []
def repl(m):
    if is_code(m.group(1)):
        line = s.count("\n", 0, m.start()) + 1
        removed.append((line, " ".join(m.group(1).split())[:70]))
        return ""
    return m.group(0)

out = re.sub(r"[ \t]*/\*(.*?)\*/[ \t]*\n?", repl, s, flags=re.S)
open(path, "w", encoding="utf-8").write(out)
print(f"removed {len(removed)} commented-out code chunks:")
for line, text in removed:
    print(f"  line {line}: {text}")
