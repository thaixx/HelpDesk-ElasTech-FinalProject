//===================================
//dados mockados
const cards = [
  {
    id: 1,
    title: "Login não está funcionando",
    description: "Usuário relata erro ao tentar fazer login no sistema e é redirecionado para a página inicial.",
    category: "Bug",
    priority: "Alta",
    status: "Em andamento",
    responsible: "Larissa Faria",
    created: "11/10/2025",
    dueDate: "15/10/2025",
  },
  {
    id: 2,
    title: "Implementar Dark Mode",
    description: "Criar uma opção para que o usuário possa alternar para o tema escuro no dashboard.",
    category: "Melhoria",
    priority: "Média",
    status: "Pendente",
    responsible: "Gabriel Costa",
    created: "05/10/2025",
    dueDate: "20/10/2025",
  },
  {
    id: 3,
    title: "Erro 404 ao acessar relatórios",
    description: "Ao clicar no link 'Relatórios Mensais', o sistema retorna um erro 404 (página não encontrada).",
    category: "Bug",
    priority: "Alta",
    status: "Concluído",
    responsible: "Fernanda Tisco",
    created: "01/10/2025",
    dueDate: "05/10/2025",
  },
  {
    id: 4,
    title: "Atualizar biblioteca de gráficos",
    description: "Substituir a atual biblioteca de gráficos por uma mais moderna e responsiva (ex: Chart.js).",
    category: "Manutenção",
    priority: "Baixa",
    status: "Em andamento",
    responsible: "Larissa Faria",
    created: "25/09/2025",
    dueDate: "30/11/2025",
  },
  {
    id: 5,
    title: "Configurar integrações com Slack",
    description: "Permitir que notificações de novos cards sejam enviadas automaticamente para um canal do Slack.",
    category: "Integração",
    priority: "Média",
    status: "Pendente",
    responsible: "Gabriel Costa",
    created: "12/10/2025",
    dueDate: "18/10/2025",
  },
  {
    id: 6,
    title: "Documentação de API",
    description: "Revisar e atualizar a documentação da API para os endpoints de usuário e cards.",
    category: "Documentação",
    priority: "Baixa",
    status: "Concluído",
    responsible: "Larissa Faria",
    created: "08/10/2025",
    dueDate: "10/10/2025",
  },
  {
    id: 7,
    title: "Otimização de performance no load inicial",
    description: "Identificar gargalos e otimizar o carregamento de recursos na página principal.",
    category: "Melhoria",
    priority: "Alta",
    status: "Em andamento",
    responsible: "Fernanda Tisco",
    created: "09/10/2025",
    dueDate: "25/10/2025",
  },
];

let filteredCards = [...cards];
let selectedDueDateMonth = null;

//=======================================================
//elementos da tabela 
const tableBody = document.querySelector(".table-section tbody");

//filtro:
const statusFilter = document.getElementById('statusFilter');
const searchInput = document.getElementById("filterInput");
///////

//calendario:
const btnDataVencimento = document.getElementById("btnDataVencimento");
const calendarModal = document.getElementById("calendarModal");
const closeCalendar = document.getElementById("closeCalendar");
const monthInput = document.getElementById("monthSelect");

/**
 * Normaliza o texto removendo acentos e convertendo para minúsculas.
 * @param {string} str - O texto a ser formatado.
 * @returns {string} O texto formatado.
 */
