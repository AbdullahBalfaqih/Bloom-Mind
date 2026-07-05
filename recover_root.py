import json
import re

transcript_path = r"C:\Users\Abdullah\.gemini\antigravity-ide\brain\004688aa-78be-4d85-92ec-eb0d38d4d8fc\.system_generated\logs\transcript_full.jsonl"

layout_content = ""
explore_content = ""

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
        except:
            continue
            
        if step.get("type") == "TOOL_RESPONSE":
            content = step.get("output", step.get("content", ""))
            if "The following code has been modified to include a line number before every line" in content:
                if "src/app/_layout.tsx" in content or "src%2Fapp%2F_layout.tsx" in content:
                    lines_block = content.split("The following code has been modified")[1].split("The above content shows the entire")[0]
                    file_content = []
                    for l in lines_block.split("\n"):
                        if re.match(r"^\d+: ", l):
                            file_content.append(re.sub(r"^\d+: ", "", l))
                    layout_content = "\n".join(file_content)
                elif "src/app/explore.tsx" in content or "src%2Fapp%2Fexplore.tsx" in content:
                    lines_block = content.split("The following code has been modified")[1].split("The above content shows the entire")[0]
                    file_content = []
                    for l in lines_block.split("\n"):
                        if re.match(r"^\d+: ", l):
                            file_content.append(re.sub(r"^\d+: ", "", l))
                    explore_content = "\n".join(file_content)

        elif step.get("type") == "PLANNER_RESPONSE":
            for tool_call in step.get("tool_calls", []):
                if tool_call.get("name") == "write_to_file":
                    args = tool_call.get("args", {})
                    path = args.get("TargetFile", "")
                    code = args.get("CodeContent", "")
                    if "src\\app\\_layout.tsx" in path or "src/app/_layout.tsx" in path:
                        layout_content = code
                    elif "src\\app\\explore.tsx" in path or "src/app/explore.tsx" in path:
                        explore_content = code

if layout_content:
    with open(r"c:\Users\Abdullah\Desktop\AI Agents Hackathons\Raise Summit\src\app\_layout.tsx", "w", encoding="utf-8") as f:
        f.write(layout_content)
    print("Recovered root _layout.tsx")
else:
    print("Could not find _layout.tsx")

if explore_content:
    with open(r"c:\Users\Abdullah\Desktop\AI Agents Hackathons\Raise Summit\src\app\explore.tsx", "w", encoding="utf-8") as f:
        f.write(explore_content)
    print("Recovered explore.tsx")
else:
    print("Could not find explore.tsx")
