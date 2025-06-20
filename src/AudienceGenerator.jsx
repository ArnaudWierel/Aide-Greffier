import React, { useState } from "react";

export default function AudienceGenerator() {
  const [greffierName, setGreffierName] = useState("Gates");
  const [judges, setJudges] = useState([""]);
  const [assessors, setAssessors] = useState([""]);
  const [trainees, setTrainees] = useState([""]);
  const [prosecutors, setProsecutors] = useState([""]);
  const [station, setStation] = useState("");
  const [defendants, setDefendants] = useState([{ civ: "Monsieur", name: "", selfDefended: false, lawyers: [""] }]);
  const [date, setDate] = useState("");
  const [result, setResult] = useState("");

  const formatList = (arr) => arr.filter(Boolean).join(", ").replace(/, ([^,]*)$/, " et $1");

  const handleGenerate = () => {
    const intro = "Bonjour tout le monde, je demande à toutes les parties de prendre place, le jugement va commencer.";
  
    // Juges
    const pluralJudges = judges.length > 1;
    const judgeIntro = pluralJudges ? `les juges ${formatList(judges)}` : `le juge ${formatList(judges)}`;
  
    const assessorIntro = assessors.some(Boolean)
      ? (assessors.length > 1
          ? `, ainsi que les juges assesseurs ${formatList(assessors)}`
          : `, ainsi que le juge assesseur ${formatList(assessors)}`
        )
      : "";
  
    const traineeIntro = trainees.some(Boolean)
      ? (trainees.length > 1
          ? `, accompagnés des juges assesseurs en formation ${formatList(trainees)}`
          : `, accompagné du juge assesseur en formation ${formatList(trainees)}`
        )
      : "";
  
    const header = `Bonjour à tous, je me présente je suis le greffier ${greffierName}. À ma gauche, nous avons ${judgeIntro}${assessorIntro}${traineeIntro}.`;
  
    // Faits reprochés
    const multipleDefendants = defendants.length > 1;
    const facts = multipleDefendants
      ? `Nous sommes réunis aujourd’hui pour examiner les faits reprochés aux accusés ${formatList(defendants.map(d => d.name))} en date du ${date}.`
      : `Nous sommes réunis aujourd’hui pour examiner les faits reprochés à ${formatList(defendants.map(d => d.name))} en date du ${date}.`;
  
    // Procureurs
    const prosecutorsPart = prosecutors.some(Boolean)
      ? (prosecutors.length > 1
          ? `Le Bureau du Procureur, représentant le poste de police de ${station}, est représenté par les procureurs ${formatList(prosecutors)}.`
          : `Le Bureau du Procureur, représentant le poste de police de ${station}, est représenté par le procureur ${formatList(prosecutors)}.`
        )
      : "";
  
    // Accusés
    const defendantsText = defendants
      .filter(d => d.name.trim() !== "")
      .map((d) => {
        const avocatList = d.lawyers.filter(Boolean);
        const avocatCount = avocatList.length;
        const avocatsFormatted = avocatCount > 0 ? formatList(avocatList) : "";
        const prefix = `${d.civ} ${d.name}`;
  
        if (d.selfDefended) {
          return `${prefix} a choisi de se défendre seul.`;
        } else if (avocatCount > 1) {
          return `${prefix} est représenté(e) par les Maîtres ${avocatsFormatted}.`;
        } else {
          return `${prefix} est représenté(e) par Maître ${avocatsFormatted}.`;
        }
      })
      .join("\n");
  
    const body = `${facts}\n\n${prosecutorsPart}\n\n${defendantsText}\n\nJe cède la parole à Monsieur le Juge.`;
  
    setResult(`${intro}\n\n${header}\n\n${body}`);
  };

  const handleClear = () => {
    setGreffierName("Gates");
    setJudges([""]);
    setAssessors([""]);
    setTrainees([""]);
    setProsecutors([""]);
    setStation("");
    setDefendants([{ civ: "Monsieur", name: "", selfDefended: false, lawyers: [""] }]);
    setDate("");
    setResult("");
  };

  const handleChange = (setFn, list, index, value) => {
    const copy = [...list];
    copy[index] = value;
    setFn(copy);
  };

  const handleRemove = (setFn, list, index) => {
    const copy = [...list];
    copy.splice(index, 1);
    setFn(copy);
  };

  const handleRemoveDefendant = (index) => {
    const copy = [...defendants];
    copy.splice(index, 1);
    setDefendants(copy);
  };

  return (
    <div className="text-black p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center tracking-wide animate-float-in flex justify-center items-center gap-3">
        <img src="US.svg" alt="Drapeau USA" className="w-8 h-5 shadow-md rounded-sm" />
        GreffierDesk – Générateur d'Audience
      </h1>



      <div className="mb-6">
        <label className="block font-semibold mb-1">Nom du greffier :</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={greffierName}
          onChange={(e) => setGreffierName(e.target.value)}
          placeholder="Nom du greffier"
        />
      </div>

      {["Juges", "Juges assesseurs", "Juges assesseurs en formation", "Procureurs"].map((label, idx) => {
        const data = [judges, assessors, trainees, prosecutors][idx];
        const set = [setJudges, setAssessors, setTrainees, setProsecutors][idx];
        return (
          <div key={idx} className="mb-6">
            <label className="block font-semibold mb-1">{label} :</label>
            {data.map((val, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input className="w-full p-2 border rounded" value={val} onChange={e => handleChange(set, data, i, e.target.value)} placeholder={`Nom de ${label.toLowerCase()}`} />
                {data.length > 1 && (
                  <button className="text-red-600" onClick={() => handleRemove(set, data, i)}>❌</button>
                )}
              </div>
            ))}
            <button onClick={() => set([...data, ""])} className="text-blue-600 hover:underline text-sm">
              + Ajouter {label.endsWith("s") ? "un" : "une"} {label.toLowerCase()}
            </button>
          </div>
        );
      })}

      <div className="mb-6">
        <label className="block font-semibold mb-1">Poste de police :</label>
        <select className="w-full p-2 border rounded" value={station} onChange={(e) => setStation(e.target.value)}>
          <option value="">-- Choisir un poste --</option>
          <option value="LSPD Vespucci">LSPD Vespucci</option>
          <option value="LSPD Vinewood">LSPD Vinewood</option>
          <option value="Gouvernement">Gouvernement</option>
          <option value="FIB">FIB</option>
        </select>
      </div>

      <div className="mb-6">
  <label className="block font-semibold mb-1">Accusés :</label>
  {defendants.map((d, i) => (
    <div key={i} className="mb-4 border p-3 rounded">
      <div className="flex gap-2 mb-2">
        <select className="p-2 border rounded" value={d.civ} onChange={e => {
          const copy = [...defendants];
          copy[i].civ = e.target.value;
          setDefendants(copy);
        }}>
          <option value="Monsieur">Monsieur</option>
          <option value="Madame">Madame</option>
          <option value="Autre">Autre</option>
        </select>
        <input
          className="flex-grow p-2 border rounded"
          placeholder="Nom de l'accusé"
          value={d.name}
          onChange={e => {
            const copy = [...defendants];
            copy[i].name = e.target.value;
            setDefendants(copy);
          }}
        />
        <label className="text-sm flex items-center">
          <input type="checkbox" className="mr-1" checked={d.selfDefended} onChange={e => {
            const copy = [...defendants];
            copy[i].selfDefended = e.target.checked;
            setDefendants(copy);
          }} />
          Se défend seul
        </label>
        {defendants.length > 1 && (
          <button className="text-red-600" onClick={() => handleRemoveDefendant(i)}>❌</button>
        )}
      </div>

      {!d.selfDefended && (
        <>
          <label className="text-sm font-medium">Avocats :</label>
          {d.lawyers.map((lawyer, li) => (
            <div key={li} className="flex gap-2 mb-2">
              <input
                className="w-full p-2 border rounded"
                placeholder="Nom de l'avocat"
                value={lawyer}
                onChange={(e) => {
                  const copy = [...defendants];
                  copy[i].lawyers[li] = e.target.value;
                  setDefendants(copy);
                }}
              />
              {d.lawyers.length > 1 && (
                <button
                  className="text-red-600"
                  onClick={() => {
                    const copy = [...defendants];
                    copy[i].lawyers.splice(li, 1);
                    setDefendants(copy);
                  }}
                >❌</button>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              const copy = [...defendants];
              copy[i].lawyers.push("");
              setDefendants(copy);
            }}
            className="text-blue-600 hover:underline text-sm"
          >
            + Ajouter un avocat
          </button>
        </>
      )}
    </div>
  ))}

  <button
    onClick={() => setDefendants([...defendants, { civ: "Monsieur", name: "", selfDefended: false, lawyers: [""] }])}
    className="text-blue-600 hover:underline text-sm"
  >
    + Ajouter un accusé
  </button>
</div>

      <div className="mb-6">
        <label className="block font-semibold mb-1">Date :</label>
        <input type="date" className="w-full p-2 border rounded" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={handleGenerate}
          className="flex-1 bg-blue-700 text-white font-bold py-3 rounded hover:bg-red-600 transition"
        >
          📜 Générer le discours
        </button>
        <button
          onClick={handleClear}
          className="flex-1 bg-gray-300 text-black font-bold py-3 rounded hover:bg-gray-400 transition"
        >
          🧼 Réinitialiser
        </button>
      </div>

      {result && (
        <div className="mt-6">
          <label className="block font-semibold mb-1">Discours généré :</label>
          <textarea
            readOnly
            className="w-full p-4 border rounded h-64"
            value={result}
          />
        </div>
      )}
    </div>
  );
}
