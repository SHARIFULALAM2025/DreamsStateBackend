const express = require('express');
const cors = require('cors');
const { generateToken } = require('./middleware/authMiddleware');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
//
const propertyRoutes =
    require(
        './routes/propertyRoutes'
    )
app.use(
    '/api/property',
    propertyRoutes
)
//
app.post('/all-user', async (req, res) => {
    console.log(req.body);

    const {
        name,
        email,
        photo,
        password = null,
        provider = 'email',
        role 
    } = req.body;

    try {
        // ১. চেক করুন ইউজার আগে থেকেই আছেন কিনা
        let user = await db('users').where({ email }).first();

        if (user) {
            // ইউজার থাকলে সরাসরি টোকেন জেনারেট করে রেসপন্স দিন
            const token = generateToken(user);
            return res.status(200).json({
                message: 'User already exists, login successful',
                user: { id: user.id, name: user.name, email: user.email, role: user.role, photo: user.photo },
                token // ফ্রন্টএন্ড এই টোকেনটি লোকালস্টোরেজে সেভ রাখবে
            });
        }

        // ২. ইউজার না থাকলে নতুন ইউজার ডাটাবেজে ইনসার্ট করুন
        const [newUser] = await db('users').insert({
            name,
            email,
            photo,
            password,
            provider,
            role
        }).returning('*'); // PostgreSQL/Supabase এ returning('*') দিলে ইনসার্ট হওয়া অবজেক্টটি সরাসরি পাওয়া যায়

        // নতুন ইউজারের জন্য টোকেন তৈরি
        const token = generateToken(newUser);

        res.status(201).json({
            message: 'User saved successfully!',
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, photo: newUser.photo },
            token
        });

    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});
//
// app.post('/all-user', async (req, res) => {
//     console.log(req.body)

//     const {
//         name,
//         email,
//         photo,
//         password = null,
//         provider = 'email',
//         role
//     } = req.body

//     try {

//         const existingUser = await db('users')
//             .where({ email })
//             .first()

//         if (existingUser) {
//             return res.status(200).json({
//                 message: 'User already exists',
//                 user: existingUser,
//             })
//         }


//         const result = await db('users').insert({
//             name,
//             email,
//             photo,
//             password,
//             provider,
//             role
//         })

//         res.status(201).json({
//             message: 'User saved successfully!',
//             result,
//         })

//     } catch (error) {
//         console.error(
//             'Database Error:',
//             error
//         )

//         res.status(500).json({
//             message:
//                 'Internal Server Error',
//             error: error.message,
//         })
//     }
// })

