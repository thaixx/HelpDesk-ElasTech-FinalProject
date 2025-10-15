
//dados mockados
const cards = [
  { id: 1, title: "Login não está funcionando", description: "Usuário relata erro ao tentar fazer login no sistema e é redirecionado para a página inicial.", category: "Bug", priority: "Alta", status: "Em andamento", responsible: "Larissa Faria", created: "11/10/2025", dueDate: "15/10/2025" },
  { id: 2, title: "Implementar Dark Mode", description: "Criar uma opção para que o usuário possa alternar para o tema escuro no dashboard.", category: "Melhoria", priority: "Média", status: "Pendente", responsible: "Gabriel Costa", created: "05/10/2025", dueDate: "20/10/2025" },
  { id: 3, title: "Erro 404 ao acessar relatórios", description: "Ao clicar no link 'Relatórios Mensais', o sistema retorna um erro 404 (página não encontrada).", category: "Bug", priority: "Alta", status: "Concluído", responsible: "Fernanda Tisco", created: "01/10/2025", dueDate: "05/10/2025" },
  { id: 4, title: "Atualizar biblioteca de gráficos", description: "Substituir a atual biblioteca de gráficos por uma mais moderna e responsiva (ex: Chart.js).", category: "Duvida", priority: "Baixa", status: "Em andamento", responsible: "Larissa Faria", created: "25/09/2025", dueDate: "30/11/2025" },
  { id: 5, title: "Configurar integrações com Slack", description: "Permitir que notificações de novos cards sejam enviadas automaticamente para um canal do Slack.", category: "Duvida", priority: "Média", status: "Pendente", responsible: "Gabriel Costa", created: "12/10/2025", dueDate: "18/10/2025" },
  { id: 6, title: "Documentação de API", description: "Revisar e atualizar a documentação da API para os endpoints de usuário e cards.", category: "Suporte", priority: "Baixa", status: "Concluído", responsible: "Larissa Faria", created: "08/10/2025", dueDate: "10/10/2025" },
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

function getStatusTag(status) {
  switch(status.toLowerCase()) {
    case 'em andamento': return 'andamento';
    case 'concluído': return 'concluido';
    case 'pendente': return 'pendente';
    default: return '';
  }
}

function getCategoryTag(category) {
  switch(category.toLowerCase()) {
    case 'bug': return 'bug';
    case 'melhoria': return 'melhoria';
    case 'suporte': return 'suporte';
    case 'duvida': return 'duvida';
    default: return '';
  }
}

function getPriorityTag(priority) {
  switch(priority.toLowerCase()) {
    case 'alta': return 'alta';
    case 'média': return 'média';
    case 'baixa': return 'baixa';
    default: return '';
  }
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
    <tr data-id="${card.id}">
      <td><strong>${card.title}</strong><p>${card.description.substring(0, 50)}...</p></td>
      <td><span class="tag ${getCategoryTag(card.category)}">${card.category}</span></td>
      <td><span class="tag ${getPriorityTag(card.priority)}">${card.priority}</span></td>
      <td>
        <div class="status-wrapper">
          <span class="tag ${getStatusTag(card.status)} status-tag" data-status="${card.status}">
            ${card.status} <span class="status-arrow">▾</span>
          </span>
          <select class="status-select" style="display:none;">
            <option value="andamento" ${card.status === 'andamento' ? 'selected' : ''}>Em andamento</option>
            <option value="pendente" ${card.status === 'pendente' ? 'selected' : ''}>Pendente</option>
            <option value="concluido" ${card.status === 'concluído' ? 'selected' : ''}>Concluído</option>
          </select>
        </div>
      </td>
      <td>${card.responsible}</td>
      <td>${card.created}</td>
      <td>${card.dueDate}</td>
    </tr>`;
}

function renderTable(data = cards) {
  if (data.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7">Nenhum card encontrado com os filtros aplicados.</td></tr>';
    return;
  }

  // 1) Renderiza a tabela
  tableBody.innerHTML = data.map(createTableRow).join('');

  // 2) Torna cada linha clicável (abre detalhes)
  const rows = document.querySelectorAll('.table-section tbody tr');
  rows.forEach(row => {
    // remove listeners duplicados (se houver) antes de adicionar
    row.replaceWith(row.cloneNode(true));
  });
  // re-seleciona depois do clone
  const freshRows = document.querySelectorAll('.table-section tbody tr');
  freshRows.forEach(row => {
    row.addEventListener('click', () => {
      const id = row.dataset.id;
      localStorage.setItem('cardsMock', JSON.stringify(cards));
      window.location.href = `card-details.html?id=${id}`;
    });
  });

  // 3) Adiciona evento de clique em cada status (depois de configurar as linhas)
  const statusTags = document.querySelectorAll('.status-tag');
  statusTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
      // impede que o clique no status dispare o clique da linha
      e.stopPropagation();

      const currentTag = e.currentTarget;
      const tr = currentTag.closest('tr');
      const cardId = parseInt(tr.dataset.id, 10);
      const currentStatus = currentTag.dataset.status;

      // Cria o select de status
      const select = document.createElement('select');
      select.classList.add('status-select');
      const options = ['Pendente', 'Em andamento', 'Concluído'];

      options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        if (opt === currentStatus) option.selected = true;
        select.appendChild(option);
      });

      // Substitui o span pelo select
      currentTag.replaceWith(select);
      select.focus();

      // Evita que cliques dentro do select subam para a linha
      select.addEventListener('click', (ev) => ev.stopPropagation());

      // Ao mudar o valor, atualiza no mock (ou chame a API aqui)
      select.addEventListener('change', () => {
        const newStatus = select.value;
        const cardIndex = cards.findIndex(c => c.id === cardId);
        if (cardIndex !== -1) {
          // atualiza no array local
          cards[cardIndex].status = newStatus;

          // por enquanto, só re-renderiza o front
          renderTable();
        }
      });

      // Se perder o foco sem mudar, volta ao original
      select.addEventListener('blur', () => {
        renderTable();
      });
    });
  });
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

//eventos de status na tabela :
document.addEventListener('click', function(e) {
  // Se clicar em uma tag de status
  if (e.target.closest('.status-tag')) {
    const wrapper = e.target.closest('.status-wrapper');
    const select = wrapper.querySelector('.status-select');
    
    // Alterna a exibição do select
    select.style.display = select.style.display === 'none' ? 'inline-block' : 'none';
    wrapper.querySelector('.status-tag').classList.toggle('open');
  }
});

// Ao alterar o select, atualiza o status
document.addEventListener('change', function(e) {
  if (e.target.classList.contains('status-select')) {
    const select = e.target;
    const wrapper = select.closest('.status-wrapper');
    const tag = wrapper.querySelector('.status-tag');
    
    const value = select.value;
    tag.textContent = select.options[select.selectedIndex].text + ' ▾';
    
    // Atualiza cor dinamicamente
    tag.className = 'tag ' + value + ' status-tag';
    select.style.display = 'none';
    tag.classList.remove('open');
  }
});




