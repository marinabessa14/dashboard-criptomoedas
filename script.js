
document.addEventListener('DOMContentLoaded', () => {

   // Selecionando os elementos do HTML

    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const cryptoListContainer = document.getElementById('crypto-list-container');
    const cryptoTableBody = document.getElementById('crypto-table-body');

    // Buscando os dados das criptomoedas da API CoinGecko

    async function fetchCryptoData() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
            
            // Se a resposta não for OK, lança um erro

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            
            // E a resposta converte em JSON

            const data = await response.json();
            
            // Chamando a função para renderizar a tabela com os dados recebidos

            renderCryptoTable(data);
        } catch (error) {

            console.error("Falha ao buscar dados das criptomoedas:", error);
            loadingSpinner.classList.add('hidden');
            errorMessage.classList.remove('hidden');
        }
    }

   // Redenrizando a tabela de criptomoedas com os dados fornecidos.

    function renderCryptoTable(coins) {
        loadingSpinner.classList.add('hidden');
        cryptoListContainer.classList.remove('hidden');
        
        cryptoTableBody.innerHTML = '';
        
        coins.forEach(coin => {
            const priceChange24h = coin.price_change_percentage_24h;   
            const priceChangeColor = priceChange24h >= 0 ? 'text-green-400' : 'text-red-400';
            const priceChangeSign = priceChange24h >= 0 ? '+' : '';
            
           const row = document.createElement('tr');
            
            // Definindo o conteúdo HTML da linha com os dados da moeda

            row.innerHTML = `
    <td class="py-4 px-4 whitespace-nowrap">
        <div class="flex items-center">
            <img src="${coin.image}" alt="${coin.name}" class="h-8 w-8 rounded-full">
            <div class="ml-4">
                <div class="text-sm font-medium text-gray-300">${coin.name}</div> <div class="text-xs text-gray-400 uppercase">${coin.symbol}</div> </div>
        </div>
    </td>
    <td class="py-4 px-4 text-right text-sm font-semibold text-gray-200">$${coin.current_price.toLocaleString('en-US')}</td> <td class="py-4 px-4 text-right text-sm font-semibold ${priceChangeColor}"> ${priceChangeSign}${priceChange24h.toFixed(2)}%
    </td>
    <td class="py-4 px-4 text-right text-sm text-gray-400 hidden sm:table-cell">
        $${coin.market_cap.toLocaleString('en-US')}
    </td>
`;
            
            // Adicionando a linha criada ao corpo da tabela
            cryptoTableBody.appendChild(row);
        });
    }

    // Chamando a função para buscar os dados das criptomoedas ao carregar a página
    fetchCryptoData();
});
