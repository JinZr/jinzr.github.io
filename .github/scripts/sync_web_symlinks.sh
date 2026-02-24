#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
build_dir="$repo_root/flutter_io_page/build/web"

if [[ ! -d "$build_dir" ]]; then
  echo "Missing build output directory: $build_dir" >&2
  exit 1
fi

# Build output currently contains .last_build_id, which should not be published.
should_manage_entry() {
  local name="$1"

  case "$name" in
    .|..)
      return 1
      ;;
    .*)
      [[ "$name" == ".nojekyll" ]]
      return
      ;;
    *)
      return 0
      ;;
  esac
}

contains_name() {
  local needle="$1"
  shift

  local item
  for item in "$@"; do
    if [[ "$item" == "$needle" ]]; then
      return 0
    fi
  done

  return 1
}

declare -a desired_entries=()
while IFS= read -r name; do
  [[ -z "$name" ]] && continue

  if should_manage_entry "$name"; then
    desired_entries+=("$name")
  fi
done < <(find "$build_dir" -mindepth 1 -maxdepth 1 -exec basename "{}" \; | LC_ALL=C sort)

for name in "${desired_entries[@]}"; do
  target="flutter_io_page/build/web/$name"
  link_path="$repo_root/$name"

  if [[ -L "$link_path" ]]; then
    current_target="$(readlink "$link_path")"
    if [[ "$current_target" == "$target" || "$current_target" == "./$target" ]]; then
      continue
    fi

    ln -sfn "$target" "$link_path"
    echo "Updated symlink: $name -> $target"
    continue
  fi

  if [[ -e "$link_path" ]]; then
    echo "Skipping existing non-symlink path: $name" >&2
    continue
  fi

  ln -s "$target" "$link_path"
  echo "Created symlink: $name -> $target"
done

while IFS= read -r link_path; do
  name="$(basename "$link_path")"
  target="$(readlink "$link_path")"

  normalized_target="${target#./}"
  case "$normalized_target" in
    flutter_io_page/build/web/*)
      linked_name="${normalized_target#flutter_io_page/build/web/}"

      if ! should_manage_entry "$linked_name"; then
        rm "$link_path"
        echo "Removed unmanaged symlink: $name"
        continue
      fi

      if [[ "$name" != "$linked_name" ]] || ! contains_name "$name" "${desired_entries[@]}"; then
        rm "$link_path"
        echo "Removed stale symlink: $name"
      fi
      ;;
  esac
done < <(find "$repo_root" -mindepth 1 -maxdepth 1 -type l | LC_ALL=C sort)
