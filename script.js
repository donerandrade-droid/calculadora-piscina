// =============================================
// POOLTECH — SCRIPT PRINCIPAL
// =============================================

const bancoMarcas = {
    komeco:  { nome: "Komeco (Bright / Home)", minCritico: 3.0, idealMin: 3.5, idealMax: 4.2 },
    fluidra: { nome: "Fluidra / AstralPool",   minCritico: 2.4, idealMin: 3.0, idealMax: 3.6 },
    nautilus:{ nome: "Nautilus EasyClor",       minCritico: 2.5, idealMin: 3.0, idealMax: 4.0 },
    pentair: { nome: "Pentair iChlor",          minCritico: 2.8, idealMin: 3.2, idealMax: 4.5 }
};

let volumeTotalLitros = 0;
let formatoAtivo = 'retangular';
let dadosUltimoCalculo = {};

// =============================================
// NAVEGAÇÃO DE ABAS DE FORMATO
// =============================================
function mudarAba(formato, botao) {
    formatoAtivo = formato;
    document.querySelectorAll('.conteudo-formato').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.fmt-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`aba-${formato}`).classList.remove('hidden');
    botao.classList.add('active');
}

// =============================================
// NAVEGAÇÃO DE PASSOS
// =============================================
function irParaPasso(num) {
    // Esconde todos os passos
    document.querySelectorAll('.passo').forEach(el => el.classList.add('hidden'));
    // Mostra o passo desejado
    document.getElementById(`passo-${num}`).classList.remove('hidden');

    // Atualiza nav
    document.querySelectorAll('.step-btn').forEach(btn => {
        const n = parseInt(btn.dataset.step);
        btn.classList.remove('active', 'done');
        if (n === num) btn.classList.add('active');
        else if (n < num) btn.classList.add('done');
    });

    // Scroll para o topo suavemente
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =============================================
// PASSO 1 — CALCULAR VOLUME
// =============================================
function calcularVolume() {
    let m3 = 0;

    // Verifica se está no modo "já sei o volume"
    const modoDirecto = document.getElementById('toggleVolumeDirecto').checked;
    if (modoDirecto) {
        const volDirecto = parseFloat(document.getElementById('volumeDirecto').value) || 0;
        if (volDirecto <= 0) {
            alert("Informe o volume da piscina em litros!");
            return;
        }
        volumeTotalLitros = volDirecto;
        m3 = volDirecto / 1000;
    } else {
        if (formatoAtivo === 'retangular') {
            const cF = parseFloat(document.getElementById('compFundo').value) || 0;
            const lF = parseFloat(document.getElementById('largFundo').value) || 0;
            const pF = parseFloat(document.getElementById('profFundo').value) || 0;
            const cP = parseFloat(document.getElementById('compPrainha').value) || 0;
            const lP = parseFloat(document.getElementById('largPrainha').value) || 0;
            const pP = parseFloat(document.getElementById('profPrainha').value) || 0;
            m3 = (cF * lF * pF) + (cP * lP * pP);
        } else if (formatoAtivo === 'redonda') {
            const d = parseFloat(document.getElementById('diametroRedonda').value) || 0;
            const p = parseFloat(document.getElementById('profRedonda').value) || 0;
            m3 = d * d * p * 0.785;
        } else if (formatoAtivo === 'oval') {
            const c = parseFloat(document.getElementById('compOval').value) || 0;
            const l = parseFloat(document.getElementById('largOval').value) || 0;
            const p = parseFloat(document.getElementById('profOval').value) || 0;
            m3 = c * l * p * 0.785;
        } else if (formatoAtivo === 'irregular') {
            const c = parseFloat(document.getElementById('compIrregular').value) || 0;
            const l = parseFloat(document.getElementById('largIrregular').value) || 0;
            const p = parseFloat(document.getElementById('profIrregular').value) || 0;
            m3 = c * l * p * 0.85;
        }
        volumeTotalLitros = m3 * 1000;
    }
    if (volumeTotalLitros <= 0) {
        alert("Preencha as dimensões da piscina!");
        return;
    }

    document.getElementById('resLitros').innerText = Math.round(volumeTotalLitros).toLocaleString('pt-BR');
    document.getElementById('resM3').innerText = m3.toFixed(2);
    document.getElementById('resultado-volume').classList.remove('hidden');

    dadosUltimoCalculo.volume = { litros: Math.round(volumeTotalLitros), m3: m3.toFixed(2), formato: formatoAtivo };
}

// =============================================
// PASSO 2 — CALCULAR SALINIDADE
// =============================================
function calcularSalinidade() {
    if (volumeTotalLitros <= 0) {
        alert("Volte ao Passo 1 e calcule o volume primeiro!");
        irParaPasso(1);
        return;
    }

    const leitura = parseFloat(document.getElementById('leituraVisor').value) || 0;
    const marca = document.getElementById('marcaGerador').value;
    const regras = bancoMarcas[marca];
    const sal = leitura > 100 ? leitura / 1000 : leitura;
    let msg = "";

    if (leitura === 0) {
        msg = `ℹ️ <strong>Informe a leitura do visor</strong> para receber o diagnóstico do <strong>${regras.nome}</strong>.`;
    } else if (sal < regras.minCritico) {
        const falta = ((regras.idealMin - sal) * volumeTotalLitros / 1000).toFixed(1);
        msg = `⚠️ <strong>Sal Crítico — ${regras.nome}</strong><br><br>Visor em <strong>${sal.toFixed(1)} g/L</strong>, mínimo necessário é <strong>${regras.minCritico.toFixed(1)} g/L</strong>.<br><br>✅ Adicione urgentemente <strong>${falta} kg</strong> de sal.`;
    } else if (sal < regras.idealMin) {
        const falta = ((regras.idealMin - sal) * volumeTotalLitros / 1000).toFixed(1);
        msg = `💡 <strong>Sal Baixo — ${regras.nome}</strong><br><br>Visor em <strong>${sal.toFixed(1)} g/L</strong>, ideal começa em <strong>${regras.idealMin.toFixed(1)} g/L</strong>.<br><br>✅ Adicione <strong>${falta} kg</strong> de sal.`;
    } else if (sal > regras.idealMax) {
        const excesso = Math.round(volumeTotalLitros * ((sal - regras.idealMax) / sal));
        msg = `🚨 <strong>Sal Elevado — ${regras.nome}</strong><br><br>Visor em <strong>${sal.toFixed(2)} g/L</strong>, máximo é <strong>${regras.idealMax.toFixed(1)} g/L</strong>.<br><br>✅ Renove cerca de <strong>${excesso.toLocaleString('pt-BR')} litros</strong> de água.`;
    } else {
        msg = `✅ <strong>Salinidade Perfeita — ${regras.nome}</strong><br><br>Sistema operando com <strong>${sal.toFixed(1)} g/L</strong> (faixa ideal: ${regras.idealMin.toFixed(1)} a ${regras.idealMax.toFixed(1)} g/L).`;
    }

    document.getElementById('textoDiagnostico').innerHTML = msg;
    document.getElementById('resultado-salinidade').classList.remove('hidden');

    let status = 'ok';
    if (leitura > 0) {
        if (sal < regras.minCritico) status = 'critico';
        else if (sal < regras.idealMin || sal > regras.idealMax) status = 'atencao';
    }
    dadosUltimoCalculo.salinidade = { leitura, marca: regras.nome, status };
}

// =============================================
// PASSO 3 — CALCULAR PRODUTOS
// =============================================
function calcularProdutos() {
    if (volumeTotalLitros <= 0) {
        alert("Volte ao Passo 1 e calcule o volume primeiro!");
        irParaPasso(1);
        return;
    }

    const fator = volumeTotalLitros / 1000;
    const produtos = [
        { doseId: 'doseSal',        resId: 'resSal',        divId: 'resSalDiv',        calc: d => (d * volumeTotalLitros / 1000).toFixed(1), un: 'kg' },
        { doseId: 'doseRedutorPh',  resId: 'resRedutorPh',  divId: 'resRedutorPhDiv',  calc: d => (d * fator).toFixed(0), un: 'ml' },
        { doseId: 'doseBarrilha',   resId: 'resBarrilha',   divId: 'resBarrilhaDiv',   calc: d => (d * fator).toFixed(0), un: 'g'  },
        { doseId: 'doseClarificador',resId:'resClarificador',divId:'resClarificadorDiv',calc: d => (d * fator).toFixed(0), un: 'ml' },
        { doseId: 'doseAlgicida',   resId: 'resAlgicida',   divId: 'resAlgicidaDiv',   calc: d => (d * fator).toFixed(0), un: 'ml' },
        { doseId: 'doseCloro',      resId: 'resCloro',      divId: 'resCloroDiv',      calc: d => (d * fator).toFixed(0), un: 'g'  },
        { doseId: 'doseCloroChoque',resId: 'resCloroChoque',divId: 'resCloroChoqueDiv',calc: d => (d * fator).toFixed(0), un: 'g'  },
        { doseId: 'doseFloculante', resId: 'resFloculante', divId: 'resFloculanteDiv', calc: d => (d * fator).toFixed(0), un: 'ml' }
    ];

    let algumProduto = false;
    dadosUltimoCalculo.produtos = [];

    produtos.forEach(p => {
        const dose = parseFloat(document.getElementById(p.doseId).value);
        const div = document.getElementById(p.divId);
        if (!isNaN(dose) && dose > 0) {
            const qtd = p.calc(dose);
            document.getElementById(p.resId).innerText = Number(qtd).toLocaleString('pt-BR');
            div.classList.remove('hidden');
            algumProduto = true;
            dadosUltimoCalculo.produtos.push({ id: p.doseId, qtd, un: p.un });
        } else {
            div.classList.add('hidden');
        }
    });

    if (!algumProduto) {
        alert("Preencha a dosagem de ao menos um produto!");
        return;
    }

    document.getElementById('resultado-produtos').classList.remove('hidden');
}

// =============================================
// PASSO 4 — CALCULAR FILTRAÇÃO
// =============================================
function calcularFiltragem() {
    if (volumeTotalLitros <= 0) {
        alert("Volte ao Passo 1 e calcule o volume primeiro!");
        irParaPasso(1);
        return;
    }

    const m3 = volumeTotalLitros / 1000;
    const vazao = parseFloat(document.getElementById('vazaoBomba').value) || 0;

    if (vazao <= 0) {
        alert("Informe a vazão da bomba!");
        return;
    }

    const horas = m3 / vazao;
    const h = Math.floor(horas);
    const min = Math.round((horas - h) * 60);
    const tempoStr = min > 0 ? `${h}h ${min}min` : `${h}h`;

    const msg = `💡 <strong>Piscina:</strong> ${m3.toFixed(2)} m³ &nbsp;|&nbsp; <strong>Bomba:</strong> ${vazao.toFixed(1)} m³/h<br><br>
    ✅ Ligue o motor por <strong>${tempoStr}</strong> para filtrar toda a água hoje.`;

    document.getElementById('textoBomba').innerHTML = msg;
    document.getElementById('resultado-bomba').classList.remove('hidden');

    dadosUltimoCalculo.bomba = { m3: m3.toFixed(2), vazao, tempo: tempoStr };
}

// =============================================
// HISTÓRICO — SALVAR
// =============================================
function salvarHistorico() {
    if (!dadosUltimoCalculo.volume) {
        alert("Calcule o volume da piscina antes de salvar!");
        return;
    }

    const obs = document.getElementById('obsHistorico').value.trim();
    const agora = new Date();
    const dataStr = agora.toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' });
    const horaStr = agora.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });

    let statusSal = 'ok';
    if (dadosUltimoCalculo.salinidade) {
        statusSal = dadosUltimoCalculo.salinidade.status || 'ok';
    }

    const registro = {
        id: Date.now(),
        data: `${dataStr} às ${horaStr}`,
        statusSal,
        volume: dadosUltimoCalculo.volume || null,
        salinidade: dadosUltimoCalculo.salinidade || null,
        bomba: dadosUltimoCalculo.bomba || null,
        produtos: dadosUltimoCalculo.produtos || [],
        obs
    };

    const historico = JSON.parse(localStorage.getItem('pooltech-historico') || '[]');
    historico.unshift(registro);
    localStorage.setItem('pooltech-historico', JSON.stringify(historico));

    document.getElementById('obsHistorico').value = '';

    const btn = event.target;
    const textoOriginal = btn.innerText;
    btn.innerText = '✅ Salvo!';
    btn.disabled = true;
    setTimeout(() => { btn.innerText = textoOriginal; btn.disabled = false; }, 2000);

    renderizarHistorico();
}

