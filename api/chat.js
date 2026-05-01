export default async function handler(req, res) {
    // Faqat POST so'rovlarini qabul qilamiz
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY; // Kalitni xavfsiz o'qiymiz

    // Agar kalit topilmasa xato beramiz
    if (!apiKey) {
        return res.status(500).json({ error: 'API kaliti sozlanmagan' });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();

        // Gemini-dan kelgan javobni tekshiramiz
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            res.status(200).json({ text: aiResponse });
        } else {
            res.status(500).json({ error: 'AI noto‘g‘ri formatda javob qaytardi' });
        }

    } catch (error) {
        console.error("Xatolik:", error);
        res.status(500).json({ error: 'Serverda ichki xatolik yuz berdi' });
    }
}