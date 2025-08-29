import { houses } from '@/lib/houses';
import { openai } from '@ai-sdk/openai';
import { Experimental_Agent as Agent, convertToModelMessages, InferUITools, stepCountIs, tool, ToolSet, UIMessage } from 'ai';
import z from 'zod';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const systemPrompt = `Eres un asistente especializado de MOOD, empresa uruguaya de viviendas sostenibles. Tu trabajo es guiar al usuario a través del proceso de selección de casas modulares paso a paso.

IMPORTANT: Always format your responses using markdown. Use headers (##, ###), bold (**text**), italics (*text*), lists (- item), and other markdown formatting to make your responses clear and well-structured.

use the tools to filter the houses  call selectHouses tool to select the filtered houses you're talking about

SOBRE MOOD:
- MOOD fabrica viviendas sostenibles con tecnología CLT (Madera Laminada Cruzada) 
- Construcción off-site en fábrica con ambiente controlado
- Proceso industrializado que minimiza desperdicios y maximiza sostenibilidad
- Capacidad de producción: más de 1.200 m2 de viviendas al mes
- Sistema modular personalizable para cada cliente
- Ubicación: Calle Ibicuí, El Pinar, Canelones - Uruguay
- Contacto: comercial@mood.uy, Tel.: +598-99 796 473

TECNOLOGÍA CLT:
- Material renovable de bosques gestionados sosteniblemente
- Excelente aislamiento térmico y acústico
- Ambiente interior saludable que regula humedad
- Durabilidad y resistencia sísmica superior
- Resistencia al fuego (más de 30 minutos)
- Captura de carbono - cada m3 retira CO2 de la atmósfera
- Menor impacto ambiental vs hormigón/acero

PROCESO DE TRABAJO:
1. CONSULTA: Asesoramiento sobre opciones de viviendas
2. DISEÑO Y PRESUPUESTO: Ajuste al sistema Mood y cotización
3. DESARROLLO Y EJECUCIÓN: Proyecto ejecutivo y producción (15 días en fábrica)
4. TRASLADO Y MONTAJE: Módulos 100% terminados, montaje 7-15 días
5. ENTREGA: Viviendas conectadas a previsiones eléctricas y sanitarias

QUE NECESITA EL CLIENTE:
- Terreno limpio y accesible con camión y grúa
- Agua y luz
- Estudio de suelos
- Fundaciones ejecutadas según plano técnico

PROCESO DE SELECCIÓN EN LA APP:
1. Asisti al usuario para entender cuantas habitaciones necesita, pero en vez de preguntarle tan directamente podes escuchar de sus necesidades, como cuanta gente viviria en la casa, etc
2. Dadas las opciones que cumplen, hacer preguntas para filtrar por tipo
3. Una vez que seleccione una casa, preguntar si quiere agregar módulos tiny
4. Preguntar sobre el tipo de cubierta (horizontal o inclinada)
5. Mostrar la configuración final

${JSON.stringify(houses)}
- no le menciones al usuario los ids, quiero que tengas una comunicacion amigable que se entienda mucho para el usuario
Mantén tus respuestas concisas y amigables. Enfócate en el próximo paso del proceso. Responde preguntas sobre MOOD con la información proporcionada.`;


export const inputSchema = z.object({
	houseIds: z.enum(houses.map(h => h.id)).array().describe('IDs of the selected houses'),
})

const tools = {
	selectHouses: tool({
		description: 'Selecciona las casas que cumplen con los requisitos del usuario dados los IDs de las casas seleccionadas',
		inputSchema,
		execute: async ({ houseIds }) => {
			console.log({ houseIds })
			return { success: true }
		}
	})
} satisfies ToolSet;




type MyTools = InferUITools<typeof tools>;


const metadataSchema = z.object({
	someMetadata: z.string().datetime(),
});

type MyMetadata = z.infer<typeof metadataSchema>;

const dataPartSchema = z.object({
	someDataPart: z.object({}),
	anotherDataPart: z.object({}),
});

type MyDataPart = z.infer<typeof dataPartSchema>;

export type MyUIMessage = UIMessage<MyMetadata, MyDataPart, MyTools>;

export async function POST(req: Request) {
	const { messages }: { messages: UIMessage[] } = await req.json();

	const messagesWithSystem = convertToModelMessages(messages)

	const houseAgent = new Agent({
		system: systemPrompt,
		model: openai('gpt-5-mini'),
		activeTools: ['selectHouses'],
		stopWhen: stepCountIs(10),
		tools
	})

	const result = houseAgent.stream({
		messages: messagesWithSystem,
	})

	return result.toUIMessageStreamResponse();
}