app.get('/users', async (req, res) => {
    try {
        const users = await db('users').select('*');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//
app.post('/about/components', async (req, res) => {
    const { component_name, content_data } = req.body;
    try {

        const finalData = typeof content_data === 'object' ? JSON.stringify(content_data) : content_data;

        await db('site_components').insert({
            component_name,
            content_data: finalData
        });
        res.status(201).json({ message: "Component data saved successfully!" });
    } catch (error) {
        console.error("POST Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/components/:name', async (req, res) => {
    try {
        const data = await db('site_components').where({ component_name: req.params.name }).first();

        if (data) {
            let parsedData;


            if (typeof data.content_data === 'string') {
                parsedData = JSON.parse(data.content_data);
            } else {
                parsedData = data.content_data;
            }

            res.json(parsedData);
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } catch (error) {
        console.error("GET Error:", error);
        res.status(500).json({ error: error.message });
    }
});
//
app.post('/faq/components', async (req, res) => {
    const { component_name, content_data } = req.body;
    try {

        const finalData = typeof content_data === 'object' ? JSON.stringify(content_data) : content_data;

        await db('Faq_page_data').insert({
            component_name,
            content_data: finalData
        });
        res.status(201).json({ message: "Component data saved successfully!" });
    } catch (error) {
        console.error("POST Error:", error);
        res.status(500).json({ error: error.message });
    }
});
app.get('/faq/components/data/:name', async (req, res) => {
    try {
        const data = await db('Faq_page_data').where({ component_name: req.params.name }).first();

        if (data) {
            let parsedData;


            if (typeof data.content_data === 'string') {
                parsedData = JSON.parse(data.content_data);
            } else {
                parsedData = data.content_data;
            }

            res.json(parsedData);
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } catch (error) {
        console.error("GET Error:", error);
        res.status(500).json({ error: error.message });
    }
});
//
app.post('/blog/api', async (req, res) => {
    const { component_name, content_data } = req.body;
    try {

        const finalData = typeof content_data === 'object' ? JSON.stringify(content_data) : content_data;

        await db('blog_components').insert({
            component_name,
            content_data: finalData
        });
        res.status(201).json({ message: "Component data saved successfully!" });
    } catch (error) {
        console.error("POST Error:", error);
        res.status(500).json({ error: error.message });
    }
});
app.get('/al-blog/:name', async (req, res) => {
    try {
        const data = await db('blog_components').where({ component_name: req.params.name }).first();

        if (data) {
            let parsedData;
            if (typeof data.content_data === 'string') {
                parsedData = JSON.parse(data.content_data);
            } else {
                parsedData = data.content_data;
            }

            res.json(parsedData);
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } catch (error) {
        console.error("GET Error:", error);
        res.status(500).json({ error: error.message });
    }
});
app.get('/blog/single/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const data = await db('blog_components')
            .where({ component_name: 'blog_page_data' })
            .first();

        if (data) {
            let parsedContentData;


            if (typeof data.content_data === 'string') {
                parsedContentData = JSON.parse(data.content_data);
            } else {
                parsedContentData = data.content_data;
            }


            if (Array.isArray(parsedContentData)) {
                const singleAgent = parsedContentData.find(agent => String(agent.id) === String(id));

                if (singleAgent) {

                    return res.json(singleAgent);
                } else {
                    return res.status(404).json({ message: `Agent with ID ${id} not found` });
                }
            } else {
                return res.status(500).json({ message: "content_data is not an array" });
            }

        } else {
            res.status(404).json({ message: "Component data not found in database" });
        }
    } catch (error) {
        console.error("GET Error:", error);
        res.status(500).json({ error: error.message });
    }
});
//
app.post('/agent/api', async (req, res) => {
    const { component_name, content_data } = req.body;
    try {

        const finalData = typeof content_data === 'object' ? JSON.stringify(content_data) : content_data;

        await db('agent_components').insert({
            component_name,
            content_data: finalData
        });
        res.status(201).json({ message: "Component data saved successfully!" });
    } catch (error) {
        console.error("POST Error:", error);
        res.status(500).json({ error: error.message });
    }
});
app.get('/components/agent/:name', async (req, res) => {
    try {
        const data = await db('agent_components').where({ component_name: req.params.name }).first();

        if (data) {
            let parsedData;
            if (typeof data.content_data === 'string') {
                parsedData = JSON.parse(data.content_data);
            } else {
                parsedData = data.content_data;
            }

            res.json(parsedData);
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } catch (error) {
        console.error("GET Error:", error);
        res.status(500).json({ error: error.message });
    }
});
app.get('/single/agent/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const data = await db('agent_components')
            .where({ component_name: 'agent_profile_page_data' })
            .first();

        if (data) {
            let parsedContentData;


            if (typeof data.content_data === 'string') {
                parsedContentData = JSON.parse(data.content_data);
            } else {
                parsedContentData = data.content_data;
            }


            if (Array.isArray(parsedContentData)) {
                const singleAgent = parsedContentData.find(agent => String(agent.id) === String(id));

                if (singleAgent) {

                    return res.json(singleAgent);
                } else {
                    return res.status(404).json({ message: `Agent with ID ${id} not found` });
                }
            } else {
                return res.status(500).json({ message: "content_data is not an array" });
            }

        } else {
            res.status(404).json({ message: "Component data not found in database" });
        }
    } catch (error) {
        console.error("GET Error:", error);
        res.status(500).json({ error: error.message });
    }
});
//
app.post('/testimonial/components', async (req, res) => {
    const { component_name, content_data } = req.body;
    try {

        const finalData = typeof content_data === 'object' ? JSON.stringify(content_data) : content_data;

        await db('testimonial_page_data').insert({
            component_name,
            content_data: finalData
        });
        res.status(201).json({ message: "Component data saved successfully!" });
    } catch (error) {
        console.error("POST Error:", error);
        res.status(500).json({ error: error.message });
    }
});
app.get('/testimonial/components/:name', async (req, res) => {
    try {
        const data = await db('testimonial_page_data').where({ component_name: req.params.name }).first();

        if (data) {
            let parsedData;


            if (typeof data.content_data === 'string') {
                parsedData = JSON.parse(data.content_data);
            } else {
                parsedData = data.content_data;
            }

            res.json(parsedData);
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } catch (error) {
        console.error("GET Error:", error);
        res.status(500).json({ error: error.message });
    }
});
//
app.post('/agency/component', async (req, res) => {
    const { component_name, content_data } = req.body;
    try {

        const finalData = typeof content_data === 'object' ? JSON.stringify(content_data) : content_data;

        await db('agency_page_data').insert({
            component_name,
            content_data: finalData
        });
        res.status(201).json({ message: "Component data saved successfully!" });
    } catch (error) {
        console.error("POST Error:", error);
        res.status(500).json({ error: error.message });
    }
});
app.get('/allAgency/data/:name', async (req, res) => {
    try {
        const data = await db('agency_page_data').where({ component_name: req.params.name }).first();

        if (data) {
            let parsedData;


            if (typeof data.content_data === 'string') {
                parsedData = JSON.parse(data.content_data);
            } else {
                parsedData = data.content_data;
            }

            res.json(parsedData);
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } catch (error) {
        console.error("GET Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/singleAgency/single/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const data = await db('agency_page_data')
            .where({ component_name: 'agency_page_data' })
            .first();

        if (data) {
            let parsedContentData;


            if (typeof data.content_data === 'string') {
                parsedContentData = JSON.parse(data.content_data);
            } else {
                parsedContentData = data.content_data;
            }


            if (Array.isArray(parsedContentData)) {
                const singleAgent = parsedContentData.find(agent => String(agent.id) === String(id));

                if (singleAgent) {

                    return res.json(singleAgent);
                } else {
                    return res.status(404).json({ message: `Agent with ID ${id} not found` });
                }
            } else {
                return res.status(500).json({ message: "content_data is not an array" });
            }

        } else {
            res.status(404).json({ message: "Component data not found in database" });
        }
    } catch (error) {
        console.error("GET Error:", error);
        res.status(500).json({ error: error.message });
    }
});
//
app.post('/benefitData/api', async (req, res) => {
    const { component_name, content_data } = req.body;
    try {

        const finalData = typeof content_data === 'object' ? JSON.stringify(content_data) : content_data;

        await db('benefit_page_data').insert({
            component_name,
            content_data: finalData
        });
        res.status(201).json({ message: "Component data saved successfully!" });
    } catch (error) {
        console.error("POST Error:", error);
        res.status(500).json({ error: error.message });
    }
});
app.get('/benefit/data/:name', async (req, res) => {
    try {
        const data = await db('benefit_page_data').where({ component_name: req.params.name }).first();

        if (data) {
            let parsedData;


            if (typeof data.content_data === 'string') {
                parsedData = JSON.parse(data.content_data);
            } else {
                parsedData = data.content_data;
            }

            res.json(parsedData);
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } catch (error) {
        console.error("GET Error:", error);
        res.status(500).json({ error: error.message });
    }
});

//
app.post('/homeAbout/api', async (req, res) => {
    const { component_name, content_data } = req.body;
    try {

        const finalData = typeof content_data === 'object' ? JSON.stringify(content_data) : content_data;

        await db('homeAbout_page_data').insert({
            component_name,
            content_data: finalData
        });
        res.status(201).json({ message: "Component data saved successfully!" });
    } catch (error) {
        console.error("POST Error:", error);
        res.status(500).json({ error: error.message });
    }
});
app.get('/aboutHome/:name', async (req, res) => {
    try {
        const data = await db('homeAbout_page_data').where({ component_name: req.params.name }).first();

        if (data) {
            let parsedData;


            if (typeof data.content_data === 'string') {
                parsedData = JSON.parse(data.content_data);
            } else {
                parsedData = data.content_data;
            }

            res.json(parsedData);
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } catch (error) {
        console.error("GET Error:", error);
        res.status(500).json({ error: error.message });
    }
});








//
app.get('/', (req, res) => {
    res.send('your backend is working!');
});


app.get('/api/products', async (req, res) => {
    try {
        const products = await db('products').select('*');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running: http://localhost:${PORT}`);
});

db.raw('SELECT NOW()')
    .then(() => {
        console.log('--- 🚀 (Supabase) connected successfully ---');
    })
    .catch((error) => {
        console.error('--- ❌ connection failed ---');
        console.error('because:', error.message);
    });