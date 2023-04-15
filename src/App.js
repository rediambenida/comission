import React, { useState } from "react";
import "./App.css";
import { Document, Packer, Paragraph, Table, TableCell, TableRow } from "docx";
import { saveAs } from "file-saver";

const teams = [
  "AABB",
  "ACB",
  "ACSMM",
  "AHHBB",
  "AMBT",
  "ARA",
  "ASAB",
  "ASCEBB",
  "ASCHBB",
  "ASCOLAB",
  "ASE",
  "ASG",
  "ASGLMIMA",
  "ASJ",
  "ASLL",
  "ASA",
  "ASS",
  "ASBS",
  "AUIB",
  "AWIS",
  "CAK",
  "CERBB",
  "CODM",
  "CPAM",
  "COWTB",
  "CRA",
  "CRN",
  "CSAB",
  "CSBA",
  "CSBA",
  "CSOO",
  "FAS",
  "FUS",
  "HGB",
  "IBA",
  "IRAN",
  "IRLCMC",
  "IRT",
  "KAC",
  "KCM",
  "MAT",
  "MES",
  "MTB",
  "OCK",
  "OCY",
  "OCS",
  "RBM",
  "RCA",
  "RCOZ",
  "RSB",
  "RSZ",
  "SM",
  "TAS",
  "USAC",
  "USF",
  "WAC",
  "WSS",
  "WST"
];

const referees = [
  "RAISS MHAMED",
  "RACHIDI MOHAMED",
  "BEN SLIMAN SALAH-EDDINE",
  "ABIDI LAHCEN",
  "LAMRANI MOULAY CHRIF",
  "YOUSFI KHALID",
  "MASSAOUDI CHAOKI",
  "HARHAR BRAHIM",
  "FERGAG ADIL",
  "LAHRARI MOHAMMED",
  "BERRAD MOHAMMED",
  "ZAHAR HASSAN",
  "HANADI NEZHA",
  "ABDESLAM GRADA",
  "DRISS BELLA",
  "TAHIRI HICHAM",
  "KOURTI MOHAMED",
  "ALAOUI KAMAL",
  "MABROUK AZIZ",
  "AZMANI MOHAMED",
  "BOUFRIOUA MUSTAPHA",
  "KAJMAR ALAA EDDINE",
  "CHEKRI RACHID",
  "JOUNDOUB NAJIB",
  "ZEMANI SAMIR",
  "CHAOUCH ABDELKADER",
  "EL MASSOUDI ABDERRAZAK",
  "BAHADI SAID",
  "EL HAMDAOUI ABDELHAFID",
  "DILMI CHEIKH",
  "LAHRICHI KHALID",
  "BENNAGHMOUCH ABDENNACEUR",
  "AFKIR AHMED",
  "LAHRECH BOUCHAIB",
  "ZOUINA ABDELLAH",
  "GARJMI ABDELKRIM",
  "KHANTOUR MOUSTAFA",
  "ACHRAF ABDELAH",
  "EL ASSAL FOUAD",
  "MISBAH ABDENBI",
  "KHAIR MOSTAFA",
  "BOUMEDIENE FOUAD",
  "BADI AHMED",
  "TOUISSI HASSAN",
  "RIFAAY DRISS",
  "LAHSISSENE ANAS",
  "BADAOUI AMINE",
  "EL KHAL NOUREDDINE"
];

function App() {
  const [games, setGames] = useState([]);

  const addGame = () => {
    setGames([
      ...games,
      { team1: "", team2: "", referee: "", city: "", date: "", tableau: "" }
    ]);
  };

  const updateGame = (index, field, value) => {
    const updatedGames = [...games];
    updatedGames[index][field] = value;
    setGames(updatedGames);
  };

  const exportToWord = () => {
    // group the games by their tableau field
    const groupedGames = games.reduce((acc, game) => {
      if (!acc[game.tableau]) {
        acc[game.tableau] = [];
      }
      acc[game.tableau].push(game);
      return acc;
    }, {});

    // create a table for each group of games
    const tables = Object.keys(groupedGames).map((tableau) => {
      const tableRows = groupedGames[tableau].map((game) => {
        return new TableRow({
          children: [
            new TableCell({
              width: { size: 20, type: "pct" },
              children: [
                new Paragraph({
                  text: game.date,
                  alignment: "center"
                })
              ]
            }),
            new TableCell({
              width: { size: 28, type: "pct" },
              children: [
                new Paragraph({
                  text: game.city,
                  alignment: "center"
                })
              ]
            }),
            new TableCell({
              width: { size: 35, type: "pct" },
              children: [
                new Paragraph({
                  text: game.team1 + " / " + game.team2,
                  alignment: "center"
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  width: { size: 39, type: "pct" },
                  text: game.referee,
                  alignment: "center"
                })
              ]
            })
          ]
        });
      });

      return new Table({
        alignment: "center",
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: "DATE",
                    bold: true,
                    alignment: "center",
                    style: "header"
                  })
                ]
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: "VILLE",
                    bold: true,
                    alignment: "center",
                    style: "header"
                  })
                ]
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: "Match",
                    bold: true,
                    alignment: "center",
                    style: "header"
                  })
                ]
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: "Commissaire",
                    bold: true,
                    alignment: "center",
                    style: "header"
                  })
                ]
              })
            ]
          }),

          ...tableRows
        ]
      });
    });

    // create a document with all the tables
    const doc = new Document({
      creator: "Your Name",
      description: "",
      title: "Basketball Schedule",
      styles: {
        paragraphStyles: [
          {
            id: "header",
            name: "Header",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              bold: true,
              size: 28
            }
          }
        ]
      },
      sections: [
        {
          children: tables.reduce((acc, table, index) => {
            if (index !== 0) {
              acc.push(
                new Paragraph({
                  text: "",
                  spacing: {
                    before: 400
                  }
                })
              );
            }
            acc.push(
              new Paragraph({
                text: Object.keys(groupedGames)[index], // Add the tableau value as the title
                style: "header", // Add the "header" style for the title
                alignment: "center",
                spacing: {
                  after: 200 // Add some space after the title
                }
              })
            );
            acc.push(table);
            return acc;
          }, [])
        }
      ]
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "basketball-schedule.docx");
    });
  };

  return (
    <div className="App">
      <h1>Nomination des commissaires</h1>
      <button onClick={exportToWord}>Export Word</button>
      <button onClick={addGame}>Ajouter Match</button>
      <div className="game">
        {games.map((game, index) => (
          <div className="game" key={index}>
            <h3>MATCH {index + 1}</h3>
            <div>
              <label>
                Tableau:
                <input
                  type="text"
                  value={game.tableau}
                  onChange={(e) => updateGame(index, "tableau", e.target.value)}
                />
              </label>
            </div>
            <select
              value={game.team1}
              onChange={(e) => updateGame(index, "team1", e.target.value)}
            >
              <option value="">Select Team 1</option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
            <span> vs </span>
            <select
              value={game.team2}
              onChange={(e) => updateGame(index, "team2", e.target.value)}
            >
              <option value="">Select Team 2</option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
            <div>
              <label>
                Commissaire:{" "}
                <select
                  value={game.referee}
                  onChange={(e) => updateGame(index, "referee", e.target.value)}
                >
                  <option value="">Select Commissaire</option>
                  {referees.map((referee) => (
                    <option key={referee} value={referee}>
                      {referee}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
