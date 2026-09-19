(function() {
    "use strict";

    /* ───────── catálogo ─────────
       Dados de exemplo para demonstração.
       AK 47 6K e TL 500 PRO vieram de posts reais do @tlaltofalantes. */
    var PRODUTOS = [{
            id: "ak47-6k-15",
            nome: "AK 47 6K",
            cat: "sub",
            pol: 15,
            rms: 3000,
            ohms: "2 + 2 Ω",
            bobina: '4"',
            sens: "94 dB",
            resp: "25 Hz – 1.2 kHz",
            ima: "Ferrite 260 mm",
            cor: "#F4F6FA",
            tag: "Carro-chefe",
            real: true,
            desc: "O subwoofer que virou marca registrada da TL. 3000 RMS de grave seco para quem monta parede e não abre mão de pressão.",
            apps: ["Competição", "Som de rua", "Parede"]
        },
        {
            id: "ak47-4k-12",
            nome: "AK 47 4K",
            cat: "sub",
            pol: 12,
            rms: 2000,
            ohms: "2 + 2 Ω",
            bobina: '3"',
            sens: "92 dB",
            resp: "28 Hz – 1.2 kHz",
            ima: "Ferrite 220 mm",
            cor: "#F4F6FA",
            tag: "",
            real: false,
            desc: "A mesma pegada do 6K em corpo de 12 polegadas. Encaixa em caixa menor sem perder o grave grave.",
            apps: ["Som de rua", "Evento"]
        },
        {
            id: "tl-8k-15",
            nome: "TL 8K Extreme",
            cat: "sub",
            pol: 15,
            rms: 4000,
            ohms: "1 + 1 Ω",
            bobina: '4"',
            sens: "95 dB",
            resp: "22 Hz – 900 Hz",
            ima: "Ferrite duplo 280 mm",
            cor: "#FF0F2D",
            tag: "Topo de linha",
            real: false,
            desc: "Projetado para competição de SPL. Conjunto magnético duplo e bobina de alta temperatura para ciclo pesado.",
            apps: ["SPL", "Competição"]
        },
        {
            id: "tl-storm-1600",
            nome: "TL Storm 1600",
            cat: "sub",
            pol: 15,
            rms: 1600,
            ohms: "4 Ω",
            bobina: '3"',
            sens: "93 dB",
            resp: "30 Hz – 1 kHz",
            ima: "Ferrite 200 mm",
            cor: "#FF1A3C",
            tag: "",
            real: false,
            desc: "Subwoofer de uso diário: grave firme, boa excursão e consumo amigável para módulos de 2 canais.",
            apps: ["Dia a dia", "Som de rua"]
        },
        {
            id: "tl-black-1200",
            nome: "TL Black 1200",
            cat: "sub",
            pol: 12,
            rms: 1200,
            ohms: "4 Ω",
            bobina: '2,5"',
            sens: "91 dB",
            resp: "32 Hz – 1.2 kHz",
            ima: "Ferrite 180 mm",
            cor: "#2A0A10",
            tag: "Custo-benefício",
            real: false,
            desc: "Entrada da linha de graves. Ideal para primeira montagem com módulo de até 1.5 k.",
            apps: ["Dia a dia", "Primeira montagem"]
        },

        {
            id: "tl-500-pro-10",
            nome: "TL 500 PRO",
            cat: "medio",
            pol: 10,
            rms: 500,
            ohms: "8 Ω",
            bobina: '2"',
            sens: "97 dB",
            resp: "90 Hz – 7 kHz",
            ima: "Ferrite 145 mm",
            cor: "#FF0F2D",
            tag: "Mais vendido",
            real: true,
            desc: "Presença sonora e alto desempenho. Médio de 10 polegadas com resposta firme para linha de frente potente.",
            apps: ["Médio de alto desempenho", "Evento"]
        },
        {
            id: "tl-400-pro-12",
            nome: "TL 400 PRO",
            cat: "medio",
            pol: 12,
            rms: 400,
            ohms: "8 Ω",
            bobina: '2"',
            sens: "98 dB",
            resp: "80 Hz – 6 kHz",
            ima: "Ferrite 160 mm",
            cor: "#F4F6FA",
            tag: "",
            real: false,
            desc: "Médio-grave de 12 polegadas para quem quer corpo na voz e sensibilidade alta em caixa aberta.",
            apps: ["Médio-grave", "Som de rua"]
        },
        {
            id: "tl-300-mb-8",
            nome: "TL 300 MB",
            cat: "medio",
            pol: 8,
            rms: 300,
            ohms: "8 Ω",
            bobina: '1,75"',
            sens: "95 dB",
            resp: "110 Hz – 8 kHz",
            ima: "Ferrite 120 mm",
            cor: "#FF1A3C",
            tag: "",
            real: false,
            desc: "Compacto e alto. Cabe na porta e sustenta a linha de frente sem exigir módulo grande.",
            apps: ["Porta", "Linha de frente"]
        },
        {
            id: "tl-250-mb-6",
            nome: "TL 250 MB",
            cat: "medio",
            pol: 6,
            rms: 250,
            ohms: "4 Ω",
            bobina: '1,5"',
            sens: "93 dB",
            resp: "130 Hz – 9 kHz",
            ima: "Ferrite 100 mm",
            cor: "#2A0A10",
            tag: "",
            real: false,
            desc: "Médio de 6 polegadas para reforço interno, torre lateral e projetos com pouco espaço.",
            apps: ["Porta", "Torre"]
        },

        {
            id: "tl-dr-300",
            nome: "TL DR 300",
            cat: "driver",
            pol: 2,
            rms: 300,
            ohms: "8 Ω",
            bobina: '2"',
            sens: "108 dB",
            resp: "1.2 kHz – 18 kHz",
            ima: "Ferrite 120 mm",
            cor: "#F4F6FA",
            tag: "",
            real: false,
            desc: "Driver fenólico de 2 polegadas com diafragma reforçado — brilho alto sem estridência no volume máximo.",
            apps: ["Corneta", "Evento"]
        },
        {
            id: "tl-dr-200",
            nome: "TL DR 200",
            cat: "driver",
            pol: 1.75,
            rms: 200,
            ohms: "8 Ω",
            bobina: '1,75"',
            sens: "106 dB",
            resp: "1.5 kHz – 18 kHz",
            ima: "Ferrite 100 mm",
            cor: "#FF2D4F",
            tag: "",
            real: false,
            desc: "Versão compacta do DR 300, para montagens com várias cornetas em paralelo.",
            apps: ["Corneta", "Som de rua"]
        },
        {
            id: "tl-tw-150",
            nome: "TL TW 150",
            cat: "tweeter",
            pol: 1,
            rms: 150,
            ohms: "8 Ω",
            bobina: '1"',
            sens: "104 dB",
            resp: "3 kHz – 20 kHz",
            ima: "Ferrite 70 mm",
            cor: "#FF1A3C",
            tag: "",
            real: false,
            desc: "Tweeter de corneta com dispersão ampla — define o agudo sem cansar o ouvido.",
            apps: ["Agudo", "Linha de frente"]
        },
        {
            id: "tl-st-200",
            nome: "TL ST 200",
            cat: "tweeter",
            pol: 1,
            rms: 200,
            ohms: "8 Ω",
            bobina: '1,25"',
            sens: "107 dB",
            resp: "5 kHz – 22 kHz",
            ima: "Ferrite 80 mm",
            cor: "#F4F6FA",
            tag: "",
            real: false,
            desc: "Super tweeter para som de rua: agudo que corta o ambiente mesmo com o sub no talo.",
            apps: ["Super agudo", "Som de rua"]
        },

        {
            id: "kit-trio-pro",
            nome: "Kit Trio PRO",
            cat: "kit",
            pol: 8,
            rms: 1100,
            ohms: "8 Ω",
            bobina: "—",
            sens: "—",
            resp: "110 Hz – 20 kHz",
            ima: "—",
            cor: "#FF0F2D",
            tag: "Combo",
            real: false,
            desc: "Dois TL 300 MB, um driver DR 200 e um tweeter TW 150 no mesmo pedido, com divisor de frequência.",
            apps: ["Linha de frente completa"]
        },
        {
            id: "kit-reparo-ak",
            nome: "Kit Reparo AK 47",
            cat: "kit",
            pol: 15,
            rms: 3000,
            ohms: "2 + 2 Ω",
            bobina: '4"',
            sens: "—",
            resp: "—",
            ima: "—",
            cor: "#2A0A10",
            tag: "Reposição",
            real: false,
            desc: "Recone original de fábrica: cone, aranha, bobina e cola. Devolve o alto-falante ao padrão de origem.",
            apps: ["Reposição", "Assistência"]
        }
    ];

    var CATEGORIAS = [
        { key: "todos", label: "Todos" },
        { key: "sub", label: "Subwoofers" },
        { key: "medio", label: "Médios" },
        { key: "driver", label: "Drivers" },
        { key: "tweeter", label: "Tweeters" },
        { key: "kit", label: "Kits" }
    ];
    var NOME_CAT = { sub: "Subwoofer", medio: "Médio / Médio-grave", driver: "Driver", tweeter: "Tweeter", kit: "Kit" };

    var WA_FABRICA = "https://wa.me/551156851958?text=";

    /* ───────── ilustração vetorial do alto-falante ───────── */
    function lum(hex){
        var v = parseInt(hex.slice(1), 16);
        return 0.299 * (v >> 16) + 0.587 * ((v >> 8) & 255) + 0.114 * (v & 255);
    }

    var uid = 0;

    function speakerSVG(p) {
        var n = ++uid,
            c = p.cor,
            isSmall = (p.cat === "tweeter" || p.cat === "driver");
        var rim = isSmall ? 92 : 94;
        var coneR = isSmall ? 44 : 62;
        var capR = isSmall ? 26 : 26;
        var spokes = "";
        for (var i = 0; i < 6; i++) {
            spokes += '<rect x="97" y="12" width="6" height="86" rx="3" fill="url(#m' + n + ')" opacity=".9" transform="rotate(' + (i * 60) + ' 100 100)"/>';
        }
        var bolts = "";
        for (var b = 0; b < 8; b++) {
            var a = (b * 45) * Math.PI / 180;
            bolts += '<circle cx="' + (100 + Math.cos(a) * (rim - 7)).toFixed(1) + '" cy="' + (100 + Math.sin(a) * (rim - 7)).toFixed(1) + '" r="3.4" fill="#05050A" stroke="#585C66" stroke-width="1"/>';
        }
        return '' +
            '<svg viewBox="0 0 200 200" role="img" aria-label="Ilustração do alto-falante ' + p.nome + '">' +
            '<defs>' +
            '<linearGradient id="m' + n + '" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="#FFFFFF"/><stop offset="38%" stop-color="#C3C7CE"/>' +
            '<stop offset="55%" stop-color="#6E727B"/><stop offset="78%" stop-color="#EDEFF3"/>' +
            '<stop offset="100%" stop-color="#8F949E"/>' +
            '</linearGradient>' +
            '<radialGradient id="c' + n + '" cx="40%" cy="32%" r="78%">' +
            '<stop offset="0%" stop-color="#3A3A46"/><stop offset="55%" stop-color="#17171E"/>' +
            '<stop offset="100%" stop-color="#08080C"/>' +
            '</radialGradient>' +
            '<radialGradient id="k' + n + '" cx="36%" cy="30%" r="75%">' +
            '<stop offset="0%" stop-color="' + c + '"/><stop offset="100%" stop-color="' + c + '" stop-opacity=".62"/>' +
            '</radialGradient>' +
            '<linearGradient id="g' + n + '" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#FF1A3C" stop-opacity=".85"/><stop offset="100%" stop-color="#FF1A3C" stop-opacity="0"/>' +
            '</linearGradient>' +
            '</defs>' +
            '<circle cx="100" cy="100" r="98" fill="url(#g' + n + ')" opacity=".8"/>' +
            '<circle cx="100" cy="100" r="' + (rim + 3) + '" fill="none" stroke="#FF1A3C" stroke-width="1.5" opacity=".5"/>' +
            '<circle cx="100" cy="100" r="' + rim + '" fill="#0B0B11" stroke="url(#m' + n + ')" stroke-width="7"/>' +
            bolts +
            '<circle cx="100" cy="100" r="' + (rim - 16) + '" fill="url(#c' + n + ')"/>' +
            spokes +
            '<circle cx="100" cy="100" r="' + (coneR + 9) + '" fill="none" stroke="' + c + '" stroke-width="7" opacity=".85"/>' +
            '<circle cx="100" cy="100" r="' + coneR + '" fill="url(#c' + n + ')" stroke="#2A2A33" stroke-width="1.5"/>' +
            '<circle cx="100" cy="100" r="' + (coneR - 11) + '" fill="none" stroke="#FFFFFF" stroke-opacity=".07" stroke-width="1.5"/>' +
            '<circle cx="100" cy="100" r="' + capR + '" fill="url(#k' + n + ')" stroke="#05050A" stroke-width="2"/>' +
            '<text x="100" y="' + (104) + '" text-anchor="middle" font-family="Saira Condensed, sans-serif" font-style="italic" font-weight="900" font-size="20" fill="' + (lum(c) < 150 ? "#FFFFFF" : "#0B0B11") + '">TL</text>' +
            '<ellipse cx="74" cy="66" rx="30" ry="16" fill="#FFFFFF" opacity=".07" transform="rotate(-28 74 66)"/>' +
            '</svg>';
    }

    /* ───────── render ───────── */
    var grid = document.getElementById("grid"),
        chipsEl = document.getElementById("chips"),
        countEl = document.getElementById("count"),
        qEl = document.getElementById("q"),
        modal = document.getElementById("modal"),
        modalIn = document.getElementById("modalIn"),
        filtro = "todos",
        busca = "";

    CATEGORIAS.forEach(function(c) {
        var b = document.createElement("button");
        b.className = "chip";
        b.type = "button";
        b.textContent = c.label;
        b.setAttribute("aria-pressed", c.key === "todos" ? "true" : "false");
        b.addEventListener("click", function() {
            filtro = c.key;
            Array.prototype.forEach.call(chipsEl.children, function(x) { x.setAttribute("aria-pressed", String(x === b)); });
            render();
        });
        chipsEl.appendChild(b);
    });

    function visiveis() {
        var t = busca.trim().toLowerCase();
        return PRODUTOS.filter(function(p) {
            if (filtro !== "todos" && p.cat !== filtro) return false;
            if (!t) return true;
            return (p.nome + " " + NOME_CAT[p.cat] + " " + p.pol + " " + p.rms + " " + p.ohms + " " + p.desc + " " + p.apps.join(" "))
                .toLowerCase().indexOf(t) > -1;
        });
    }

    function render() {
        var lista = visiveis();
        grid.innerHTML = "";
        countEl.textContent = lista.length + (lista.length === 1 ? " modelo" : " modelos");
        if (!lista.length) {
            grid.innerHTML = '<div class="empty">Nenhum modelo encontrado. Tente outro termo ou fale com a gente no WhatsApp — a linha completa é maior que a vitrine.</div>';
            return;
        }
        lista.forEach(function(p) {
            var card = document.createElement("button");
            card.className = "card";
            card.type = "button";
            card.setAttribute("aria-label", "Ver ficha técnica do " + p.nome);
            card.innerHTML = '' +
                '<div class="card-img">' +
                (p.tag ? '<span class="tag' + (p.real ? ' hot' : '') + '">' + p.tag + '</span>' : '') +
                speakerSVG(p) +
                '</div>' +
                '<div class="card-body">' +
                '<h3><small>' + NOME_CAT[p.cat] + '</small>' + p.nome + '</h3>' +
                '<p class="desc">' + p.desc + '</p>' +
                '<div class="specs">' +
                '<div class="spec rms"><b>' + p.rms + '</b><span>RMS</span></div>' +
                '<div class="spec"><b>' + String(p.pol).replace(".", ",") + '"</b><span>Polegadas</span></div>' +
                '<div class="spec"><b>' + p.ohms.replace(" Ω", "") + '</b><span>Ohms</span></div>' +
                '</div>' +
                '</div>';
            card.addEventListener("click", function() { abrir(p); });
            grid.appendChild(card);
        });
    }

    function linha(k, v) {
        return v && v !== "—" ? '<tr><th>' + k + '</th><td>' + v + '</td></tr>' : '';
    }

    function abrir(p) {
        var msg = "Olá! Vim pelo site da TL Alto-Falantes e quero um orçamento do " + p.nome +
            " (" + p.pol + '", ' + p.rms + " RMS, " + p.ohms + ").";
        modalIn.innerHTML = '' +
            '<button class="modal-close" type="button" aria-label="Fechar">&times;</button>' +
            '<div class="modal-art">' + speakerSVG(p) + '</div>' +
            '<div class="modal-info">' +
            '<h3><small>' + NOME_CAT[p.cat] + (p.tag ? ' · ' + p.tag : '') + '</small>' + p.nome + '</h3>' +
            '<p class="desc">' + p.desc + '</p>' +
            '<table class="sheet"><tbody>' +
            linha("Potência RMS", p.rms + " W") +
            linha("Potência musical", (p.rms * 2) + " W") +
            linha("Tamanho", String(p.pol).replace(".", ",") + " polegadas") +
            linha("Impedância", p.ohms) +
            linha("Bobina", p.bobina) +
            linha("Sensibilidade", p.sens) +
            linha("Resposta de frequência", p.resp) +
            linha("Conjunto magnético", p.ima) +
            '</tbody></table>' +
            '<div class="apps">' + p.apps.map(function(a) { return '<em>' + a + '</em>'; }).join("") + '</div>' +
            '<div class="hero-cta" style="margin-top:6px">' +
            '<a class="btn btn-red" target="_blank" rel="noopener" href="' + WA_FABRICA + encodeURIComponent(msg) + '">Pedir orçamento</a>' +
            '<button class="btn btn-ghost" type="button" data-close>Voltar ao catálogo</button>' +
            '</div>' +
            (p.real ? '' : '<p style="font-size:.74rem;color:var(--muted-2)">Especificação de exemplo — confirme os valores oficiais com a fábrica.</p>') +
            '</div>';
        if (typeof modal.showModal === "function") modal.showModal();
        else modal.setAttribute("open", "");
    }

    modal.addEventListener("click", function(e) {
        if (e.target === modal || e.target.closest("[data-close], .modal-close")) modal.close();
    });

    qEl.addEventListener("input", function() { busca = qEl.value;
        render(); });
    render();

    /* ───────── hero + ticker ───────── */
    document.getElementById("heroArt").innerHTML = speakerSVG(PRODUTOS[0]);

    var eq = document.getElementById("eq");
    if (eq) {
        var ALTURAS = [34, 58, 96, 70, 44, 82, 100, 62, 38, 76, 52, 30];
        eq.innerHTML = ALTURAS.map(function (h, i) {
            return '<i style="height:' + h + '%;animation-delay:' + (i * 90) + 'ms;animation-duration:' +
                   (760 + (i % 5) * 150) + 'ms"></i>';
        }).join("");
    }

    var frases = ["A potência do som", "AK 47 6K · 3000 RMS", "Som que move paixões", "Qualidade e inovação",
        "Presença sonora e alto desempenho", "Distribuidores em todo o Brasil"
    ];
    var track = document.getElementById("ticker");
    track.innerHTML = frases.concat(frases).map(function(f) { return "<span>" + f + "</span>"; }).join("");

    /* ───────── reveal ───────── */
    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function(entries) {
            entries.forEach(function(en) {
                if (en.isIntersecting) { en.target.classList.add("in");
                    io.unobserve(en.target); }
            });
        }, { threshold: .12, rootMargin: "0px 0px -40px" });
        document.querySelectorAll(".rv").forEach(function(el, i) {
            el.style.transitionDelay = (i % 4) * 70 + "ms";
            io.observe(el);
        });
    } else {
        document.querySelectorAll(".rv").forEach(function(el) { el.classList.add("in"); });
    }
})();