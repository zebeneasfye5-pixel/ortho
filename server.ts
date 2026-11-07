import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Orthodox fallback translations dictionary for instant ultra-fast response
const quickTranslations: Record<string, Record<string, string>> = {
  "በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን።": {
    "English": "In the name of the Father, and of the Son, and of the Holy Spirit, One God, Amen.",
    "Ge'ez": "በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ አሜን።",
    "Tigrinya": "ብእምባባ አብን ወልድን መንፈስ ቅዱስን ሓደ ኣምላኽ ኣሜን።",
    "Afaan Oromoo": "Maqaa Abbaa, Ilmaa, Afuura Qulqulluu Waaqa Tokkoon, Ameen.",
    "Greek": "Εἰς τὸ ὄνομα τοῦ Πατρὸς καὶ τοῦ Υἱοῦ καὶ τοῦ Ἁγίου Πνεύματος, Ἀμήν.",
    "Russian": "Во имя Отца и Сына и Святого Духа, Единого Бога, Аминь.",
    "Arabic": "باسم الآب والابن والروح القدس، إله واحد، آمين.",
    "French": "Au nom du Père, du Fils et du Saint-Esprit, un seul Dieu, Amen."
  },
  "ሰላም ለሁላችሁ ይሁን": {
    "English": "Peace be with you all.",
    "Ge'ez": "ሰላም ለኵልክሙ።",
    "Tigrinya": "ሰላም ንኹልኻትኩም ይኹን።",
    "Afaan Oromoo": "Nagaan hunda keessaniif haa ta'u.",
    "Greek": "Εἰρήνη πᾶσιν.",
    "Russian": "Мир всем вам.",
    "Arabic": "السلام لجميعكم.",
    "French": "Que la paix soit avec vous tous."
  }
};

// API: Real-time Multilingual Translation for Live Stream & Dialogue
app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang = 'Amharic', targetLang = 'English' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for translation' });
    }

    // Check pre-cached liturgical expressions
    if (quickTranslations[text.trim()] && quickTranslations[text.trim()][targetLang]) {
      return res.json({
        translatedText: quickTranslations[text.trim()][targetLang],
        sourceLang,
        targetLang,
        source: 'liturgical_cache'
      });
    }

    if (aiClient) {
      try {
        const prompt = `Translate the following speech/text accurately from ${sourceLang} to ${targetLang}. 
This is spoken in the context of the Orthodox Christian Church (Ethiopian Tewahedo / Oriental & Eastern Orthodox).
Preserve sacred dignity, accurate theological terminology, and natural phrasing. Output ONLY the translated text without commentary.

Text to translate:
"${text}"`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const translatedText = response.text ? response.text.trim().replace(/^"|"$/g, '') : text;
        return res.json({
          translatedText,
          sourceLang,
          targetLang,
          source: 'gemini-3.8-flash'
        });
      } catch (geminiError) {
        console.warn('Gemini translation error, falling back:', geminiError);
      }
    }

    // Fallback translation handler
    return res.json({
      translatedText: `[${targetLang}] ${text}`,
      sourceLang,
      targetLang,
      source: 'offline_engine'
    });
  } catch (error) {
    console.error('Translation error:', error);
    return res.status(500).json({ error: 'Translation failed' });
  }
});

