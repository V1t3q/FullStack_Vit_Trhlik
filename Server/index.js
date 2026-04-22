import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Databáze
let produkty = [
    { id: 1, name: "Notebook ASUS", price: 15000 },
    { id: 2, name: "Herní Myš", price: 1200 },
    { id: 3, name: "Monitor 24", price: 3500 },
    { id: 4, name: "Klávesnice", price: 800 }
];

// GET - Získání všech produktů a vyhledávání
app.get("/api/produkty", (req, res) => {
    let search = req.query.search;
    if (search) {
        let vysledek = produkty.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );
        return res.json(vysledek);
    }
    res.json(produkty);
});

// POST - Přidání nového produktu
app.post("/api/produkty", (req, res) => {
    const { name, price } = req.body;
    if (!name) return res.status(400).json({ error: "Jméno je povinné" });

    const novy = {
        id: Date.now(),
        name: name,
        price: Number(price) || 0
    };
    produkty.push(novy);
    res.status(201).json(novy);
});

// PUT - Úprava ceny existujícího produktu
app.put("/api/produkty/:id", (req, res) => {
    const id = Number(req.params.id);
    const produkt = produkty.find(p => p.id === id);
    if (!produkt) return res.status(404).json({ error: "Nenalezeno" });

    if (req.body.price !== undefined) {
        produkt.price = Number(req.body.price);
    }
    res.json(produkt);
});

// DELETE - Smazání produktu
app.delete("/api/produkty/:id", (req, res) => {
    const id = Number(req.params.id);
    produkty = produkty.filter(p => p.id !== id);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server běží na http://localhost:${PORT}`);
});