const pool = require('../db');

exports.getSummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS nb_factures,
        SUM(total) AS montant_total,
        SUM(total_kg) AS quantite_totale
      FROM bill;
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération du résumé.");
  }
};

exports.getByEntity = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.name, SUM(b.total) AS total_amount
      FROM bill b
      JOIN entity e ON b.buyer_id = e.entity_id
      GROUP BY e.name
      ORDER BY total_amount DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Erreur getByEntity");
  }
};

exports.getBySpecies = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT f.name AS species, SUM(bl.quantity) AS total_weight
      FROM bill_line bl
      JOIN fish f ON bl.fish_id = f.fish_id
      GROUP BY f.name
      ORDER BY total_weight DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Erreur getBySpecies");
  }
};

exports.getTopFish = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT f.name AS species, SUM(bl.quantity) AS total_weight
      FROM bill_line bl
      JOIN fish f ON bl.fish_id = f.fish_id
      GROUP BY f.name
      ORDER BY total_weight DESC
      LIMIT 10;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Erreur getTopFish");
  }
};

exports.getByMonth = async (req, res) => {
  try {
    const { timeframe } = req.query;
    let whereClause = '';

    if (timeframe === '1m') {
      whereClause = "WHERE b.billing_date >= CURRENT_DATE - INTERVAL '1 month'";
    } else if (timeframe === '3m') {
      whereClause = "WHERE b.billing_date >= CURRENT_DATE - INTERVAL '3 months'";
    } else if (timeframe === '6m') {
      whereClause = "WHERE b.billing_date >= CURRENT_DATE - INTERVAL '6 months'";
    }

    const result = await pool.query(`
      SELECT
        TO_CHAR(b.billing_date, 'YYYY-MM') AS month,
        SUM(bl.quantity) AS total_weight,
        SUM(b.total) AS total_amount,
        COUNT(DISTINCT b.bill_id) AS nb_factures,
        AVG(b.total) AS avg_order_value
      FROM bill b
      JOIN bill_line bl ON b.bill_id = bl.bill_id
      ${whereClause}
      GROUP BY month
      ORDER BY month;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Erreur getByMonth");
  }
};

exports.getByPresentation = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT bl.presentation, SUM(bl.quantity) AS total_weight
      FROM bill_line bl
      GROUP BY bl.presentation
      ORDER BY total_weight DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Erreur getByPresentation");
  }
};

exports.getByBoat = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        bt.name AS boat, 
        COUNT(b.bill_id) AS nb_factures,
        SUM(b.total) AS total_revenue,
        SUM(b.total_kg) AS total_weight
      FROM bill b
      JOIN boat bt ON b.boat_id = bt.boat_id
      GROUP BY bt.name
      ORDER BY nb_factures DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Erreur getByBoat");
  }
};

exports.getByPaymentMethod = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        payment_method, 
        COUNT(*) AS count,
        SUM(total) AS total_amount
      FROM bill
      GROUP BY payment_method
      ORDER BY count DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Erreur getByPaymentMethod");
  }
};

exports.getByStatus = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        status, 
        COUNT(*) AS count,
        SUM(total) AS total_amount
      FROM bill
      GROUP BY status
      ORDER BY count DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Erreur getByStatus");
  }
};

exports.getDetailedAnalytics = async (req, res) => {
  try {
    const { timeframe } = req.query;
    let whereClause = '';
    
    if (timeframe === '1m') {
      whereClause = "WHERE b.billing_date >= CURRENT_DATE - INTERVAL '1 month'";
    } else if (timeframe === '3m') {
      whereClause = "WHERE b.billing_date >= CURRENT_DATE - INTERVAL '3 months'";
    } else if (timeframe === '6m') {
      whereClause = "WHERE b.billing_date >= CURRENT_DATE - INTERVAL '6 months'";
    }

    const result = await pool.query(`
      SELECT
        COUNT(DISTINCT b.bill_id) AS total_orders,
        SUM(b.total) AS total_revenue,
        SUM(b.total_kg) AS total_weight,
        AVG(b.total) AS avg_order_value,
        AVG(b.total_kg) AS avg_weight_per_order,
        COUNT(DISTINCT b.buyer_id) AS unique_customers,
        COUNT(DISTINCT b.boat_id) AS active_boats
      FROM bill b
      ${whereClause};
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur getDetailedAnalytics");
  }
};

exports.getPriceAnalysis = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        f.name AS species,
        AVG(bl.price / bl.quantity) AS avg_price_per_kg,
        MIN(bl.price / bl.quantity) AS min_price_per_kg,
        MAX(bl.price / bl.quantity) AS max_price_per_kg,
        SUM(bl.quantity) AS total_weight,
        COUNT(DISTINCT bl.bill_id) AS nb_orders
      FROM bill_line bl
      JOIN fish f ON bl.fish_id = f.fish_id
      WHERE bl.quantity > 0 AND bl.price > 0
      GROUP BY f.name
      HAVING SUM(bl.quantity) > 10
      ORDER BY total_weight DESC
      LIMIT 15;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur getPriceAnalysis");
  }
};

