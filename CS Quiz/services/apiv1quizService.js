const axios = require('axios');
           async function queryOpenai(model,prompt) {
}

// Send hardcoded questions if no key is provided

hardcoded_questions = [
    [
  {
    "question": "What does CPU stand for?",
    "answers": ["Central Processing Unit", "Computer Personal Unit", "Central Performance Unit", "Control Processing Unit"],
    "correct": 0
  },
  {
    "question": "Which of the following is a programming language?",
    "answers": ["HTML", "CSS", "Python", "HTTP"],
    "correct": 2
  },
  {
    "question": "What does RAM stand for in computer terms?",
    "answers": ["Read Access Memory", "Random Access Memory", "Run Access Memory", "Rapid Action Memory"],
    "correct": 1
  },
  {
    "question": "Which device is primarily used to input data into a computer?",
    "answers": ["Monitor", "Keyboard", "Printer", "Speaker"],
    "correct": 1
  },
  {
    "question": "What is the main purpose of an operating system?",
    "answers": ["To manage hardware and software resources", "To create documents", "To browse the internet", "To protect from viruses"],
    "correct": 0
  }
]
];

module.exports.getQuiz = function getQuiz(req, res) {
    const prompt = "Create an array with 5 questions on basic computer science, each question should be a json object with only three fields, a first field “question” with a, a second field “answers” with an array of 4 possible answers, and a third field “correct” with the index of the correct answer. You should only response with the json code."
    const model = "gpt-4o";
    const apiKey =  process.env.APIKEY;

    if(!process.env.APIKEY){
        res.send(hardcoded_questions);
    }else{

        const apiUrl = 'https://api.openai.com/v1/chat/completions';

        axios.post(
            apiUrl,
                {
                    model: model,
                    messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: prompt },
                    ],
                    max_tokens: 2048,
                    temperature: 0.7
                },
                {
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                    },
                }
                ).then((response)=>{

                        const fullText = response.data.choices[0].message.content;

                        // Split into lines
                        const lines = fullText.split('\n');

                        // Remove first and last lines
                        const trimmedLines = lines.slice(1, -1);

                        // Join back into a string
                        const cleanedText = trimmedLines.join('\n');
                        let jsonArrayString = `[${cleanedText}]`;

                        // 2. Parse the string as JSON
                        let questions;
                        try {
                            questions = JSON.parse(jsonArrayString);
                            
                            res.send(questions);
                        } catch (e) {
                            console.error('Invalid JSON:', e);
                        }
                        
                }).catch((error) => {
                        console.error('OpenAI Request Error:', error);
                });        
    }

}

