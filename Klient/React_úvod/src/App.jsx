import React, { useState, useEffect } from 'react';
import './App.css';


// Uloženy produkty z databáze
function App() {
    const [produkty, setProdukty] = useState([]);
    const [hledanyText, setHledanyText] = useState('');
    const [nazev, setNazev] = useState('');
    const [cena, setCena] = useState('');

    // NAČTENÍ (GET)
    const nactiProdukty = async () => {
        const url = hledanyText
            ? `http://localhost:3000/api/produkty?search=${hledanyText}`
            : 'http://localhost:3000/api/produkty';
        const response = await fetch(url);
        const data = await response.json();
        setProdukty(data);
    };


    // automaticky reaguje na změny a pak je aplikuje
    useEffect(() => {
        nactiProdukty();
    }, [hledanyText]);

    // PŘIDÁNÍ (POST)
    const pridatProdukt = async (e) => {
        e.preventDefault();
        if (!nazev) return alert("Zadej název!");

        await fetch('http://localhost:3000/api/produkty', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: nazev, price: cena })
        });
        setNazev(''); setCena('');
        nactiProdukty();
    };

    // ÚPRAVA (PUT)
    const upravitCenu = async (id, staryNazev) => {
        const novaCena = prompt(`Nová cena pro ${staryNazev}:`);
        if (novaCena !== null) {
            await fetch(`http://localhost:3000/api/produkty/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ price: Number(novaCena) })
            });
            nactiProdukty();
        }
    };

    // SMAZÁNÍ (DELETE)
    const smazatProdukt = async (id) => {
        await fetch(`http://localhost:3000/api/produkty/${id}`, { method: 'DELETE' });
        nactiProdukty();
    };

    return (
        <div className="container">
            <h1>📦 Správce produktů</h1>

            <form onSubmit={pridatProdukt} className="form-card">
                <input placeholder="Název..." value={nazev} onChange={e => setNazev(e.target.value)} />
                <input type="number" placeholder="Cena..." value={cena} onChange={e => setCena(e.target.value)} />
                <button type="submit">Uložit</button>
            </form>

            <input
                className="search-bar"
                placeholder="🔍 Hledat..."
                value={hledanyText}
                onChange={e => setHledanyText(e.target.value)}
            />

            <table>
                <thead>
                <tr><th>Název</th><th>Cena</th><th style={{textAlign:'right'}}>Akce</th></tr>
                </thead>
                <tbody>
                {produkty.map(p => (
                    <tr key={p.id}>
                        <td><strong>{p.name}</strong></td>
                        <td>{p.price} Kč</td>
                        <td style={{textAlign:'right'}}>
                            <button style={{background:'#fbbf24', marginRight:'8px'}} onClick={() => upravitCenu(p.id, p.name)}>Upravit</button>
                            <button className="btn-delete" onClick={() => smazatProdukt(p.id)}>Smazat</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;