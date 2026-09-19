#!/usr/bin/env python3
"""Gera .artifact/index.html: a mesma pagina, porem sem <!doctype>, <html>,
<head> e <body> -- formato exigido pelo publicador de Artifact do Claude.
Os arquivos de assets/ continuam sendo referenciados pelos mesmos caminhos.

Uso:  python3 tools/build-artifact.py
"""
import io, os, re, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGEM = os.path.join(RAIZ, "index.html")
DESTINO = os.path.join(RAIZ, ".artifact", "index.html")

html = io.open(ORIGEM, encoding="utf-8").read()

cabeca = re.search(r"<head>(.*?)</head>", html, re.S)
corpo = re.search(r"<body>(.*?)</body>", html, re.S)
if not cabeca or not corpo:
    sys.exit("index.html precisa ter <head> e <body>.")

# do <head> so vao junto o title e os <link> (charset/viewport ficam com o wrapper)
mantidos = re.findall(r"<title>.*?</title>|<link\b[^>]*>", cabeca.group(1), re.S)

os.makedirs(os.path.dirname(DESTINO), exist_ok=True)
io.open(DESTINO, "w", encoding="utf-8").write(
    "\n".join(l.strip() for l in mantidos) + "\n\n" + corpo.group(1).strip() + "\n"
)
print("gerado:", os.path.relpath(DESTINO, RAIZ), "(%d bytes)" % os.path.getsize(DESTINO))