// =============================================
// HISTÓRICO — RENDERIZAR
// =============================================
function renderizarHistorico() {
    const historico = JSON.parse(localStorage.getItem('pooltech-historico') || '[]');
    const lista = document.getElementById('historico-lista');

    const btnHist = document.querySelector('.btn-historico-topo span:last-child');
    if (btnHist) btnHist.textContent = historico.length > 0 ? `Histórico (${historico.length})` : 'Histórico';

    if (historico.length === 0) {
        lista.innerHTML = '<p class="historico-vazio">Nenhum tratamento salvo ainda.</p>';
        return;
    }

    const nomesProdutos = {
        doseSal: 'Sal', doseRedutorPh: 'Red. pH', doseBarrilha: 'Barrilha',
        doseClarificador: 'Clarificador', doseAlgicida: 'Algicida',
        doseCloro: 'Cloro Manut.', doseCloroChoque: 'Cloro Choque', doseFloculante: 'Floculante'
    };

    const formatoNome = { retangular: 'Retangular', redonda: 'Redonda', oval: 'Oval', irregular: 'Irregular' };
    const corStatus  = { ok: '#00d084', atencao: '#ffb300', critico: '#ff4d6d' };
    const iconeStatus = { ok: '✅', atencao: '⚠️', critico: '🚨' };
    const textoStatus = { ok: 'Salinidade OK', atencao: 'Atenção ao sal', critico: 'Sal crítico' };

    const porMes = {};
    historico.forEach(r => {
        const partes = r.data.split(' às ')[0].split(' ');
        const chave = partes.slice(1).join(' ');
        if (!porMes[chave]) porMes[chave] = [];
        porMes[chave].push(r);
    });

    lista.innerHTML = Object.entries(porMes).map(([mes, registros]) => `
        <div class="hist-mes-label">${mes}</div>
        ${registros.map(r => {
            const cor = corStatus[r.statusSal] || corStatus.ok;
            const prodStr = r.produtos && r.produtos.length > 0
                ? r.produtos.map(p => `<span class="hist-tag">${nomesProdutos[p.id] || p.id}: <strong>${Number(p.qtd).toLocaleString('pt-BR')} ${p.un}</strong></span>`).join('')
                : null;

            return `
            <div class="historico-item" style="border-left-color: ${cor}">
                <div class="hist-topo">
                    <div class="hist-data">🕐 ${r.data}</div>
                    ${r.salinidade ? `<div class="hist-status-badge" style="color:${cor}">${iconeStatus[r.statusSal] || '✅'} ${textoStatus[r.statusSal] || 'OK'}</div>` : ''}
                </div>
                <div class="hist-grid">
                    ${r.volume ? `
                    <div class="hist-bloco">
                        <span class="hist-bloco-label">💧 Volume</span>
                        <span class="hist-bloco-valor">${r.volume.litros.toLocaleString('pt-BR')} L</span>
                        <span class="hist-bloco-sub">${r.volume.m3} m³ · ${formatoNome[r.volume.formato] || r.volume.formato}</span>
                    </div>` : ''}
                    ${r.salinidade ? `
                    <div class="hist-bloco">
                        <span class="hist-bloco-label">🧂 Salinidade</span>
                        <span class="hist-bloco-valor">${r.salinidade.leitura} ppm</span>
                        <span class="hist-bloco-sub">${r.salinidade.marca}</span>
                    </div>` : ''}
                    ${r.bomba ? `
                    <div class="hist-bloco">
                        <span class="hist-bloco-label">⏱ Filtração</span>
                        <span class="hist-bloco-valor">${r.bomba.tempo}</span>
                        <span class="hist-bloco-sub">${r.bomba.vazao} m³/h</span>
                    </div>` : ''}
                </div>
                ${prodStr ? `<div class="hist-produtos">${prodStr}</div>` : ''}
                ${r.obs ? `<div class="hist-obs">📝 ${r.obs}</div>` : ''}
                <button class="hist-btn-apagar" onclick="apagarRegistro(${r.id})">🗑 apagar</button>
            </div>`;
        }).join('')}
    `).join('');
}

