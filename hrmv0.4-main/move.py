import sys

with open("components/EmployeeDetailModal.tsx", "r") as f:
    lines = f.readlines()

cert_block = lines[214:289]

# Delete from original place
del lines[214:289]

# Now find where to insert. We need to insert after the 'activeTab === 'skills' block.
# Let's find the line with `          )}` which ends the skills block.

insert_idx = -1
for i, line in enumerate(lines):
    if line.strip() == ")}":
        # Check if it's the one ending activeTab === 'skills'
        # The previous lines would contain skills tab content...
        # Since we deleted 75 lines, the index shifted.
        pass

# Let's search for `          )}` after the skills tab.
# After deleting 214:289, the `)}` is at some index.
for i in range(210, len(lines)):
    if line.strip() == ")}":
        # Actually it's just the first `          )}` after 210.
        pass

# Better logic:
# 1. Find `          {activeTab === 'skills' && (`
# 2. Find the matching `          )}`
# 3. Insert `          {activeTab === 'salary' && (\n            <div className="flex-1 overflow-y-auto p-6 bg-[#F4F6F8]">\n` + cert_block + `\n            </div>\n          )}\n`

start_skills = -1
for i, line in enumerate(lines):
    if "activeTab === 'skills'" in line:
        start_skills = i
        break

if start_skills == -1:
    print("Could not find skills block")
    sys.exit(1)

end_skills = -1
# find the next `          )}`
for i in range(start_skills, len(lines)):
    if lines[i].startswith("          )}"):
        end_skills = i
        break

if end_skills == -1:
    print("Could not find end of skills block")
    sys.exit(1)

salary_block = [
    "          {activeTab === 'salary' && (\n",
    "            <div className=\"flex-1 overflow-y-auto p-6 bg-[#F4F6F8]\">\n"
] + cert_block + [
    "            </div>\n",
    "          )}\n"
]

lines = lines[:end_skills + 1] + salary_block + lines[end_skills + 1:]

with open("components/EmployeeDetailModal.tsx", "w") as f:
    f.writelines(lines)

print("Success")