exports.getSeasonalAnalysis = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        EXTRACT(MONTH FROM b.billing_date) AS month_num,
        TO_CHAR(b.billing_date, 'Month') AS month_name,
        SUM(b.total_kg) AS total_weight,
        SUM(b.total) AS total_revenue,
        COUNT(b.bill_id) AS total_orders,
        AVG(b.total) AS avg_order_value
      FROM bill b
      WHERE b.billing_date >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY EXTRACT(MONTH FROM b.billing_date), TO_CHAR(b.billing_date, 'Month')
      ORDER BY month_num;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur getSeasonalAnalysis");
  }
};

exports.getPaymentMethodDetails = async (req, res) => {
  const method = req.query.method;

  if (!method) {
    return res.status(400).json({ error: 'Méthode de paiement manquante.' });
  }

  try {
    const result = await pool.query(`
      SELECT 
        bl.presentation, 
        SUM(bl.quantity) AS total_weight,
        SUM(bl.price) AS total_amount,
        COUNT(DISTINCT bl.bill_id) AS nb_orders
      FROM bill_line bl
      JOIN bill b ON bl.bill_id = b.bill_id
      WHERE b.payment_method = $1
      GROUP BY bl.presentation
      ORDER BY total_weight DESC;
    `, [method]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Aucune donnée trouvée pour cette méthode.' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération des détails par méthode de paiement.");
  }
};

exports.getBillsByBoat = async (req, res) => {
  const boatName = req.query.boat;

  console.log('🛳️ Requête factures pour bateau:', boatName);

  if (!boatName) {
    return res.status(400).json({ error: 'Nom de bateau manquant.' });
  }

  try {
    const result = await pool.query(`
      SELECT 
        b.bill_id, 
        b.status AS type, 
        b.total, 
        b.billing_date,
        b.total_kg,
        e.name AS buyer_name
      FROM bill b
      JOIN boat bt ON b.boat_id = bt.boat_id
      LEFT JOIN entity e ON b.buyer_id = e.entity_id
      WHERE LOWER(bt.name) = LOWER($1)
      ORDER BY b.billing_date DESC;
    `, [boatName]);

    console.log('Factures récupérées:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur SQL getBillsByBoat:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des factures par bateau.' });
  }
};

exports.getProfitabilityAnalysis = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.name AS customer,
        COUNT(b.bill_id) AS total_orders,
        SUM(b.total) AS total_revenue,
        SUM(b.total_kg) AS total_weight,
        AVG(b.total) AS avg_order_value,
        MAX(b.billing_date) AS last_order_date,
        MIN(b.billing_date) AS first_order_date
      FROM bill b
      JOIN entity e ON b.buyer_id = e.entity_id
      GROUP BY e.name, e.entity_id
      HAVING COUNT(b.bill_id) > 1
      ORDER BY total_revenue DESC
      LIMIT 20;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur getProfitabilityAnalysis");
  }
};