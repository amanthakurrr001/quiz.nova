import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quiz-from-topic.ts';
import '@/ai/flows/summarize-quiz-results.ts';