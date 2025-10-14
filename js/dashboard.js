// === dashboard.js atualizado ===

//===================================
//dados mockados
const cards = [
  { id: 1, title: "Login não está funcionando", description: "Usuário relata erro ao tentar fazer login no sistema e é redirecionado para a página inicial.", category: "Bug", priority: "Alta", status: "Em andamento", responsible: "Larissa Faria", created: "11/10/2025", dueDate: "15/10/2025" },
  { id: 2, title: "Implementar Dark Mode", description: "Criar uma opção para que o usuário possa alternar para o tema escuro no dashboard.", category: "Melhoria", priority: "Média", status: "Pendente", responsible: "Gabriel Costa", created: "05/10/2025", dueDate: "20/10/2025" },
  { id: 3, title: "Erro 404 ao acessar relatórios", description: "Ao clicar no link 'Relatórios Mensais', o sistema retorna um erro 404 (página não encontrada).", category: "Bug", priority: "Alta", status: "Concluído", responsible: "Fernanda Tisco", created: "01/10/2025", dueDate: "05/10/2025" },
  { id: 4, title: "Atualizar biblioteca de gráficos", description: "Substituir a atual biblioteca de gráficos por uma mais moderna e responsiva (ex: Chart.js).", category: "Manutenção", priority: "Baixa", status: "Em andamento", responsible: "Larissa Faria", created: "25/09/2025", dueDate: "30/11/2025" },
  { id: 5, title: "Configurar integrações com Slack", description: "Permitir que notificações de novos cards sejam enviadas automaticamente para um canal do Slack.", category: "Integração", priority: "Média", status: "Pendente", responsible: "Gabriel Costa", created: "12/10/2025", dueDate: "18/10/2025" },
  { id: 6, title: "Documentação de API", description: "Revisar e atualizar a documentação da API para os endpoints de usuário e cards.", category: "Documentação", priority: "Baixa", status: "Concluído", responsible: "Larissa Faria", created: "08/10/2025", dueDate: "10/10/2025" },
  { id: 7, title: "Otimização de performance no load inicial", description: "Identificar gargalos e otimizar o carregamento de recursos na página principal.", category: "Melhoria", priority: "Alta", status: "Em andamento", responsible: "Fernanda Tisco", created: "09/10/2025", dueDate: "25/10/2025" },
];

let filteredCards = [...cards];
let selectedStartDate = null;
let selectedEndDate = null;

//=======================================================
//elementos da tabela 
const tableBody = document.querySelector(".table-section tbody");
const statusFilter = document.getElementById('statusFilter');
const searchInput = document.getElementById("filterInput");

//calendario:
const btnDataVencimento = document.getElementById("btnDataVencimento");
const calendarModal = document.getElementById("calendarModal");
const closeCalendar = document.getElementById("closeCalendar");

function formatText(str) {
  if (!str) return "";
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function getCategoryTag(category) {
  const map = {
    'bug': 'bug',
    'melhoria': 'alta',
    'manutenção': 'andamento',
    'integração': 'alta',
    'documentação': 'andamento',
  };
  const key = formatText(category);
  return map[key] || ''; 
}

function getPriorityTag(priority) {
  return formatText(priority) === 'alta' ? 'alta' : 'andamento';
}

function getStatusTag(status) {
  const key = formatText(status);
  if (key.includes('andamento')) return 'andamento';
  if (key.includes('pendente')) return 'alta';
  if (key.includes('concluido')) return 'andamento';
}

function parseDate(dateString) {
  if (!dateString) return null;
  const parts = dateString.split('/');
  return new Date(parts[2], parts[1] - 1, parts[0]);
}

function filterCards() {
  const searchText = formatText(searchInput.value);
  const status = statusFilter.value;
  const hasDateFilter = selectedStartDate && selectedEndDate;

  let filtered = [...cards];

  if (hasDateFilter) {
    filtered = cards.filter(card => {
      const cardDate = parseDate(card.dueDate);
      return cardDate >= selectedStartDate && cardDate <= selectedEndDate;
    });
  } else if (status) {
    filtered = cards.filter(card => formatText(card.status) === formatText(status));
  } else if (searchText) {
    filtered = cards.filter(card =>
      formatText(card.title).includes(searchText) ||
      formatText(card.description).includes(searchText)
    );
  }

  renderTable(filtered);
}

function createTableRow(card) {
  return `
    <tr>
      <td><strong>${card.title}</strong><p>${card.description.substring(0, 50)}...</p></td>
      <td><span class="tag ${getCategoryTag(card.category)}">${card.category}</span></td>
      <td><span class="tag ${getPriorityTag(card.priority)}">${card.priority}</span></td>
      <td><span class="tag ${getStatusTag(card.status)}">${card.status}</span></td>
      <td>${card.responsible}</td>
      <td>${card.created}</td>
      <td>${card.dueDate}</td>
    </tr>`;
}

function renderTable(data = cards) {
  if (data.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7">Nenhum card encontrado com os filtros aplicados.</td></tr>';
  } else {
    tableBody.innerHTML = data.map(createTableRow).join('');
  }
}

// EVENTOS DE FILTRO
searchInput.addEventListener("input", filterCards);
statusFilter.addEventListener("change", filterCards);

// Lógica do modal de calendário
btnDataVencimento.addEventListener('click', (e) => {
  e.stopPropagation();
  calendarModal.style.display = calendarModal.style.display === 'block' ? 'none' : 'block';
});

closeCalendar.addEventListener('click', () => {
  const startValue = document.getElementById('startDate').value;
  const endValue = document.getElementById('endDate').value;

  selectedStartDate = startValue ? new Date(startValue) : null;
  selectedEndDate = endValue ? new Date(endValue) : null;

  if (selectedStartDate && selectedEndDate) {
    btnDataVencimento.textContent = `De ${startValue.split('-').reverse().join('/')} até ${endValue.split('-').reverse().join('/')}`;
  } else {
    btnDataVencimento.textContent = "Data de vencimento";
  }

  calendarModal.style.display = 'none';
  filterCards();
});

document.addEventListener('click', (e) => {
  if (calendarModal.style.display === 'block' && !calendarModal.contains(e.target) && e.target !== btnDataVencimento) {
    calendarModal.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
  renderTable();
});
