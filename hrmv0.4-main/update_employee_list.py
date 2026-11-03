with open("components/EmployeeList.tsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '<input type="checkbox" className="rounded border-gray-300 cursor-pointer" />' in line:
        if "border-r border-b" in lines[i-1]: # This is the header
            lines[i] = '                         <input \n                           type="checkbox" \n                           className="rounded border-gray-300 cursor-pointer"\n                           checked={selectedCccds.length === MOCK_EMPLOYEES.length && MOCK_EMPLOYEES.length > 0}\n                           onChange={handleSelectAll} \n                         />\n'
        else: # This is the body
            lines[i] = '                            <input \n                              type="checkbox" \n                              className="rounded border-gray-300 cursor-pointer" \n                              checked={selectedCccds.includes(emp.cccd)}\n                              onChange={() => handleSelect(emp.cccd)}\n                            />\n'
            # Also modify the tr
            tr_idx = i - 2
            if '<tr key={idx}' in lines[tr_idx]:
                lines[tr_idx] = '                      <tr key={idx} className={`hover:bg-blue-50/30 transition-colors ${selectedCccds.includes(emp.cccd) ? \'bg-blue-50/50\' : \'\'}`}>\n'

with open("components/EmployeeList.tsx", "w") as f:
    f.writelines(lines)
print("Updated")
