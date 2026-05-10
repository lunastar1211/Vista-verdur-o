// Carrega componentes e inicializa página atual
import { initLogin } from './modules/auth.js';
import { loadComponent, highlightActiveMenu } from './modules/ui.js';
import { initDashboard } from './modules/dashboard.js';

async function initPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'login.html';
    const isLoginPage = currentPage === 'login.html';

    if (!isLoginPage) {
        await loadComponent('.sidebar-placeholder', 'components/sidebar.html');
        await loadComponent('.topo-placeholder', 'components/topo.html');
        await loadComponent('.rodape-placeholder', 'components/rodape.html');
        highlightActiveMenu();
    }

    switch (currentPage) {
        case 'login.html':
            initLogin();
            break;
        case 'dashboard.html':
            initDashboard();
            break;
        case 'vendas.html':
            console.log('Página de Vendas - futuro módulo');
            break;
        case 'estoque.html':
            console.log('Página de Estoque - futuro módulo');
            break;
        case 'relatorio.html':
            console.log('Página de Relatórios - futuro módulo');
            break;
        case 'configuracoes.html':
            console.log('Página de Configurações');
            break;
        default:
            if (!isLoginPage) {
                console.warn(`Página ${currentPage} sem módulo específico`);
            }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}