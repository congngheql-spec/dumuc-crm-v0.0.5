import re

with open('components/EmployeeDetailModal.tsx', 'r') as f:
    content = f.read()

# Define the section to move
start_marker = "              {/* Danh mục Văn bằng / Chứng chỉ / CV */}"
end_marker = """              </div>

            </div>
          )}"""

# Find the section
section_start = content.find(start_marker)
section_end = content.find("              </div>\n\n            </div>\n          )}", section_start)

if section_start == -1 or section_end == -1:
    print("Section not found!")
    exit(1)

# The actual section string
section_str = content[section_start:section_end + 20] # include the ending tags of the section
# Actually let's do this more precisely
