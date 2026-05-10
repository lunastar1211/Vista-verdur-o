function showTab(tabId) {
    // Esconde todas as seções
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('hidden'));

    // Mostra a seção que você clicou
    const target = document.getElementById('tab-' + tabId);
    if (target) target.classList.remove('hidden');

    // Atualiza o visual dos botões no menu lateral
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active-tab'));

    const activeBtn = document.getElementById('btn-' + tabId);
    if (activeBtn) activeBtn.classList.add('active-tab');
}

// Quando abrir o site, começa no Dashboard
window.onload = () => showTab('dashboard');