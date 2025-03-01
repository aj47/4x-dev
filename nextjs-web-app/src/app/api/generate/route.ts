import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const frameworkPrompts = {
  tailwind: 'Use Tailwind CSS for styling with modern utility classes. Include the Tailwind CDN.',
  materialize: 'Use Materialize CSS framework for a Material Design look. Include the Materialize CDN.',
  bootstrap: 'Use Bootstrap 5 for responsive components and layout. Include the Bootstrap CDN.',
  patternfly: 'Use PatternFly for enterprise-grade UI components. Include the PatternFly CDN.',
  pure: 'Use Pure CSS for minimalist, responsive design. Include the Pure CSS CDN.'
};

export async function POST(req: Request) {
  try {
    const { prompt, variation, framework } = await req.json();
    
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
    }

    const client = new OpenAI({
      apiKey: groqApiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });

    const frameworkInstructions = framework ? frameworkPrompts[framework as keyof typeof frameworkPrompts] : '';

    const fullPrompt = `Create a well-structured, modern web application:

Instructions:
1. Base functionality: ${prompt}
2. Variation: ${variation}
3. Framework: ${frameworkInstructions}

Technical Requirements:
- Create a single HTML file with clean, indented code structure
- Organize the code in this order:
  1. <!DOCTYPE html> and meta tags
  2. <title> and other head elements
  3. Framework CSS and JS imports
  4. Custom CSS styles in a <style> tag
  5. HTML body with semantic markup
  6. JavaScript in a <script> tag at the end of body
- Use proper HTML5 semantic elements
- Include clear spacing between sections
- Add descriptive comments for each major component
- Ensure responsive design with mobile-first approach
- Use modern ES6+ JavaScript features
- Keep the code modular and well-organized
- Ensure all interactive elements have proper styling states (hover, active, etc.)
- Implement the framework-specific best practices and components

Additional Notes:
- The code must be complete and immediately runnable
- All custom CSS and JavaScript should be included inline
- Code must work properly when rendered in an iframe
- Focus on clean, maintainable code structure
- Return ONLY the HTML file content without any explanations

Format the code with proper indentation and spacing for readability.`;

    const response = await client.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [{ role: 'user', content: fullPrompt }],
      temperature: 0.7,
      max_tokens: 4096,
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}