// API: Theological Doctrine & Scripture QA Engine
app.post('/api/theological-qa', async (req, res) => {
  try {
    const { question, language = 'Amharic' } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (aiClient) {
      try {
        const systemInstruction = `You are a reverent, highly knowledgeable Orthodox Christian theological scholar, patristic authority, and spiritual educator representing the Ethiopian Orthodox Tewahedo Church and universal Oriental/Eastern Orthodox holy tradition.
Your answers must strictly adhere to the Orthodox Church's holy dogma, the 81 Books of Holy Scripture, the Holy Synod canons (Didascalia, Fetha Negest, Synaxarium), St. Yared, St. Athanasius, St. Cyril of Alexandria, and the Holy Fathers.
Always speak with pastoral gentleness, profound theological accuracy, Biblical citations (ምዕራፍና ቁጥር), and reverence. Respond in the requested language (${language}).`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: question,
          config: {
            systemInstruction
          }
        });

        return res.json({
          answer: response.text ? response.text.trim() : 'ይቅርታ፣ ምላሽ ማግኘት አልተቻለም። እባክዎ እንደገና ይሞክሩ።',
          source: 'gemini-3.8-flash'
        });
      } catch (geminiError) {
        console.warn('Gemini theological QA error, using patristic knowledge base:', geminiError);
      }
    }

    // Built-in Patristic Knowledge answers for common foundational questions
    const qLower = question.toLowerCase();
    let fallbackAnswer = "";
    if (qLower.includes('ንስሐ') || qLower.includes('ንስሀ') || qLower.includes('confession')) {
      fallbackAnswer = `ንስሐ ማለት በግዕዝ "ተነሥአ - ተነሣ" ወይም "ተጸጸተ" ከሚለው ቃል የተገኘ ሲሆን ከኃጢአት ተመልሶ ወደ እግዚአብሔር አምላክ መቅረብ ማለት ነው። 
በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ከሰባቱ አዕማደ ምሥጢራት አንዱ ነው።
ጌታችን መድኃኒታችን ኢየሱስ ክርስቶስ ለደቀ መዛሙርቱ፡ "ኃጢአታቸውን ይቅር ያላችኋቸው ሁሉ ይቀርላቸዋል፤ የያዛችሁባቸው ተይዞባቸዋል" (ዮሐ. 20፡23) በማለት የንስሐ አባቶችን ሥልጣነ ክህነት ሰጥቷቸዋል።
የንስሐ እርከኖች፡
1. የልብ ጸጸትና እውነተኛ መመለስ
2. ለንስሐ አባት በግልጽ መናዘዝ
3. የተሰጠውን ቀኖና (ጸሎት፣ ስግደት፣ ምጽዋት) በፈሪሀ እግዚአብሔር መፈጸም
4. የሥርየተ ኃጢአት ጸሎት መቀበልና ወደ ቅዱስ ቁርባን መቅረብ።`;
    } else if (qLower.includes('ተዋሕዶ') || qLower.includes('ተዋህዶ') || qLower.includes('tewahedo')) {
      fallbackAnswer = `ተዋሕዶ ማለት "አንድ ሆነ" ማለት ነው። ቃል (መለኮት) ከእመቤታችን ከቅድስት ድንግል ማርያም ከሥጋዋ ሥጋ ከነፍሷ ነፍስ ነስቶ ያለ መቀላቀል፣ ያለ መለወጥ፣ ያለ መለያየትና ያለ መከፋፈል ፍጹም አንድ የሆነበት ምስጢር ነው።
ቅዱስ ቄርሎስ እንዳስተማረው፡ "አሐዱ ባሕርይ ዘቃል ሥጉው" (የተዋሐደ የአምላክ ቃል አንድ ባሕርይ)። ክርስቶስ ፍጹም አምላክ ፍጹም ሰው ነው።`;
    } else {
      fallbackAnswer = `የኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን እምነትና ሥርዓት በቅዱሳት መጻሕፍት (81ዱ አዋልድና አበው መጻሕፍት)፣ በሐዋርያት ትውፊትና በሦስቱ ዓለም አቀፍ ጉባኤያት (ኒቂያ፣ ቍስጥንጥንያ፣ ኤፌሶን) ውሳኔ ላይ የተመሠረተ ነው። 
እምነታችን በቅድስት ሥላሴ አንድነትና ሦስትነት፣ በጌታችን በኢየሱስ ክርስቶስ ሰው መሆን (ምስጢረ ሥጋዌ)፣ በትንሣኤ ሙታን እና በዘላለም ሕይወት ያምናል።
በቤተክርስቲያናችን 7ቱ ምሥጢራት፡ ጥምቀት፣ ሜሮን፣ ቁርባን፣ ክህነት፣ ንስሐ፣ ተክሊል እና ቀንዲል ይፈጸማሉ።`;
    }

    return res.json({
      answer: fallbackAnswer,
      source: 'patristic_canon_database'
    });
  } catch (error) {
    console.error('Theological QA error:', error);
    return res.status(500).json({ error: 'Failed to process theological question' });
  }
});

// Serve frontend in development with Vite or in production from dist
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Orthodox Universal Platform server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
