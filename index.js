async function searchChampion() {
    const searchInput = document.getElementById('search').value.trim().toLowerCase();
    if (!searchInput) return alert('Ingresa un nombre de campeón');

    try {
      const response = await fetch('https://685420c15470323abe94d0b1.mockapi.io/champs');
      const data = await response.json();

      if (!Array.isArray(data)) {
        alert('La respuesta de la API no es un array válido.');
        return;
      }

      const results = data.filter(champ =>
        champ.name && typeof champ.name === 'string' &&
        champ.name.toLowerCase().includes(searchInput)
      );

      const championsSection = document.querySelector('.champions-section');
      championsSection.innerHTML = '';

      if (results.length === 0) {
        championsSection.innerHTML = `<p>No se encontró ningún campeón con ese nombre.</p>`;
        return;
      }

      results.forEach(champ => {
        const damageType = champ.typedamage ? 'Daño mágico' : 'Daño físico';

        // Corregido: apad booleano: true => AP, false => AD
        const apAd = champ.apad ? 'AP' : 'AD';

        const region = champ.region || 'Región desconocida';
        const icon = champ.icon || 'https://via.placeholder.com/250x150?text=Sin+imagen';

        const card = document.createElement('div');
        card.className = 'champion-card';
        card.innerHTML = `
          <img src="${icon}" alt="${champ.name}">
          <h3>${champ.name}</h3>
          <p><strong>Tipo de daño:</strong> ${damageType}</p>
          <p><strong>AP/AD:</strong> ${apAd}</p>
          <p><strong>Región:</strong> ${region}</p>
        `;
        championsSection.appendChild(card);
      });

    } catch (error) {
      alert('Error al buscar campeones: ' + error.message);
    }
  }
  document.getElementById('champion-form').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const name = document.getElementById('new-name').value.trim();
    const apad = document.getElementById('new-apad').value === 'true';
    const typedamage = document.getElementById('new-typedamage').value === 'true';
    const region = document.getElementById('new-region').value.trim();
    const icon = document.getElementById('new-icon').value.trim();
  
    if (!name || !region || !icon) {
      return alert('Por favor, completa todos los campos.');
    }
  
    try {
      const response = await fetch('https://685420c15470323abe94d0b1.mockapi.io/champs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          apad,
          typedamage,
          region,
          icon
        })
      });
  
      if (!response.ok) throw new Error('Error al guardar el campeón');
  
      alert('Campeón agregado correctamente');
      document.getElementById('champion-form').reset();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });

  