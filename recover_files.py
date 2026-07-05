import json
import re
import os
import urllib.parse

transcript_path = r"C:\Users\Abdullah\.gemini\antigravity-ide\brain\004688aa-78be-4d85-92ec-eb0d38d4d8fc\.system_generated\logs\transcript_full.jsonl"
recovery_dir = r"c:\Users\Abdullah\Desktop\AI Agents Hackathons\Raise Summit\src\app"

files = {}

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
        except:
            continue
            
        if step.get("type") == "TOOL_RESPONSE":
            content = step.get("output", step.get("content", ""))
            if "The following code has been modified to include a line number before every line" in content:
                match = re.search(r"File Path: `file:///([^`]+)`", content)
                if match:
                    path = urllib.parse.unquote(match.group(1)).replace("/", "\\")
                    if path.startswith("c:\\"):
                        path = path.capitalize()
                    
                    lines_block = content.split("The following code has been modified")[1].split("The above content shows the entire")[0]
                    file_content = []
                    for l in lines_block.split("\n"):
                        if re.match(r"^\d+: ", l):
                            file_content.append(re.sub(r"^\d+: ", "", l))
                    files[path] = "\n".join(file_content)

        elif step.get("type") == "PLANNER_RESPONSE":
            for tool_call in step.get("tool_calls", []):
                if tool_call.get("name") == "write_to_file":
                    args = tool_call.get("args", {})
                    path = args.get("TargetFile", "").strip('"').replace("/", "\\")
                    code = args.get("CodeContent", "")
                    files[path] = code

for path, content in files.items():
    if "Raise Summit\\src\\app" in path and path.endswith(".tsx"):
        try:
            with open(path, "w", encoding="utf-8") as out_f:
                out_f.write(content)
            print(f"Recovered {path}")
        except Exception as e:
            print(f"Error writing {path}: {e}")
