
import os

backup_path = "/Users/koffiyohanerickouakou/Library/Application Support/Antigravity/User/History/-3e04c9e6/i55F.tsx"
target_path = "/Users/koffiyohanerickouakou/wozif/apps/wozif-connect/app/automations/new/page.tsx"

with open(backup_path, 'r') as f:
    lines = f.readlines()

# Fix line 4756: )} -> )
lines[4755] = lines[4755].replace(")}", ")")

# Fix line 4792: )} -> )
lines[4791] = lines[4791].replace(")}", ")")

# Insert missing closing div for 4760 before 4792 (which is now line 4792 after change)
# Wait, let's just use line indices carefully.
# In the original lines list:
# 4790: </div> (closes 4774)
# 4792: )} (closes 4768 ternary)
# We need to close 4760 before closing 4768 ternary.
# Actually, 4760 starts AFTER the ternary? No, 4760 starts BEFORE.
# 4759: ) : (
# 4760: <div ...h-full...
# 4768: {Object.keys... ? ( ...

# So 4760's </div> should be AFTER the 4768 ternary closes.
# Ternary 4768 closes with ) on 4792.
# So 4793 should be </div> (for 4760).
# Then 4794 should be </div> (for 4722).
# Then we close the outer ternary 4723 with )} .

# Let's rebuild the closing block:
closing_block = [
    "                                              </div>\n", # closes 4760
    "                                            )\n",          # closes 4723 outer ternary
    "                                          )}\n",         # Wait, ternary started with { ?
]

# Let's just do a clean replacement of this whole section.
# I'll replace lines from 4791 to 4796.
new_closing = [
    "                                              </div>\n", # for 4774
    "                                            </div>\n",   # for 4760
    "                                          )\n",          # closes 4768 inner ternary
    "                                        )}\n",           # closes 4723 outer ternary
    "                                      </div>\n",         # for 4722
    "                                    </motion.div>\n",    # for 4672
    "                                  )}\n"                  # for 4671
]

# Let's just overwrite the whole bottom panel section to be sure.
# I'll use a more direct approach: find patterns.

content = "".join(lines)

# Fix 4756 area
content = content.replace(
    "                                          )}\n                                        </div>\n                                      </div>\n                                    ) : (",
    "                                          )\n                                        )}\n                                      </div>\n                                    </div>\n                                  ) : ("
)

# Fix 4792 area
# Wait, let's just use string replace for the whole section 
# from the div at 4722 to the motion.div at 4795.

with open(target_path, 'w') as f:
    f.write(content)

print("File patched via python")