// =============================================
// HISTÓRICO — APAGAR REGISTRO INDIVIDUAL
// =============================================
function apagarRegistro(id) {
    let historico = JSON.parse(localStorage.getItem('pooltech-historico') || '[]');
    historico = historico.filter(r => r.id !== id);
    localStorage.setItem('pooltech-historico', JSON.stringify(historico));
    renderizarHistorico();
}


// =============================================
// HISTÓRICO — ABRIR / FECHAR
// =============================================
function abrirHistorico() {
    renderizarHistorico();
    document.getElementById('historico-overlay').classList.remove('hidden');
    document.getElementById('historico-panel').classList.remove('hidden');
}

function fecharHistorico() {
    document.getElementById('historico-overlay').classList.add('hidden');
    document.getElementById('historico-panel').classList.add('hidden');
}

// =============================================
// HISTÓRICO — LIMPAR
// =============================================
function limparHistorico() {
    if (confirm("Apagar todo o histórico de tratamentos?")) {
        localStorage.removeItem('pooltech-historico');
        renderizarHistorico();
    }
}

// =============================================
// ZERAR PAINEL
// =============================================
function zerarPainel() {
    const ids = [
        'compFundo','largFundo','profFundo','compPrainha','largPrainha','profPrainha',
        'diametroRedonda','profRedonda','compOval','largOval','profOval',
        'compIrregular','largIrregular','profIrregular',
        'doseSal','doseRedutorPh','doseBarrilha','doseClarificador',
        'doseAlgicida','doseCloro','doseCloroChoque','doseFloculante',
        'leituraVisor','vazaoBomba','obsHistorico'
    ];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

    ['resultado-volume','resultado-salinidade','resultado-produtos','resultado-bomba'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    document.querySelectorAll('.resultado-inline').forEach(el => el.classList.add('hidden'));

    const primBtn = document.querySelector('.fmt-btn');
    if (primBtn) mudarAba('retangular', primBtn);

    volumeTotalLitros = 0;
    dadosUltimoCalculo = {};
    irParaPasso(1);
}

// =============================================
// DROPDOWN DE IDIOMA
// =============================================
function toggleLangMenu() {
    const menu = document.getElementById('langMenu');
    menu.classList.toggle('hidden');
}

function selecionarIdioma(lang) {
    aplicarIdioma(lang);
    // Atualiza o botão ativo com a bandeira/sigla
    const flags = { pt: '🇧🇷 PT', en: '🇺🇸 EN', es: '🇦🇷 ES' };
    document.getElementById('langAtivo').textContent = flags[lang];
    // Marca a opção ativa no menu
    document.querySelectorAll('.lang-opcao').forEach(btn => {
        btn.classList.toggle('ativo', btn.dataset.lang === lang);
    });
    document.getElementById('langMenu').classList.add('hidden');
}

// Fecha o menu ao clicar fora
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('langDropdown');
    if (dropdown && !dropdown.contains(e.target)) {
        document.getElementById('langMenu').classList.add('hidden');
    }
});

