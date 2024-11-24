const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const db = require('./database');
const expressLayouts = require('express-ejs-layouts'); 

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layout');

app.use((req, res, next) => {
    res.locals.title = 'Hospital Management'; // Default title
    next();
});


// Routes
// Redirect "/" ke "/patients"
app.get('/', (req, res) => {
    res.redirect('/patients');
});

// Menampilkan daftar pasien
app.get('/patients', async (req, res) => {
    try {
        const [patients] = await db.execute('SELECT * FROM patients');
        res.render('patients/list', { patients, title: 'Patients List' });
    } catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Form tambah pasien
app.get('/patients/add', (req, res) => {
    res.render('patients/add', { title: 'Add Patient'});
});

// Tambah pasien baru
app.post('/patients/add', async (req, res) => {
    const { name, age, gender, address } = req.body;
    try {
        await db.execute('INSERT INTO patients (name, age, gender, address) VALUES (?, ?, ?, ?)', [name, age, gender, address]);
        res.redirect('/patients');
    } catch (err) {
        console.error('Error adding patient:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Form edit pasien
app.get('/patients/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [patients] = await db.execute('SELECT * FROM patients WHERE id = ?', [id]);
        if (patients.length === 0) {
            res.status(404).send('Patient not found');
            return;
        }
        res.render('patients/edit', { patient: patients[0], title: 'Edit Patient'  });
    } catch (err) {
        console.error('Error fetching patient:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Edit pasien
app.post('/patients/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, gender, address } = req.body;
    try {
        await db.execute('UPDATE patients SET name = ?, age = ?, gender = ?, address = ? WHERE id = ?', [name, age, gender, address, id]);
        res.redirect('/patients');
    } catch (err) {
        console.error('Error updating patient:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Hapus pasien
app.post('/patients/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM patients WHERE id = ?', [id]);
        res.redirect('/patients');
    } catch (err) {
        console.error('Error deleting patient:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
