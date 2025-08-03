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
        <link rel="stylesheet" href="../CSS/classificacao.css" type="text/css">
        <link rel="shortcut icon" href="../Midias/Imagens/icone/favicon.ico" type="image/x-icon">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
      </head>
      <body id="body">
        <nav class="navbar navbar-expand-lg">
          <div class="container">
            <div class="col-1 align-items-center" id="D1">
              <a class="navbar-brand" href="../PRINCIPAL.html"> < </a>
            </div>
            <div class="mt-2 col-11 text-center" id="D3">
              <h1>CLASSIFICAÇÃO</h1>
              <h2>HIGH-STAKES</h2>
              <h3>F1</h3>
            </div>
          </div>
        </nav>
        <main class="container-fluid p-4" id="classifi">
          <section class="mb-4" id="PC">
            <h1>TEMPORADA DE 2025</h1>
            <div class="mb-4">
              <h2>Classificação dos Pilotos</h2>
            </div>
            <div class="container">
              <div class="row">
                <div class="container bg-custom p-4">
                  <table class="table table-striped table-responsive">
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
          </section>
        </main>
        <footer>
          <div class="container-fluid d-flex flex-row align-items-center justify-content-evenly" id="rodape">
            <div class="container text-center">
              <h3>HIGH-STAKES F1</h3>
              <p>Desenvolvido por:</p>
              <a href="creditos.html">EQUIPE HIGH-STAKES</a>
              <p>Fatec Marília - 2025</p>
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
