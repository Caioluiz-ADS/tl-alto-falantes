# TL Alto-Falantes — site + catálogo

Site estático (HTML, CSS e JS puro, sem build e sem dependências).

## Abrir no VS Code

```bash
code "/home/caioluiz/Área de trabalho/tl-alto-falantes"
```

## Rodar na porta 5500

Três jeitos, todos servindo em **http://localhost:5500** :

1. **Automático** — ao abrir a pasta no VS Code, a task `Servidor do site (porta 5500)` sobe sozinha.
   Se preferir rodar na mão: `Ctrl+Shift+B`.
2. **Live Server** (extensão `ritwickdey.liveserver`, já recomendada na pasta) — botão **Go Live** na barra
   de status. A porta 5500 e o recarregamento automático ao salvar já vêm configurados em `.vscode/settings.json`.
3. **Terminal**:

```bash
./servidor.sh
```

Para outra porta: `./servidor.sh 3000`.

Depurar no Chrome com breakpoints: aba *Run and Debug* → **Abrir site no Chrome (porta 5500)** (F5).

## Estrutura

```
index.html              página (marcação)
assets/styles.css       design system: cores, tipografia, componentes
assets/app.js           catálogo (dados + filtros + modal + SVG dos alto-falantes)
assets/explode3d.js     visualizador 3D da vista explodida (renderizador próprio, sem libs)
servidor.sh             servidor local em python
tools/build-artifact.py gera .artifact/index.html para publicar como Artifact
.vscode/                tasks, debug e Live Server na porta 5500
```

## Editar o catálogo

Todos os produtos ficam no array `PRODUTOS`, no topo de `assets/app.js`:

```js
{ id:"ak47-6k-15", nome:"AK 47 6K", cat:"sub", pol:15, rms:3000, ohms:"2 + 2 Ω",
  bobina:'4"', sens:"94 dB", resp:"25 Hz – 1.2 kHz", ima:"Ferrite 260 mm",
  cor:"#F4F6FA", tag:"Carro-chefe", real:true,
  desc:"...", apps:["Competição","Som de rua"] }
```

- `cat`: `sub` | `medio` | `driver` | `tweeter` | `kit` (as categorias ficam em `CATEGORIAS`)
- `cor`: cor do cone na ilustração vetorial
- `tag`: selo do card (deixe `""` para nenhum)
- `real`: `true` = dado confirmado; `false` exibe o aviso de "especificação de exemplo"

## Editar o modelo 3D

As peças ficam no array `PECAS`, no topo de `assets/explode3d.js`. Cada peça é um sólido de revolução:
`perfis` é a silhueta em coordenadas `[raio, altura]` que gira em torno do eixo central.

```js
{ nome:"Bobina", cor:[201,131,43], metal:true, desc:"...",
  perfis:[[[36,22],[40,22],[40,-32],[36,-32],[36,22]]] }
```

- `cor`: RGB base, antes da iluminação
- `metal`: liga o brilho especular
- `CENTRO`: índice da peça que fica parada quando as outras se afastam
- `VAO`: distância entre as peças na vista explodida

Telefones e links do WhatsApp: constante `WA_FABRICA` em `assets/app.js` e os `href` no `index.html`.

## Publicar a versão do Artifact

```bash
python3 tools/build-artifact.py
```

Gera `.artifact/index.html` (mesma página sem as tags `html`/`head`/`body`), que é o arquivo enviado ao
Artifact junto com `assets/`.

## Atenção ao conteúdo

Só o **AK 47 6K** (15", 3000 RMS), o **TL 500 PRO** (10", 500 RMS, 8 Ω) e os contatos vieram do Instagram
oficial. Os demais modelos e especificações são exemplos — substitua pelos dados reais antes de colocar no ar.
