// Array para armazenar os atendimentos
let atendimentos = [];

// Função para formatar data
function formatarData(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Função para formatar valor em real
function formatarReal(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Função para gravar atendimento
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('atendimentoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const atendimento = {
            id: Date.now(),
            atendente: document.getElementById('atendente').value,
            cliente: document.getElementById('cliente').value,
            data: formatarData(document.getElementById('data').value),
            valor: parseFloat(document.getElementById('valor').value),
            aceite: document.getElementById('aceite').value,
            timestamp: new Date()
        };
        
        atendimentos.push(atendimento);
        
        // Mostrar mensagem de sucesso
        const successMsg = document.getElementById('successMessage');
        successMsg.style.display = 'block';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 3000);
        
        // Atualizar dashboards
        atualizarDashboards();
        
        // Limpar formulário
        limparDados();
    });

    // Definir data atual no campo data
    document.getElementById('data').valueAsDate = new Date();
});

// Função para limpar dados
function limparDados() {
    document.getElementById('atendimentoForm').reset();
    // Redefinir data atual após limpar
    document.getElementById('data').valueAsDate = new Date();
}

// Função para atualizar dashboards
function atualizarDashboards() {
    atualizarProdutividade();
    atualizarReversao();
}

// Função para atualizar dashboard de produtividade
function atualizarProdutividade() {
    const produtividade = {};
    
    atendimentos.forEach(atendimento => {
        if (produtividade[atendimento.atendente]) {
            produtividade[atendimento.atendente]++;
        } else {
            produtividade[atendimento.atendente] = 1;
        }
    });
    
    const container = document.getElementById('produtividadeChart');
    
    if (Object.keys(produtividade).length === 0) {
        container.innerHTML = '<div class="no-data">Nenhum dado disponível ainda</div>';
        return;
    }
    
    let html = '';
    Object.keys(produtividade)
        .sort((a, b) => produtividade[b] - produtividade[a])
        .forEach(atendente => {
            html += `
                <div class="data-item">
                    <span class="data-name">${atendente}</span>
                    <span class="data-value">${produtividade[atendente]} atendimento${produtividade[atendente] > 1 ? 's' : ''}</span>
                </div>
            `;
        });
    
    container.innerHTML = html;
}

// Função para atualizar dashboard de reversão
function atualizarReversao() {
    const reversao = {};
    
    atendimentos.forEach(atendimento => {
        if (atendimento.aceite === 'Sim') {
            if (reversao[atendimento.atendente]) {
                reversao[atendimento.atendente] += atendimento.valor;
            } else {
                reversao[atendimento.atendente] = atendimento.valor;
            }
        }
    });
    
    const container = document.getElementById('reversaoChart');
    
    if (Object.keys(reversao).length === 0) {
        container.innerHTML = '<div class="no-data">Nenhum dado disponível ainda</div>';
        return;
    }
    
    let html = '';
    Object.keys(reversao)
        .sort((a, b) => reversao[b] - reversao[a])
        .forEach(atendente => {
            html += `
                <div class="data-item">
                    <span class="data-name">${atendente}</span>
                    <span class="data-value">${formatarReal(reversao[atendente])}</span>
                </div>
            `;
        });
    
    container.innerHTML = html;
}

// Função para exportar CSV
function exportarCSV() {
    if (atendimentos.length === 0) {
        alert('Não há dados para exportar!');
        return;
    }
    
    let csv = 'Atendente,Cliente,Data,Valor Negociado,Aceite da Proposta\n';
    
    atendimentos.forEach(atendimento => {
        csv += `"${atendimento.atendente}","${atendimento.cliente}","${atendimento.data}","R$ ${atendimento.valor.toFixed(2).replace('.', ',')}","${atendimento.aceite}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'atendimentos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}