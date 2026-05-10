// Módulo de autenticação - responsável pelo login
export function initLogin() {
    const formLogin = document.getElementById('formLogin');
    if (!formLogin) return;

    formLogin.addEventListener('submit', (e) => {
        const email = document.getElementById('email')?.value.trim();
        if (!email) {
            e.preventDefault();
            alert('Por favor, insira um email válido.');
            return;
        }
    });
}