import re

file_path = r"d:\IE106\app\globals.css"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace colors to make them darker
content = content.replace("#231E32", "#120E18")
content = content.replace("#2E2741", "#1C1626")
content = content.replace("#393150", "#271F36")
content = content.replace("#443B5F", "#322846")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
