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
