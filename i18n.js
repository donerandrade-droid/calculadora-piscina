// =============================================
// POOLTECH — SISTEMA DE TRADUÇÕES (i18n)
//
// Como funciona:
// - Cada texto do app tem uma "chave" (ex: 'nav.volume')
// - Para cada chave existe a tradução em PT, EN e ES
// - Quando o usuário troca o idioma, a função aplicarIdioma()
//   percorre todos os elementos com data-i18n="chave"
//   e substitui o texto pela tradução correta.
// =============================================

const traducoes = {

    // ── IDIOMAS (nomes dos botões de seleção) ──
    'idioma.pt': { pt: '🇧🇷 PT', en: '🇧🇷 PT', es: '🇧🇷 PT' },
    'idioma.en': { pt: '🇺🇸 EN', en: '🇺🇸 EN', es: '🇺🇸 EN' },
    'idioma.es': { pt: '🇦🇷 ES', en: '🇦🇷 ES', es: '🇦🇷 ES' },

    // ── HEADER ──
    'header.historico': {
        pt: 'Histórico',
        en: 'History',
        es: 'Historial'
    },

    // ── HERO ──
    'hero.tag': {
        pt: 'Sistema de Diagnóstico',
        en: 'Diagnostic System',
        es: 'Sistema de Diagnóstico'
    },
    'hero.titulo1': {
        pt: 'Sua piscina',
        en: 'Your pool',
        es: 'Tu piscina'
    },
    'hero.titulo2': {
        pt: 'em equilíbrio.',
        en: 'in balance.',
        es: 'en equilibrio.'
    },
    'hero.sub': {
        pt: 'Calcule volumes, produtos e monitore a salinidade em poucos passos.',
        en: 'Calculate volumes, chemicals and monitor salinity in a few steps.',
        es: 'Calcula volúmenes, productos y monitorea la salinidad en pocos pasos.'
    },

    // ── NAVEGAÇÃO DE PASSOS ──
    'step.volume':     { pt: 'Volume',     en: 'Volume',    es: 'Volumen'   },
    'step.produtos':   { pt: 'Produtos',   en: 'Chemicals', es: 'Productos' },
    'step.salinidade': { pt: 'Salinidade', en: 'Salinity',  es: 'Salinidad' },
    'step.bomba':      { pt: 'Bomba',      en: 'Pump',      es: 'Bomba'     },

    // ── PASSO 1: VOLUME ──
    'p1.titulo':       { pt: 'Volume da Piscina',                          en: 'Pool Volume',                              es: 'Volumen de la Piscina'                     },
    'p1.desc':         { pt: 'Selecione o formato e informe as dimensões.', en: 'Select the shape and enter the dimensions.', es: 'Seleccione el formato e ingrese las medidas.' },
    'p1.retangular':   { pt: 'Retangular', en: 'Rectangular', es: 'Rectangular' },
    'p1.redonda':      { pt: 'Redonda',    en: 'Round',        es: 'Redonda'     },
    'p1.oval':         { pt: 'Oval',       en: 'Oval',         es: 'Oval'        },
    'p1.irregular':    { pt: 'Irregular',  en: 'Freeform',     es: 'Irregular'   },
    'p1.fundaTitulo':  { pt: '🌊 Parte Funda',       en: '🌊 Deep End',        es: '🌊 Parte Profunda'   },
    'p1.prainhaTitulo':{ pt: '🏖 Prainha / Rasa',    en: '🏖 Shallow End',     es: '🏖 Zona Poco Profunda' },
    'p1.comprimento':  { pt: 'Comprimento', en: 'Length',   es: 'Largo'      },
    'p1.largura':      { pt: 'Largura',     en: 'Width',    es: 'Ancho'      },
    'p1.profundidade': { pt: 'Profundidade',en: 'Depth',    es: 'Profundidad'},
    'p1.diametro':     { pt: 'Diâmetro',    en: 'Diameter', es: 'Diámetro'   },
    'p1.profMedia':    { pt: 'Profundidade Média', en: 'Average Depth', es: 'Profundidad Media' },
    'p1.compMaior':    { pt: 'Comprimento Maior',  en: 'Longest Side',  es: 'Lado Más Largo'   },
    'p1.largMaior':    { pt: 'Largura Maior',       en: 'Widest Side',   es: 'Lado Más Ancho'   },
    'p1.compMax':      { pt: 'Comprimento Máximo',  en: 'Max Length',    es: 'Largo Máximo'     },
    'p1.largMax':      { pt: 'Largura Máxima',      en: 'Max Width',     es: 'Ancho Máximo'     },
    'p1.btnCalc':      { pt: '💧 Calcular Volume',  en: '💧 Calculate Volume', es: '💧 Calcular Volumen' },
    'p1.btnZerar':     { pt: '♻️ Zerar',            en: '♻️ Reset',           es: '♻️ Limpiar'         },
    'p1.proxBtn':      { pt: 'Próximo: Produtos →', en: 'Next: Chemicals →',  es: 'Siguiente: Productos →' },
    'p1.jasei':        { pt: 'Já sei o volume',     en: 'I know the volume',  es: 'Ya sé el volumen'   },
    'p1.volumeDirectoLabel': { pt: 'Volume da piscina', en: 'Pool volume', es: 'Volumen de la piscina' },

    // ── RESULTADO VOLUME ──
    'vol.titulo':  { pt: '📋 Relatório de Litragem', en: '📋 Volume Report',    es: '📋 Reporte de Volumen' },
    'vol.litros':  { pt: 'Litros',                   en: 'Liters',              es: 'Litros'                },
    'vol.m3':      { pt: 'm³',                       en: 'm³',                  es: 'm³'                    },

    // ── PASSO 2: PRODUTOS ──
    'p2.titulo':   { pt: 'Produtos Químicos',                      en: 'Pool Chemicals',                       es: 'Productos Químicos'                    },
    'p2.desc':     { pt: 'Preencha apenas os produtos que vai usar.', en: 'Fill in only the products you will use.', es: 'Complete solo los productos que usará.' },
    'p2.sal':      { pt: 'Sal',             en: 'Salt',          es: 'Sal'           },
    'p2.salDose':  { pt: 'g por litro',     en: 'g per liter',   es: 'g por litro'   },
    'p2.redPh':    { pt: 'Redutor de pH',   en: 'pH Reducer',    es: 'Reductor de pH'},
    'p2.barrilha': { pt: 'Barrilha',        en: 'Soda Ash',      es: 'Carbonato'     },
    'p2.clarif':   { pt: 'Clarificador',    en: 'Clarifier',     es: 'Clarificador'  },
    'p2.algicida': { pt: 'Algicida',        en: 'Algaecide',     es: 'Algicida'      },
    'p2.cloro':    { pt: 'Cloro Manutenção',en: 'Maintenance Chlorine', es: 'Cloro Mantenimiento' },
    'p2.choque':   { pt: 'Cloro de Choque', en: 'Shock Chlorine',       es: 'Cloro de Choque'    },
    'p2.floc':     { pt: 'Floculante',      en: 'Flocculant',           es: 'Floculante'         },
    'p2.dose1000': { pt: 'ml por 1.000L',   en: 'ml per 1,000L',        es: 'ml por 1.000L'      },
    'p2.doseg':    { pt: 'g por 1.000L',    en: 'g per 1,000L',         es: 'g por 1.000L'       },
    'p2.adicionar':{ pt: 'Adicionar:',      en: 'Add:',                 es: 'Agregar:'            },
    'p2.btnCalc':  { pt: '🧴 Calcular Produtos', en: '🧴 Calculate Chemicals', es: '🧴 Calcular Productos' },
    'p2.proxBtn':  { pt: 'Próximo: Salinidade →', en: 'Next: Salinity →', es: 'Siguiente: Salinidad →' },
    'p2.voltar':   { pt: '← Voltar', en: '← Back', es: '← Volver' },

    // ── PASSO 3: SALINIDADE ──
    'p3.titulo':   { pt: 'Diagnóstico do Gerador',      en: 'Generator Diagnosis',       es: 'Diagnóstico del Generador'    },
    'p3.desc':     { pt: 'Leitura do visor de salinidade.', en: 'Salinity display reading.', es: 'Lectura del visor de salinidad.' },
    'p3.marca':    { pt: 'Marca do aparelho',            en: 'Device brand',              es: 'Marca del aparato'            },
    'p3.leitura':  { pt: 'Leitura do visor (g/L ou ppm)', en: 'Display reading (g/L or ppm)', es: 'Lectura del visor (g/L o ppm)' },
    'p3.btnCalc':  { pt: '🔍 Analisar Salinidade',      en: '🔍 Analyze Salinity',       es: '🔍 Analizar Salinidad'        },
    'p3.proxBtn':  { pt: 'Próximo: Bomba →',            en: 'Next: Pump →',              es: 'Siguiente: Bomba →'           },
    'p3.voltar':   { pt: '← Voltar', en: '← Back', es: '← Volver' },

    // ── PASSO 4: BOMBA ──
    'p4.titulo':   { pt: 'Bomba e Filtração',            en: 'Pump & Filtration',         es: 'Bomba y Filtración'           },
    'p4.desc':     { pt: 'Tempo ideal de recirculação da água.', en: 'Ideal water recirculation time.', es: 'Tiempo ideal de recirculación del agua.' },
    'p4.info':     { pt: '💡 Toda a água deve ser filtrada pelo menos uma vez por dia para uma piscina saudável.',
                     en: '💡 All the water should be filtered at least once a day for a healthy pool.',
                     es: '💡 Toda el agua debe filtrarse al menos una vez al día para una piscina saludable.' },
    'p4.vazao':    { pt: 'Vazão da bomba',               en: 'Pump flow rate',            es: 'Caudal de la bomba'           },
    'p4.hint':     { pt: 'Valor indicado no corpo do motor', en: 'Value shown on the pump body', es: 'Valor indicado en el cuerpo del motor' },
    'p4.btnCalc':  { pt: '⏱ Calcular Filtração',        en: '⏱ Calculate Filtration',    es: '⏱ Calcular Filtración'       },
    'p4.voltar':   { pt: '← Voltar', en: '← Back', es: '← Volver' },

    // ── SALVAR HISTÓRICO ──
    'salvar.titulo': { pt: '💾 Salvar este tratamento no histórico?', en: '💾 Save this treatment to history?', es: '💾 ¿Guardar este tratamiento en el historial?' },
    'salvar.obs':    { pt: 'Observações (opcional)',  en: 'Notes (optional)',      es: 'Observaciones (opcional)'  },
    'salvar.placeholder': { pt: 'Ex: Água verde, após chuva...', en: 'E.g.: Green water, after rain...', es: 'Ej: Agua verde, después de lluvia...' },
    'salvar.btn':    { pt: '✅ Salvar Tratamento',    en: '✅ Save Treatment',     es: '✅ Guardar Tratamiento'    },

    // ── PAINEL HISTÓRICO ──
    'hist.titulo':  { pt: '⏱ Histórico de Tratamentos', en: '⏱ Treatment History',      es: '⏱ Historial de Tratamientos' },
    'hist.vazio':   { pt: 'Nenhum tratamento salvo ainda.', en: 'No treatments saved yet.', es: 'Aún no hay tratamientos guardados.' },
    'hist.limpar':  { pt: '🗑 Limpar Histórico',        en: '🗑 Clear History',          es: '🗑 Borrar Historial'          },
    'hist.apagar':  { pt: '🗑 apagar',                  en: '🗑 delete',                 es: '🗑 eliminar'                  },
    'hist.confirm': { pt: 'Apagar todo o histórico de tratamentos?', en: 'Delete all treatment history?', es: '¿Borrar todo el historial de tratamientos?' },

};

// ── IDIOMA ATIVO (padrão: português) ──
let idiomaAtivo = localStorage.getItem('pooltech-idioma') || 'pt';

// =============================================
// APLICA O IDIOMA NA PÁGINA INTEIRA
// =============================================
function aplicarIdioma(idioma) {
    idiomaAtivo = idioma;
    localStorage.setItem('pooltech-idioma', idioma);

    // Percorre todos os elementos que têm data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const chave = el.getAttribute('data-i18n');
        if (traducoes[chave] && traducoes[chave][idioma]) {
            // Se for um input, atualiza o placeholder
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = traducoes[chave][idioma];
            } else {
                el.innerHTML = traducoes[chave][idioma];
            }
        }
    });

    // Atualiza os botões de idioma (marca o ativo)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === idioma);
    });
}

// Aplica o idioma salvo ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    aplicarIdioma(idiomaAtivo);
});
