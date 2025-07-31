docker compose up -d

URL="http://localhost:4200"

if command -v xdg-open > /dev/null; then
  xdg-open "$URL"
elif command -v open > /dev/null; then
  open "$URL"
elif command -v start > /dev/null; then
  start "$URL"
else
  echo "No suitable command found to open the URL."
  exit 1
fi