function formatText(str) {
  if (!str) return "";
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function getCategoryTag(category) {
    const map = {
        'bug': 'bug',
        'melhoria': 'alta', // Usando 'alta' para dar cor diferente
        'manutenção': 'andamento', // Usando 'andamento' para dar cor diferente
        'integração': 'alta',
        'documentação': 'andamento',
    };
    const key = formatText(category);
    return map[key] || ''; 
}

function getPriorityTag(priority) {
  return formatText(priority) === 'alta' ? 'alta' : 'andamento';
};

function getStatusTag(status) {
  const key = formatText(status);
  if (key === 'Em andamento') return 'Andamento';
  if (key === 'Pendente') return 'Pendente';
  if (key == 'Concluído') return 'Concluído';

};

// ====================================================================
//                          LÓGICA DE FILTROS
// ====================================================================

function parseDate(dateString) {
  if (!dateString) return null;
  const parts = dateString.split('/');
  // Cria Date(ano, mês-1, dia)
  return new Date(parts[2], parts[1] - 1, parts[0]);
}

function filterSearch(card, searchText) {
if (!searchText) return true;
return formatText(card.description).includes(searchText) || formatText(card.title).includes(searchText);
}

function filterPriority(cardPriority, filterValue) {
if (!filterValue) return true;
return formatText(cardPriority).includes(formatText(filterValue));
}

function filterStatus(cardStatus, filterValue) {
if (!filterValue) return true;
return formatText(cardStatus).includes(formatText(filterValue));
}

function filterCards() {
  if (!dateString) return null;
  const parts = dateString.split('/');
  // Cria Date(ano, mês-1, dia)
  return new Date(parts[2], parts[1] - 1, parts[0]);
}

/**
* Aplica todos os filtros simultaneamente (Busca E Status E Data).
*/
function filterCards() {
const searchText = formatText(searchInput.value);
const status = statusFilter.value;

const filteredCards = cards.filter(card => {
  
    // 1. Filtro por Busca (título e descrição)
    const matchesSearch = !searchText || 
      formatText(card.description).includes(searchText) || 
      formatText(card.title).includes(searchText);

    // 2. Filtro por Status
      const matchesStatus = !status || formatText(card.status) === formatText(status);
    
    // 3. Filtro por Data de Vencimento (Mês e Ano)
    let matchesDueDate = true;
    if (selectedDueDateMonth) {
        const cardDate = parseDate(card.dueDate);
        const [filterYear, filterMonth] = selectedDueDateMonth.split("-");

        matchesDueDate = cardDate && 
            (cardDate.getMonth() + 1).toString().padStart(2, '0') === filterMonth && 
            cardDate.getFullYear().toString() === filterYear;
    }
    
    // Apenas cards que passam por TODOS os filtros são retornados
    return matchesSearch && matchesStatus && matchesDueDate;
  });

  renderTable(filteredCards);
}

// ====================================================================
//                          LÓGICA DE RENDERIZAÇÃO
// ====================================================================

function parseDate(dateString) {
  if (!dateString) return null;
  const parts = dateString.split('/');
  // Cria Date(ano, mês-1, dia)
  return new Date(parts[2], parts[1] - 1, parts[0]);
}

/**
* Aplica todos os filtros simultaneamente (Busca E Status E Data).
*/
function filterCards() {
const searchText = formatText(searchInput.value);
const status = statusFilter.value;

const filteredCards = cards.filter(card => {
  
  // 1. Filtro por Busca (título e descrição)
  const matchesSearch = !searchText || 
    formatText(card.description).includes(searchText) || 
    formatText(card.title).includes(searchText);

  // 2. Filtro por Status
  const matchesStatus = !status || formatText(card.status) === formatText(status);
  
  // 3. Filtro por Data de Vencimento (Mês e Ano)
  let matchesDueDate = true;
  if (selectedDueDateMonth) {
      const cardDate = parseDate(card.dueDate);
      const [filterYear, filterMonth] = selectedDueDateMonth.split("-");

      matchesDueDate = cardDate && 
          (cardDate.getMonth() + 1).toString().padStart(2, '0') === filterMonth && 
          cardDate.getFullYear().toString() === filterYear;
  }
  
  // Apenas cards que passam por TODOS os filtros são retornados
  return matchesSearch && matchesStatus && matchesDueDate;
});

renderTable(filteredCards);
}

// ====================================================================
//                          LÓGICA DE RENDERIZAÇÃO DA TABELA
// ====================================================================

function createTableRow(card) {
return `
  <tr>
    <td>
      <strong>${card.title}</strong>
      <p>${card.description.substring(0, 50)}...</p>
    </td>
    <td><span class="tag ${getCategoryTag(card.category)}">${card.category}</span></td>
    <td><span class="tag ${getPriorityTag(card.priority)}">${card.priority}</span></td>
    <td><span class="tag ${getStatusTag(card.status)}">${card.status}</span></td>
    <td>${card.responsible}</td>
    <td>${card.created}</td>
    <td>${card.dueDate}</td>
  </tr>
`;
}

function renderTable(data = cards) {
if (data.length === 0) {
  tableBody.innerHTML = '<tr><td colspan="7">Nenhum card encontrado com os filtros aplicados.</td></tr>';
} else {
  tableBody.innerHTML = data.map(createTableRow).join('');
}
}

// ====================================================================
//                          EVENT LISTENERS E MODAL DE DATA
// ====================================================================

// Filtros disparam a função de filtragem a cada mudança
searchInput.addEventListener("input", filterCards);
statusFilter.addEventListener("change", filterCards);


// Lógica do Modal de Calendário
btnDataVencimento.addEventListener('click', (e) => {
e.stopPropagation(); 
// Alterna a exibição do modal
calendarModal.style.display = calendarModal.style.display === 'block' ? 'none' : 'block';
});

closeCalendar.addEventListener('click', () => {
const selectedMonthValue = monthInput.value; // Recebe AAAA-MM

if (selectedMonthValue) {
  selectedDueDateMonth = selectedMonthValue; 
  
  // Atualiza o texto do botão com o mês/ano escolhido
  const [year, month] = selectedMonthValue.split("-");
  const date = new Date(year, month - 1);
  const nomeMes = date.toLocaleString('pt-BR', { month: 'long' });
  btnDataVencimento.textContent = `${nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)} / ${year}`;
} else {
  // Caso o input esteja vazio (limpando o filtro de data)
  selectedDueDateMonth = null; 
  btnDataVencimento.textContent = "Data de vencimento";
}

// Fecha o modal e aplica os filtros
calendarModal.style.display = 'none';
filterCards();
});

// Listener para fechar o modal ao clicar fora
document.addEventListener('click', (e) => {
// Verifica se o modal está visível E se o clique não foi dentro do modal OU no botão que o abre
if (calendarModal.style.display === 'block' && 
    !calendarModal.contains(e.target) && 
    e.target !== btnDataVencimento) {
  calendarModal.style.display = 'none';
}
});

// ====================================================================
//                          INICIALIZAÇÃO
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Cria os ícones Lucide
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
  }
  // 2. Renderiza a tabela inicial (todos os cards)
  renderTable();
});