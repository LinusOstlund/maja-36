#!/usr/bin/env python3
"""
Export YAML data to JSON for frontend consumption.

This script reads the birthday_data.yaml file and converts it to JSON format
for the web frontend to load. Part of the YAML → JSON data pipeline.
"""

import yaml
import json
from pathlib import Path


def export_yaml_to_json():
    """Convert YAML data file to JSON for web consumption."""
    # Define paths relative to script location
    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    yaml_file = project_root / 'data' / 'raw' / 'birthday_data.yaml'
    json_file = project_root / 'web' / 'data' / 'birthday_data.json'

    # Ensure output directory exists
    json_file.parent.mkdir(parents=True, exist_ok=True)

    # Load YAML
    print(f"📖 Reading {yaml_file}...")
    with open(yaml_file, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    # Write JSON (pretty-printed for debugging)
    print(f"✍️  Writing {json_file}...")
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✅ Successfully exported {yaml_file.name} → {json_file.name}")
    print(f"   {len(data.get('slides', []))} slides processed")


if __name__ == '__main__':
    export_yaml_to_json()
