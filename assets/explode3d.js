/* ──────────────────────────────────────────────────────────────
   Vista explodida 3D do alto-falante — renderizador próprio em
   canvas 2D, sem biblioteca externa.

   Cada peça é um sólido de revolução: um perfil (r, y) girado em
   torno do eixo Y vira uma malha de quadriláteros. A cada quadro
   os vértices são rotacionados, projetados em perspectiva,
   ordenados por profundidade (algoritmo do pintor) e pintados com
   iluminação difusa + luz de contorno vermelha.
   ────────────────────────────────────────────────────────────── */
(function () {
    "use strict";

    var canvas = document.getElementById("viewer3d");
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext("2d", { alpha: true });
    var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── 1. as peças ─────────────────────────────────────────── */
    var PECAS = [
        {
            nome: "Calota central",
            cor: [255, 26, 60], metal: false,
            desc: "Fecha o centro do conjunto e barra poeira e sujeira. É nela que vai a marca TL.",
            perfis: [[[0, 21], [13, 20], [24, 17], [33, 11], [38, 1], [38, -2]]]
        },
        {
            nome: "Cone",
            cor: [26, 26, 32], metal: false,
            desc: "A superfície que empurra o ar. Rigidez alta para não deformar no volume máximo — é o que mantém o grave seco.",
            perfis: [[[36, 3], [70, 13], [105, 23], [140, 33], [151, 37], [151, 33]]]
        },
        {
            nome: "Suspensão",
            cor: [16, 16, 20], metal: false,
            desc: "A borda que devolve o cone ao lugar a cada ciclo. Define a excursão e protege o conjunto nos picos.",
            perfis: [[[149, 34], [156, 46], [166, 51], [176, 46], [183, 34], [183, 31]]]
        },
        {
            nome: "Carcaça",
            cor: [198, 202, 210], metal: true,
            desc: "A estrutura que sustenta tudo e leva o calor para fora. Nas linhas de competição, alumínio injetado.",
            perfis: [[[190, 31], [190, 21], [176, 19], [140, -9], [100, -37], [70, -59], [58, -65], [58, -69]]]
        },
        {
            nome: "Aranha",
            cor: [142, 18, 32], metal: false,
            desc: "Centraliza a bobina e controla o curso. É ela que segura o conjunto no eixo quando o módulo entrega 3000 RMS.",
            perfis: [[[44, 7], [58, 16], [72, 8], [88, 18], [104, 10], [118, 20], [131, 13]]]
        },
        {
            nome: "Bobina",
            cor: [201, 131, 43], metal: true,
            desc: "Fio esmaltado enrolado no fôrma: onde a potência vira movimento. 4 polegadas na AK 47 6K.",
            perfis: [[[36, 22], [40, 22], [40, -32], [36, -32], [36, 22]]]
        },
        {
            nome: "Placa superior",
            cor: [154, 160, 170], metal: true,
            desc: "Concentra o campo magnético no entreferro, exatamente onde a bobina trabalha.",
            perfis: [[[42, 11], [95, 11], [95, -3], [42, -3], [42, 11]]]
        },
        {
            nome: "Ímã",
            cor: [35, 35, 43], metal: false,
            desc: "Ferrite de 260 mm na AK 47 6K. É a força bruta que move todo o conjunto.",
            perfis: [[[46, 0], [100, 0], [100, -34], [46, -34], [46, 0]]]
        },
        {
            nome: "Placa inferior e pólo",
            cor: [154, 160, 170], metal: true,
            desc: "Fecha o circuito magnético e conduz o calor para fora do motor.",
            perfis: [
                [[0, 0], [95, 0], [95, -15], [0, -15]],
                [[0, 44], [37, 44], [37, 0]]
            ]
        }
    ];

    var CENTRO = 4;        // peça que fica parada quando explode
    var VAO = 52;          // distância entre peças na vista explodida

    /* ── 2. malha: perfis girados em torno de Y ──────────────── */
    var SEG = window.innerWidth < 760 ? 34 : 44;
    var verts = [], faces = [];

    PECAS.forEach(function (peca, pi) {
        peca.faces = [];
        peca.inicio = verts.length / 3;
        peca.perfis.forEach(function (perfil) {
            var base = [];
            for (var s = 0; s < SEG; s++) {
                var a = (s / SEG) * Math.PI * 2, cos = Math.cos(a), sin = Math.sin(a);
                for (var k = 0; k < perfil.length; k++) {
                    base.push(verts.length / 3);
                    verts.push(perfil[k][0] * cos, perfil[k][1], perfil[k][0] * sin);
                }
            }
            for (var s2 = 0; s2 < SEG; s2++) {
                var col = s2 * perfil.length, prox = ((s2 + 1) % SEG) * perfil.length;
                for (var k2 = 0; k2 < perfil.length - 1; k2++) {
                    var f = [base[col + k2], base[col + k2 + 1], base[prox + k2 + 1], base[prox + k2], pi];
                    faces.push(f);
                    peca.faces.push(f);
                }
            }
        });
        peca.fim = verts.length / 3;
    });

    var NV = verts.length / 3;
    var origem = new Float32Array(verts);
    var tela = new Float32Array(NV * 3);   // x, y projetados + z de profundidade
    var ordem = new Array(faces.length);
    for (var i = 0; i < faces.length; i++) ordem[i] = i;
    var prof = new Float32Array(faces.length);

    /* ── 3. estado ───────────────────────────────────────────── */
    var est = {
        giro: -0.5, incl: 0.32, zoom: 1,
        abrir: 0.55, alvo: 0.55,
        auto: !reduz, sel: -1, hover: -1,
        arrastando: false
    };
    var L = (function (v) {                       // direção da luz
        var m = Math.hypot(v[0], v[1], v[2]);
        return [v[0] / m, v[1] / m, v[2] / m];
    })([-0.42, 0.78, 0.55]);

    /* ── 4. render ───────────────────────────────────────────── */
    var larg = 0, alt = 0, dpr = 1;

    function medir() {
        var r = canvas.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        larg = Math.max(1, Math.round(r.width));
        alt = Math.max(1, Math.round(r.height));
        canvas.width = Math.round(larg * dpr);
        canvas.height = Math.round(alt * dpr);
    }

    function projetar() {
        var cg = Math.cos(est.giro), sg = Math.sin(est.giro),
            ci = Math.cos(est.incl), si = Math.sin(est.incl),
            // o enquadramento acompanha a separação: quanto mais aberto, mais longe a câmera
            escala = Math.min(larg, alt) / 470 * est.zoom * (1.34 / (1 + est.abrir * 0.78)),
            foco = 1500, dist = 1500,
            cx = larg / 2, cy = alt * 0.455;

        for (var p = 0; p < PECAS.length; p++) {
            var desloc = (CENTRO - p) * VAO * est.abrir;
            for (var v = PECAS[p].inicio; v < PECAS[p].fim; v++) {
                var i3 = v * 3,
                    x = origem[i3], y = origem[i3 + 1] + desloc, z = origem[i3 + 2];
                var x1 = x * cg + z * sg, z1 = -x * sg + z * cg;
                var y2 = y * ci - z1 * si, z2 = y * si + z1 * ci;
                var zc = dist - z2;
                if (zc < 60) zc = 60;
                var s = (foco / zc) * escala;
                tela[i3] = cx + x1 * s;
                tela[i3 + 1] = cy - y2 * s;
                tela[i3 + 2] = zc;
            }
        }
    }

    function tonalizar(peca, nx, ny, nz, realce, apagar) {
        var dif = Math.abs(nx * L[0] + ny * L[1] + nz * L[2]);
        var borda = 1 - Math.abs(nz);
        borda = borda * borda * borda;
        var c = peca.cor, f = 0.2 + 0.8 * dif;
        if (peca.metal) f += Math.pow(dif, 16) * 0.75;
        var r = c[0] * f + 255 * borda * (realce ? 0.85 : 0.42);
        var g = c[1] * f + 26 * borda * (realce ? 0.85 : 0.42);
        var b = c[2] * f + 58 * borda * (realce ? 0.85 : 0.42);
        if (realce) { r += 26; g += 8; b += 12; }
        if (apagar) { r *= 0.42; g *= 0.42; b *= 0.42; }
        return "rgb(" + (r > 255 ? 255 : r | 0) + "," + (g > 255 ? 255 : g | 0) + "," + (b > 255 ? 255 : b | 0) + ")";
    }

    function desenhar() {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, larg, alt);
        projetar();

        var f, i, n = faces.length;
        for (i = 0; i < n; i++) {
            f = faces[i];
            prof[i] = (tela[f[0] * 3 + 2] + tela[f[1] * 3 + 2] + tela[f[2] * 3 + 2] + tela[f[3] * 3 + 2]) * 0.25;
        }
        ordem.sort(function (a, b) { return prof[b] - prof[a]; });

        var destaque = est.sel >= 0 ? est.sel : est.hover;
        for (i = 0; i < n; i++) {
            f = faces[ordem[i]];
            var a3 = f[0] * 3, b3 = f[1] * 3, c3 = f[2] * 3, d3 = f[3] * 3;
            var ax = tela[a3], ay = tela[a3 + 1], bx = tela[b3], by = tela[b3 + 1],
                cx2 = tela[c3], cy2 = tela[c3 + 1], dx = tela[d3], dy = tela[d3 + 1];

            // normal aproximada em espaço de tela (o sinal do produto vetorial 2D dá a face)
            var ux = bx - ax, uy = by - ay, vx = cx2 - ax, vy = cy2 - ay;
            var area = ux * vy - uy * vx;
            if (area === 0) continue;

            // normal 3D real, para a iluminação
            var uz = tela[b3 + 2] - tela[a3 + 2], vz = tela[c3 + 2] - tela[a3 + 2];
            var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
            var m = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
            nx /= m; ny /= m; nz /= m;

            var peca = PECAS[f[4]];
            ctx.fillStyle = tonalizar(peca, nx, ny, nz,
                destaque === f[4], destaque >= 0 && destaque !== f[4]);
            ctx.beginPath();
            ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(cx2, cy2); ctx.lineTo(dx, dy);
            ctx.closePath();
            ctx.fill();
        }
    }

    /* ── 5. seleção por cor (canvas fora da tela) ────────────── */
    var pick = document.createElement("canvas"), pctx = pick.getContext("2d", { willReadFrequently: true });

    function pecaEm(px, py) {
        pick.width = larg; pick.height = alt;
        pctx.setTransform(1, 0, 0, 1, 0, 0);
        pctx.clearRect(0, 0, larg, alt);
        for (var i = 0; i < faces.length; i++) {
            var f = faces[ordem[i]];
            var a3 = f[0] * 3, b3 = f[1] * 3, c3 = f[2] * 3, d3 = f[3] * 3;
            pctx.fillStyle = "rgb(" + ((f[4] + 1) * 20) + ",0,0)";
            pctx.beginPath();
            pctx.moveTo(tela[a3], tela[a3 + 1]);
            pctx.lineTo(tela[b3], tela[b3 + 1]);
            pctx.lineTo(tela[c3], tela[c3 + 1]);
            pctx.lineTo(tela[d3], tela[d3 + 1]);
            pctx.closePath();
            pctx.fill();
        }
        var d = pctx.getImageData(Math.round(px), Math.round(py), 1, 1).data;
        if (!d[3]) return -1;
        var idx = Math.round(d[0] / 20) - 1;
        return idx >= 0 && idx < PECAS.length ? idx : -1;
    }

    /* ── 6. interface ────────────────────────────────────────── */
    var lista = document.getElementById("pecas3d"),
        info = document.getElementById("info3d"),
        slider = document.getElementById("abrir3d"),
        btnGirar = document.getElementById("girar3d"),
        btnMontar = document.getElementById("montar3d");

    if (lista) {
        PECAS.forEach(function (peca, i) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "peca";
            b.dataset.i = i;
            b.innerHTML = '<span class="ponto" style="background:rgb(' + peca.cor.join(",") + ')"></span>'
                        + '<span class="peca-nome">' + peca.nome + '</span>'
                        + '<span class="peca-n">' + String(i + 1).padStart(2, "0") + '</span>';
            b.addEventListener("click", function () { selecionar(est.sel === i ? -1 : i); });
            b.addEventListener("mouseenter", function () { est.hover = i; pintar(); });
            b.addEventListener("mouseleave", function () { est.hover = -1; pintar(); });
            lista.appendChild(b);
        });
    }

    function selecionar(i) {
        est.sel = i;
        if (lista) {
            Array.prototype.forEach.call(lista.children, function (el) {
                el.setAttribute("aria-current", String(Number(el.dataset.i) === i));
            });
        }
        if (info) {
            info.innerHTML = i < 0
                ? '<b>Toque numa peça</b><span>Arraste para girar o alto-falante e use o controle para separar os componentes.</span>'
                : '<b>' + PECAS[i].nome + '</b><span>' + PECAS[i].desc + '</span>';
        }
        pintar();
    }

    if (slider) {
        slider.addEventListener("input", function () {
            est.alvo = est.abrir = Number(slider.value) / 100;
            pintar();
        });
    }
    if (btnGirar) {
        btnGirar.addEventListener("click", function () {
            est.auto = !est.auto;
            btnGirar.setAttribute("aria-pressed", String(est.auto));
            btnGirar.textContent = est.auto ? "Pausar giro" : "Girar";
        });
    }
    if (btnMontar) {
        btnMontar.addEventListener("click", function () {
            var montado = est.alvo > 0.05;
            est.alvo = montado ? 0 : 0.55;
            btnMontar.textContent = montado ? "Separar peças" : "Montar";
        });
    }

    /* ── 7. arrastar (mouse e toque) ─────────────────────────── */
    var ult = null, moveu = false;

    canvas.addEventListener("pointerdown", function (e) {
        ult = { x: e.clientX, y: e.clientY };
        moveu = false;
        est.arrastando = true;
        est.auto = false;
        if (btnGirar) { btnGirar.setAttribute("aria-pressed", "false"); btnGirar.textContent = "Girar"; }
        try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ponteiro já liberado */ }
    });

    canvas.addEventListener("pointermove", function (e) {
        var r = canvas.getBoundingClientRect();
        if (!est.arrastando) {
            if (e.pointerType === "mouse") {
                var achou = pecaEm(e.clientX - r.left, e.clientY - r.top);
                if (achou !== est.hover) { est.hover = achou; canvas.style.cursor = achou >= 0 ? "pointer" : "grab"; pintar(); }
            }
            return;
        }
        var dx = e.clientX - ult.x, dy = e.clientY - ult.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) moveu = true;
        est.giro += dx * 0.0085;
        est.incl = Math.max(-1.25, Math.min(1.25, est.incl + dy * 0.0065));
        ult = { x: e.clientX, y: e.clientY };
        pintar();
    });

    function soltar(e) {
        if (!est.arrastando) return;
        est.arrastando = false;
        canvas.style.cursor = "grab";
        if (!moveu) {
            var r = canvas.getBoundingClientRect();
            var achou = pecaEm(e.clientX - r.left, e.clientY - r.top);
            selecionar(achou === est.sel ? -1 : achou);
        }
    }
    canvas.addEventListener("pointerup", soltar);
    canvas.addEventListener("pointercancel", function () { est.arrastando = false; });
    canvas.addEventListener("pointerleave", function () { if (est.hover >= 0 && !est.arrastando) { est.hover = -1; pintar(); } });

    canvas.addEventListener("wheel", function (e) {
        e.preventDefault();
        est.zoom = Math.max(0.55, Math.min(2.2, est.zoom * (e.deltaY > 0 ? 0.92 : 1.08)));
        pintar();
    }, { passive: false });

    canvas.addEventListener("keydown", function (e) {
        var passo = 0.12;
        if (e.key === "ArrowLeft") { est.giro -= passo; }
        else if (e.key === "ArrowRight") { est.giro += passo; }
        else if (e.key === "ArrowUp") { est.incl = Math.max(-1.25, est.incl - passo); }
        else if (e.key === "ArrowDown") { est.incl = Math.min(1.25, est.incl + passo); }
        else return;
        e.preventDefault();
        est.auto = false;
        pintar();
    });

    /* ── 8. laço de animação (só roda quando precisa) ────────── */
    var sujo = true, rodando = false, visivel = true;
    function pintar() { sujo = true; laco(); }

    function laco() {
        if (rodando) return;
        rodando = true;
        requestAnimationFrame(function passo() {
            var anima = false;
            if (est.auto && visivel && !est.arrastando) { est.giro += 0.0042; anima = true; }
            if (Math.abs(est.alvo - est.abrir) > 0.002) {
                est.abrir += (est.alvo - est.abrir) * 0.12;
                if (slider) slider.value = Math.round(est.abrir * 100);
                anima = true;
            }
            if (sujo || anima) { desenhar(); sujo = false; }
            if (anima) requestAnimationFrame(passo);
            else rodando = false;
        });
    }

    var reajustar = function () { medir(); pintar(); };
    window.addEventListener("resize", reajustar);

    if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (ents) {
            visivel = ents[0].isIntersecting;
            if (visivel) pintar();
        }, { threshold: 0.05 }).observe(canvas);
    }

    medir();
    selecionar(-1);
    canvas.style.cursor = "grab";
    if (slider) slider.value = Math.round(est.abrir * 100);
    if (btnGirar) btnGirar.textContent = est.auto ? "Pausar giro" : "Girar";
    pintar();
})();
