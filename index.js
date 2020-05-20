const fs = require("fs");
const http = require("http");
const url = require("url");

const json_data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const laptop_data = JSON.parse(json_data);

const server = http.createServer((req, res) => {
  const query = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;

  // PRODUCTS OVERVIEW
  if (query === "/products" || query === "/") {
    res.writeHead(200, { "Content-type": "text/html" });

    fs.readFile(
      `${__dirname}/templates/temp-overview.html`,
      "utf-8",
      (err, data) => {
        if (err) console.log(err);
        let overviewOutput = data;

        fs.readFile(
          `${__dirname}/templates/temp-cards.html`,
          "utf-8",
          (err, data) => {
            if (err) console.log(err);

            const cardOutput = laptop_data
              .map((el) => replaceTemplate(data, el.id))
              .join("");
            overviewOutput = overviewOutput.replace("{%CARDS%}", cardOutput);
            res.end(overviewOutput);
          }
        );
      }
    );
  }

  //IMAGE ROUTE
  else if (/\.(jpg|jpeg|png|gif)$/i.test(query)) {
    fs.readFile(`${__dirname}/data/img${query}`, (err, data) => {
      res.writeHead(200, { "Content-type": "img/jpg" });
      if (err) console.log(err);
      res.end(data);
    });
  }

  // LAPTOP DETAIL
  else if (query === "/laptop" && id < laptop_data.length) {
    res.writeHead(200, { "Content-type": "text/html" });

    fs.readFile(
      `${__dirname}/templates/temp-laptop.html`,
      "utf-8",
      (err, data) => {
        if (err) console.log(err);

        const output = replaceTemplate(data, id);

        res.end(output);
      }
    );
  }

  // URL NOT FOUND
  else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("URL NOT FOUND");
  }
});

server.listen("8080", "localhost", () => {
  console.log("server is listening");
});

replaceTemplate = (originalHTML, id) => {
  let output = originalHTML.replace(
    /{%PRODUCTNAME%}/g,
    laptop_data[id].productName
  );
  output = output.replace(/{%PRICE%}/g, laptop_data[id].price);
  output = output.replace(/{%SCREEN%}/g, laptop_data[id].screen);
  output = output.replace(/{%CPU%}/g, laptop_data[id].cpu);
  output = output.replace(/{%DESCRIPTION%}/g, laptop_data[id].description);
  output = output.replace(/{%IMAGE%}/g, laptop_data[id].image);
  output = output.replace(/{%RAM%}/g, laptop_data[id].ram);
  output = output.replace(/{%STORAGE%}/g, laptop_data[id].storage);
  output = output.replace(/{id}/g, id);

  return output;
};
