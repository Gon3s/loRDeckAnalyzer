async function analyzeCards() {
  try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url.includes('lorcards.fr')) {
          throw new Error('Cette extension fonctionne uniquement sur lorcards.fr');
      }

      const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
              const costDistribution = {
                  1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0
              };
              
              // Sélectionner toutes les cartes du deck
              const cardElements = document.querySelectorAll('.deckbuilder-details-line');
              
              cardElements.forEach(cardElement => {
                  const costElement = cardElement.querySelector('.deckbuilder-details-line-energycost');
                  const quantityElement = cardElement.querySelector('.deckbuilder-details-line-quantity');
                  
                  if (costElement && quantityElement) {
                      const cost = parseInt(costElement.textContent.trim(), 10);
                      const count = parseInt(quantityElement.textContent.trim(), 10);
                      
                      if (!isNaN(cost) && !isNaN(count)) {
                          if (cost >= 10) {
                              costDistribution[10] = (costDistribution[10] || 0) + count;
                          } else {
                              costDistribution[cost] = (costDistribution[cost] || 0) + count;
                          }
                      }
                  }
              });

              const totalCards = Object.values(costDistribution).reduce((a, b) => a + b, 0);
              
              return {
                  distribution: costDistribution,
                  total: totalCards
              };
          }
      });

      if (results && results[0] && results[0].result) {
          displayStats(results[0].result);
      } else {
          throw new Error('Aucune donnée trouvée');
      }
  } catch (error) {
      document.getElementById('cost-distribution').innerHTML = `
          <div style="color: #ff6b6b; padding: 10px;">
              ${error.message || 'Une erreur est survenue lors de l\'analyse'}
          </div>`;
  }
}

function displayStats(data) {
  const container = document.getElementById('cost-distribution');
  const maxCount = Math.max(...Object.values(data.distribution));
  container.innerHTML = '';
  
  for (let cost = 1; cost <= 10; cost++) {
      const count = data.distribution[cost] || 0;
      const barWidth = count > 0 ? (count / maxCount) * 200 : 0;
      
      const costBar = document.createElement('div');
      costBar.className = 'cost-bar';
      costBar.innerHTML = `
          <span class="cost-label">${cost}${cost === 10 ? '+' : ''}</span>
          <div class="bar" style="width: ${barWidth}px"></div>
          <span class="count">${count}</span>
      `;
      
      container.appendChild(costBar);
  }
  
  document.getElementById('total').textContent = `Total: ${data.total} cartes`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('analyze').addEventListener('click', analyzeCards);
});