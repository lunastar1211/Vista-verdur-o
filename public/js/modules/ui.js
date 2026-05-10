// Módulo de UI - carregamento de componentes, menu ativo, eventos do topo

export function highlightActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.sidebar nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('ativo');
        } else {
            link.classList.remove('ativo');
        }
    });
}

export async function loadComponent(selector, url) {
    console.log(`[loadComponent] Tentando carregar ${url} em ${selector}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const html = await response.text();
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = html;
            console.log(`[loadComponent] Sucesso: ${url} injetado em ${selector}`);
        } else {
            console.warn(`[loadComponent] Seletor ${selector} não encontrado no DOM`);
        }

        // Eventos específicos após carregamento
        if (selector === '.topo-placeholder') {
            attachTopoEvents();
        }
        if (selector === '.sidebar-placeholder') {
            document.body.classList.add('sidebar-carregada');
            highlightActiveMenu();
        }
    } catch (error) {
        console.error(`[loadComponent] ERRO ao carregar ${url}:`, error);
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = `<div style="background:#fee; padding:1rem; border:1px solid red; border-radius:8px; margin:1rem 0; color:#b91c1c;">
                Erro ao carregar componente: ${url}<br>
                Verifique se o arquivo existe no caminho: <strong>components/${url.split('/').pop()}</strong>
            </div>`;
        }
    }
}

function attachTopoEvents() {
    const menuBtn = document.getElementById('menuToggle');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            console.log('Menu hambúrguer clicado - implementar recolhimento da sidebar');
        });
    }
    const notificBtn = document.querySelector('.btn-notificacao');
    if (notificBtn) {
        notificBtn.addEventListener('click', () => {
            alert('Você tem 3 novas notificações.');
        });
    }
    const setaBtn = document.querySelector('.btn-seta');
    if (setaBtn) {
        setaBtn.addEventListener('click', () => {
            console.log('Opções do usuário - futuro dropdown');
        });
    }
}