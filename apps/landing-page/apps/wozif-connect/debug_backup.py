
import sys

path = "/Users/koffiyohanerickouakou/wozif/apps/wozif-connect/app/automations/new/page.tsx"
with open(path, 'r') as f:
    content = f.read()

# Fix the first error around line 4756
target1 = """                                               })}
                                              )
                                         )}
                                             </div>
                                       </div>
                                         ) : (
                                         <div className="h-full flex flex-col">"""

# Flexible matching for the broken parts
import re
pattern1 = r'\}\)\s*\}\)\s*\)\s*\}\)\s*\}\s*\}\s*\) : \('

# Actually, let's just use the absolute backup file and fix IT before writing to the target.
backup_path = "/Users/koffiyohanerickouakou/Library/Application Support/Antigravity/User/History/-3e04c9e6/i55F.tsx"
with open(backup_path, 'r') as f:
    backup_content = f.read()

# Let's find common patterns in the backup that are broken.
# In the backup, let's check lines near 4756
lines = backup_content.splitlines()
# Print lines around 4756 of the backup to see what's wrong there originally
for i in range(4750, 4770):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}")

# Also around 4790
for i in range(4790, 4805):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}")
