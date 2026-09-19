#!/usr/bin/env bash
# Sobe o site em http://localhost:<porta>  (padrão: 5500)
cd "$(dirname "$0")"
PORTA="${1:-5500}"
echo "TL Alto-Falantes rodando em http://localhost:$PORTA"
echo "Para parar: Ctrl+C"
exec python3 -m http.server "$PORTA" --bind 127.0.0.1
