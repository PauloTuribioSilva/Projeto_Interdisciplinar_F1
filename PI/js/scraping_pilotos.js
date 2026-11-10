const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');  // Módulo para manipulação de arquivos

// URL da página de classificação dos pilotos
const url = 'https://www.formula1.com/en/results/2025/drivers';

// Função para gerar o conteúdo HTML
function gerarHTML(pilotos) {
  let htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-br">
      <head>
        <meta charset="utf-8">
        <title>CLASSIFICAÇÃO PILOTOS</title>
        <link rel="shortcut icon" href="../Midias/Imagens/icone/favicon.ico" type="image/x-icon">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
        <link rel="stylesheet" href="../CSS/global.css">
        <link rel="stylesheet" href="../CSS/classificacao.css" type="text/css">
      </head>
      <body id="body">
        <header class="global-nav">
          <div class="global-nav__inner">
            <a class="global-nav__logo" href="../PRINCIPAL.html">HIGH-STAKES <span>F1</span></a>
            <input type="checkbox" id="global-nav-toggle" class="global-nav__toggle-input visually-hidden">
            <label for="global-nav-toggle" class="global-nav__toggle-label" aria-label="Abrir menu">&#9776;</label>
            <ul class="global-nav__links">
              <li><a href="../PRINCIPAL.html">INÍCIO</a></li>
              <li><a href="corr.html">CIRCUITOS</a></li>
              <li><a href="corredores.html">PILOTOS</a></li>
              <li><a href="classificacao.html" class="is-active">CLASSIFICAÇÃO</a></li>
              <li><a href="data.html">CALENDÁRIO</a></li>
              <li><a href="CE.html">EXTRAS</a></li>
            </ul>
          </div>
        </header>
        <nav class="navbar navbar-expand-lg">
          <div class="container-fluid">
            <div class="col-12" id="D3">
              <span class="page-kicker">TEMPORADA 2025</span>
              <h1>CLASSIFICAÇÃO</h1>
              <h2>HIGH-STAKES</h2>
              <h3>F1</h3>
            </div>
          </div>
        </nav>
        <main class="container-fluid mb-4" id="classifi">
          <section class="mb-3 mt-3" id="PC">
            <h1>TEMPORADA DE 2025</h1>
            <div class="mb-4">
              <h2>Classificação dos Pilotos</h2>
            </div>
            <div class="container">
              <div class="row">
                <div class="container bg-custom p-4">
                  <div class="table-responsive">
                  <table class="table table-striped">
                    <thead class="table-dark">
                      <tr>
                        <th class="fw-bold text-uppercase px-5 rounded-start">Pos</th>
                        <th class="fw-bold text-uppercase">Piloto</th>
                        <th class="fw-bold text-uppercase">Nacionalidade</th>
                        <th class="fw-bold text-uppercase">Equipe</th>
                        <th class="fw-bold text-uppercase rounded-end text-end pe-5">Pontos</th>
                      </tr>
                    </thead>
                    <tbody>`;

  pilotos.forEach(piloto => {
    htmlContent += `
                      <tr>
                        <td class="px-5">${piloto.position}</td>
                        <td>${piloto.driverName}</td>
                        <td>${piloto.nationality}</td>
                        <td>${piloto.team}</td>
                        <td class="rounded-end text-end pe-5">${piloto.points}</td>
                      </tr>`;
  });

  htmlContent += `
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer>
          <div class="container-fluid d-flex flex-row align-items-center justify-content-evenly" id="rodape">
            <div class="container text-center">
              <h3>HIGH-STAKES F1</h3>
              <p>Desenvolvido por estudantes da Fatec Marília</p>
              <p>2025</p>
            </div>
          </div>
        </footer>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
      </body>
    </html>`;

  return htmlContent;
}

// Fazer o pedido HTTP para acessar a página de pilotos
axios.get(url)
  .then(response => {
    if (response.status === 200) {
      console.log("Página carregada com sucesso!");

      // Parse do conteúdo HTML usando cheerio
      const $ = cheerio.load(response.data);

      // Encontrar a tabela de classificações dos pilotos
      const table = $('tbody');
      //console.log(table);
      let pilotos = [];
      
      // Iterar sobre as linhas da tabela de pilotos
      table.find('tr').each((index, element) => {
        const cols = $(element).find('td');
        
        if (cols.length > 1) {
          const position = $(cols[0]).text().trim();
          const driverName = $(cols[1]).text().trim();
          const nationality = $(cols[2]).text().trim();
          const team = $(cols[3]).text().trim();
          const points = $(cols[4]).text().trim();

          pilotos.push({
            position,
            driverName,
            nationality,
            team,
            points
          });
        }
      });

      // Gerar o conteúdo HTML
      const htmlContent = gerarHTML(pilotos);

      // Escrever o conteúdo HTML em um arquivo .html
      fs.writeFileSync('classificacao_pilotos.html', htmlContent, 'utf8');
      console.log("Arquivo HTML gerado com sucesso!");
    } else {
      console.log("Erro ao carregar a página:", response.status);
    }
  })
  .catch(error => {
    console.error("Erro na requisição HTTP:", error);
  });
