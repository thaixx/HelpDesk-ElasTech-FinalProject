const openCalendar = document.getElementById('btnDataVencimento');
const closeCalendar = document.getElementById('closeCalendar');
const monthInput = document.getElementById('monthSelect');
const filterInput = document.getElementById('filter-Input');//search


const statusFilter = document.getElementById('statusFilter');

filterInput.addEventListener("input", filterCards);


btn.addEventListener('click', () => {
  modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
});

closeBtn.addEventListener('click', () => {
  const selectedMonth = monthInput.value;
  if (selectedMonth) {
    // Atualiza o texto do botão com o mês escolhido
    const [year, month] = selectedMonth.split("-");
    const nomeMes = new Date(year, month - 1).toLocaleString('pt-BR', { month: 'long' });
    btn.textContent = `${nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)} / ${year}`;
  }
  modal.style.display = 'none';
});

// Fecha o modal se clicar fora
document.addEventListener('click', (e) => {
  if (!modal.contains(e.target) && e.target !== btn) {
    modal.style.display = 'none';
  }
});

function renderCards(cardsToRender) {
  container.innerHTML = cardsToRender.map(card => createCard(card)).join('');
}

function filterSearch(title, description, searchText) {
  if (!searchText) return true;
  return formatText(description).includes(searchText) || formatText(title).includes(searchText);
}

function filterPriority(cardPriority, filterValue) {
  if (!filterValue) return true;
  return cardPriority.toLowerCase() === filterValue.toLowerCase();
}

function filterStatus(cardStatus, filterValue) {
  if (!filterValue) return true;
  return cardStatus.toLowerCase() === filterValue.toLowerCase();
}

function filterCards() {
  const searchText = formatText(searchInput.value);
  const priority = priorityFilter.value;
  const status = statusFilter.value;

  filteredCards = cards.filter(card =>
      filterSearch(card.title, card.description, searchText) &&
      filterPriority(card.priority, priority) &&
      filterStatus(card.status, status)
  );

  renderCards(filteredCards);
}

function handleAction(cardId, action) {
  const card = cards.find(c => c.id === cardId);
  if (!card) return;

  switch (action) {
      case "Finalizar":
      case "Iniciar":
      case "Reabrir":
          card.status = getNextStatus(card.status);
          filterCards();
          break;
      case "Ver Detalhes":
          alert(`testandoooooooooo"`);
          break;
  }
}

function formatText(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

renderCards(filteredCards);