// =============================================
// VOLUME DIRETO (TOGGLE)
// =============================================
function alternarModoVolume(checkbox) {
    const secaoFormatos = document.getElementById('secaoFormatos');
    const inputDireto = document.getElementById('inputVolumeDirecto');
    if (checkbox.checked) {
        secaoFormatos.classList.add('hidden');
        inputDireto.classList.remove('hidden');
    } else {
        secaoFormatos.classList.remove('hidden');
        inputDireto.classList.add('hidden');
    }
}

// =============================================
// MODAL INFO DOS PRODUTOS
// =============================================
const infoProdutos = {
    sal: {
        icone: '🧂',
        titulo: { pt: 'Sal', en: 'Salt', es: 'Sal' },
        texto: {
            pt: 'O sal é o insumo principal dos geradores de cloro por eletrólise. Ele é convertido em cloro ativo pelo aparelho, eliminando bactérias e micro-organismos. Diferente do cloro convencional, o sal não evapora — apenas é consumido junto com a água pelo ladrão ou respingos.',
            en: 'Salt is the main input for electrolysis chlorine generators. It is converted into active chlorine by the device, eliminating bacteria and microorganisms. Unlike conventional chlorine, salt does not evaporate — it is only consumed along with water through splash or overflow.',
            es: 'La sal es el insumo principal de los generadores de cloro por electrólisis. Es convertida en cloro activo por el aparato, eliminando bacterias y microorganismos. A diferencia del cloro convencional, la sal no se evapora — solo se consume junto con el agua por el desagüe o salpicaduras.'
        }
    },
    redutorPh: {
        icone: '🔽',
        titulo: { pt: 'Redutor de pH', en: 'pH Reducer', es: 'Reductor de pH' },
        texto: {
            pt: 'O redutor de pH (geralmente ácido muriático ou sulfúrico) é usado quando o pH da água está acima de 7,6. pH elevado reduz a eficiência do cloro e pode causar turbidez, irritação nos olhos e incrustações nas paredes da piscina.',
            en: 'pH reducer (usually muriatic or sulfuric acid) is used when the water pH is above 7.6. High pH reduces chlorine efficiency and can cause turbidity, eye irritation and scale on pool walls.',
            es: 'El reductor de pH (generalmente ácido muriático o sulfúrico) se usa cuando el pH del agua supera 7,6. Un pH alto reduce la eficiencia del cloro y puede causar turbidez, irritación en los ojos e incrustaciones en las paredes.'
        }
    },
    barrilha: {
        icone: '🔼',
        titulo: { pt: 'Barrilha', en: 'Soda Ash', es: 'Carbonato de Sodio' },
        texto: {
            pt: 'A barrilha (carbonato de sódio) é usada para aumentar o pH da água quando está abaixo de 7,2. pH baixo torna a água agressiva, corroendo equipamentos metálicos, irritando pele e olhos e reduzindo a vida útil do revestimento da piscina.',
            en: 'Soda ash (sodium carbonate) is used to raise the water pH when it falls below 7.2. Low pH makes the water aggressive, corroding metal equipment, irritating skin and eyes, and reducing the lifespan of the pool lining.',
            es: 'El carbonato de sodio se usa para aumentar el pH del agua cuando está por debajo de 7,2. Un pH bajo hace que el agua sea agresiva, corroyendo equipos metálicos, irritando la piel y los ojos y reduciendo la vida útil del revestimiento.'
        }
    },
    clarificador: {
        icone: '✨',
        titulo: { pt: 'Clarificador', en: 'Clarifier', es: 'Clarificador' },
        texto: {
            pt: 'O clarificador agrupa partículas microscópicas suspensas na água (poeira, protetor solar, células mortas) em flocos maiores, que são capturados pelo filtro. Ele deixa a água cristalina e azulada. Ideal usar após muito uso da piscina ou entrada de sujeira.',
            en: 'Clarifier groups microscopic particles suspended in the water (dust, sunscreen, dead cells) into larger flocs, which are captured by the filter. It leaves the water crystal clear and blue. Ideal to use after heavy pool use or after dirt gets in.',
            es: 'El clarificador agrupa partículas microscópicas suspendidas en el agua (polvo, protector solar, células muertas) en flóculos más grandes que son capturados por el filtro. Deja el agua cristalina y azulada. Ideal después de mucho uso o entrada de suciedad.'
        }
    },
    algicida: {
        icone: '🌿',
        titulo: { pt: 'Algicida', en: 'Algaecide', es: 'Algicida' },
        texto: {
            pt: 'O algicida previne e elimina o crescimento de algas na piscina. As algas deixam a água verde, turva e escorregadia. Deve ser usado preventivamente a cada 15 dias, ou em dose de choque quando a água já está verde.',
            en: 'Algaecide prevents and eliminates algae growth in the pool. Algae make the water green, cloudy and slippery. It should be used preventively every 15 days, or in shock dose when the water is already green.',
            es: 'El algicida previene y elimina el crecimiento de algas en la piscina. Las algas ponen el agua verde, turbia y resbaladiza. Debe usarse preventivamente cada 15 días, o en dosis de choque cuando el agua ya está verde.'
        }
    },
    cloro: {
        icone: '🧪',
        titulo: { pt: 'Cloro Manutenção', en: 'Maintenance Chlorine', es: 'Cloro Mantenimiento' },
        texto: {
            pt: 'O cloro de manutenção é adicionado regularmente (geralmente a cada 2 a 3 dias) para manter o nível de cloro livre entre 1 e 3 ppm. Ele elimina bactérias, vírus e fungos, mantendo a água segura para o banho.',
            en: 'Maintenance chlorine is added regularly (usually every 2 to 3 days) to keep the free chlorine level between 1 and 3 ppm. It eliminates bacteria, viruses and fungi, keeping the water safe for swimming.',
            es: 'El cloro de mantenimiento se agrega regularmente (generalmente cada 2 a 3 días) para mantener el nivel de cloro libre entre 1 y 3 ppm. Elimina bacterias, virus y hongos, manteniendo el agua segura para el baño.'
        }
    },
    choque: {
        icone: '⚡',
        titulo: { pt: 'Cloro de Choque', en: 'Shock Chlorine', es: 'Cloro de Choque' },
        texto: {
            pt: 'O cloro de choque é aplicado em dose alta para eliminar rapidamente contaminações sérias: água verde, turva, após chuva forte ou uso intenso. A dose é de 5 a 10 vezes maior que a manutenção. Após o choque, aguarde o cloro baixar antes de entrar na piscina.',
            en: 'Shock chlorine is applied in high doses to quickly eliminate serious contamination: green water, cloudy water, after heavy rain or intense use. The dose is 5 to 10 times higher than maintenance. After shocking, wait for the chlorine to drop before entering the pool.',
            es: 'El cloro de choque se aplica en dosis alta para eliminar rápidamente contaminaciones graves: agua verde, turbia, después de lluvias fuertes o uso intensivo. La dosis es 5 a 10 veces mayor que la de mantenimiento. Después del choque, espere que el cloro baje antes de entrar.'
        }
    },
    floculante: {
        icone: '🌀',
        titulo: { pt: 'Floculante', en: 'Flocculant', es: 'Floculante' },
        texto: {
            pt: 'O floculante faz as partículas finas da água se unirem em grumos que afundam no fundo da piscina, sendo então removidos com o aspirador. Diferente do clarificador, o floculante deposita no fundo em vez de ir para o filtro. Requer aspiração manual após a aplicação.',
            en: 'Flocculant causes fine particles in the water to clump together and sink to the bottom of the pool, where they are then removed with a vacuum. Unlike clarifier, flocculant settles on the bottom instead of going to the filter. Manual vacuuming is required after application.',
            es: 'El floculante hace que las partículas finas del agua se unan en grumos que se hunden en el fondo de la piscina y luego se eliminan con la aspiradora. A diferencia del clarificador, el floculante se deposita en el fondo en lugar de ir al filtro. Requiere aspiración manual.'
        }
    }
};

function abrirInfo(produto) {
    const info = infoProdutos[produto];
    if (!info) return;
    const lang = idiomaAtivo || 'pt';
    document.getElementById('modalIcone').textContent = info.icone;
    document.getElementById('modalTitulo').textContent = info.titulo[lang];
    document.getElementById('modalTexto').textContent = info.texto[lang];
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('modalInfo').classList.remove('hidden');
}

function fecharInfo() {
    document.getElementById('modalOverlay').classList.add('hidden');
    document.getElementById('modalInfo').classList.add('hidden');
}
