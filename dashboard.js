const btn = document.getElementById('btnDataCriacao');
const modal = document.getElementById('calendarModal');
const closeBtn = document.getElementById('closeCalendar');
const monthInput = document.getElementById('monthSelect');

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
