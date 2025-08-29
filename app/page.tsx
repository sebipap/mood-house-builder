"use client";

import { Badge } from "@/components/ui/badge";
import { House, houses, TinyModule } from "@/lib/houses";
import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { inputSchema, MyUIMessage } from "./api/chat/route";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ImageType = "facade" | "isometric" | "layout";

interface Selection {
  bedrooms?: number;
  selectedHouse?: House;
  tinyModules: TinyModule[];
  roofType?: "horizontal" | "inclined";
}

const getImagePath = (house: House, imageType: ImageType): string => {
  const baseId = house.image_url.replace(".jpg", "").replace(/_-_/g, "_");
  const typeMap = {
    facade: "fachada",
    isometric: "volumetria",
    layout: "layout",
  };
  return `/houses/snippets/${baseId}/${baseId}_${typeMap[imageType]}.jpg`;
};

const getImageTypeLabel = (imageType: ImageType): string => {
  const labelMap = {
    facade: "Facade",
    isometric: "Isometric",
    layout: "Floor Plan",
  };
  return labelMap[imageType];
};

// Skeleton components
const HouseSkeleton = () => (
  <div className="border border-[#e6ddc7] bg-[#f8f6f0] p-4 flex flex-col gap-2 shadow-sm animate-pulse">
    <div className="flex gap-2 mb-2">
      <div className="h-5 w-12 bg-gray-200"></div>
      <div className="h-5 w-8 bg-gray-200"></div>
      <div className="h-5 w-16 bg-gray-200"></div>
    </div>
    <div className="flex flex-wrap gap-1 mb-2">
      <div className="h-4 w-16 bg-gray-200"></div>
      <div className="h-4 w-20 bg-gray-200"></div>
    </div>
    <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex space-x-1">
    <div className="w-2 h-2 rounded bg-[#a89584] animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 rounded bg-[#a89584] animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 rounded bg-[#a89584] animate-bounce"></div>
  </div>
);

export default function HouseBuilder() {
  const [input, setInput] = useState("");
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
  const [selectedImageType, setSelectedImageType] =
    useState<ImageType>("facade");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat<MyUIMessage>({
    onToolCall: ({ toolCall }) => {
      switch (toolCall.toolName) {
        case "selectHouses": {
          const { houseIds } = inputSchema.parse(toolCall.input);
          console.log(houses.filter((h) => houseIds.includes(h.id)));
          setIsLoading(true);
          // Simulate loading delay for better UX
          setTimeout(() => {
            setFilteredHouses(houses.filter((h) => houseIds.includes(h.id)));
            setIsLoading(false);
          }, 1500);
        }
      }
    },

    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `# 🌿 Bienvenido a MOOD  

Soy tu asistente personal para que diseñemos juntos **la casa de tus sueños**.  

### Sobre MOOD  
En **MOOD** fabricamos viviendas sostenibles con tecnología **CLT (Madera Laminada Cruzada)** en nuestra fábrica *off-site*.  
Nuestras casas son:  
- 🧩 **Modulares**  
- 🎨 **Personalizables**  
- 🌱 **Respetuosas con el medio ambiente**  

### ¿Cómo te puedo ayudar?  
Estoy acá para guiarte a encontrar la configuración perfecta para vos.  

Para empezar, contame:  
- 👉 ¿Vas a vivir en la casa o es para turismo?  
- 👉 ¿Qué capacidad necesitás?  

Y si tenés dudas, preguntame lo que quieras — te voy a acompañar a armar tu casa ideal ✨  
`,
          },
        ],
      },
    ],
  });

  // Auto-scroll to bottom when messages change or when streaming
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    };

    // Small delay to ensure DOM has updated
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, status]);

  return (
    <div className="flex flex-col h-screen bg-[#f8f6f0]">
      {/* Header with Logo and Stepper */}
      <div className="shadow-sm border-b px-6 py-4 bg-white">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/mood/iso.avif"
              alt="MOOD Logo"
              className="w-10 h-10 p-1 rounded-full object-cover  shadow-sm"
            />
            <div>
              <h1 className="text-2xl font-playfair font-normal text-[#8b7355]">
                MOOD
              </h1>
              <p className="text-xs text-[#a89584]">House Builder Assistant</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center space-x-8">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold bg-[#f5f2ed] text-[#8b7355]">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-[#8b7355]">
                Tamaño
              </span>
            </div>

            {/* Divider */}
            <div className="w-8 h-px bg-neutral-300"></div>

            {/* Step 2 */}
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-neutral-200 text-neutral-500 rounded-full text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-neutral-500">
                Tiny
              </span>
            </div>

            {/* Divider */}
            <div className="w-8 h-px bg-neutral-300"></div>

            {/* Step 3 */}
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-neutral-200 text-neutral-500 rounded-full text-sm font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-neutral-500">
                Cubierta
              </span>
            </div>

            {/* Divider */}
            <div className="w-8 h-px bg-neutral-300"></div>

            {/* Step 4 */}
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-neutral-200 text-neutral-500 rounded-full text-sm font-semibold">
                4
              </div>
              <span className="ml-2 text-sm font-medium text-neutral-500">
                Mood
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Panel */}
        <div
          className={cn(
            "w-1/4 flex flex-col shadow-lg",
            filteredHouses.length === 0 && "w-full"
          )}
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f8f6f0]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "user" ? (
                  <div className={cn("relative ml-8")}>
                    {/* User chat bubble tail */}
                    <div className="absolute w-0 h-0 right-0 top-3 -right-2 border-l-[8px] border-l-[#8b7355] border-t-[6px] border-b-[6px] border-t-transparent border-b-transparent" />

                    <div className="w-fit max-w-full px-4 py-2 text-white bg-[#8b7355]">
                      <div className="text-wrap whitespace-break-spaces">
                        {message.parts
                          .map((p) => (p.type === "text" ? p.text : ""))
                          .join("")}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-full px-4 py-2 text-gray-800 bg-[#f0ebe1] break-words overflow-hidden">
                    <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-strong:text-gray-800 prose-p:text-gray-800 prose-li:text-gray-800">
                      {message.parts.length === 0 ||
                      (message.parts.filter((p) => p.type === "text").length ===
                        0 &&
                        status === "streaming") ? (
                        <div className="flex justify-start">
                          <div className="p-2 bg-[#f0ebe1]">
                            <TypingIndicator />
                          </div>
                        </div>
                      ) : (
                        <div className="prose prose-sm prose-headings:text-gray-800 prose-strong:text-gray-800 prose-p:text-gray-800 prose-li:text-gray-800 prose-a:text-blue-600 prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-amber-200 prose-blockquote:pl-4 prose-blockquote:text-gray-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-100 prose-pre:p-2 prose-pre:rounded list-disc list-inside">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              ul: ({ node, ...props }) => (
                                <ul
                                  {...props}
                                  className={cn(
                                    props.className,
                                    "list-disc list-inside"
                                  )}
                                />
                              ),
                              ol: ({ node, ...props }) => (
                                <ol
                                  {...props}
                                  className={cn(
                                    props.className,
                                    "list-decimal list-inside"
                                  )}
                                />
                              ),
                              li: ({ node, ...props }) => (
                                <li
                                  {...props}
                                  className={cn(props.className, "ml-4")}
                                />
                              ),
                              table: ({ node, ...props }) => (
                                <table
                                  {...props}
                                  className={cn(
                                    props.className,
                                    "min-w-full border border-amber-200 rounded-lg overflow-hidden bg-white shadow-sm my-4"
                                  )}
                                />
                              ),
                              thead: ({ node, ...props }) => (
                                <thead {...props} className="bg-amber-50" />
                              ),
                              th: ({ node, ...props }) => (
                                <th
                                  {...props}
                                  className="px-4 py-2 border-b border-amber-200 text-left font-semibold text-amber-900"
                                />
                              ),
                              td: ({ node, ...props }) => (
                                <td
                                  {...props}
                                  className="px-4 py-2 border-b border-amber-100 text-amber-800"
                                />
                              ),
                              tr: ({ node, ...props }) => (
                                <tr {...props} className="even:bg-amber-50" />
                              ),
                            }}
                          >
                            {message.parts
                              .map((p) => (p.type === "text" ? p.text : ""))
                              .join("")}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-[#e6ddc7] bg-[#f8f6f0] p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim()) {
                  sendMessage({ text: input });
                  setInput("");
                }
              }}
              className="flex gap-2"
            >
              <input
                className="flex-1 px-3 py-2 border border-[#e6ddc7] bg-[#f8f6f0] focus:outline-none focus:ring-2 focus:ring-[#8b7355] text-black"
                value={input}
                placeholder="Escribe tu mensaje..."
                onChange={(e) => setInput(e.currentTarget.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 text-white bg-[#8b7355] hover:bg-[#6b5943] focus:outline-none focus:ring-2 focus:ring-[#8b7355] transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>

        {/* House Display Panel */}
        {filteredHouses.length > 0 && (
          <div className="w-3/4 overflow-y-auto p-6 bg-[#f0ebe1]">
            {/* Image Type Selection */}
            <div className="mb-4 flex justify-center gap-2">
              {(["facade", "isometric", "layout"] as ImageType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedImageType(type)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors shadow-sm border",
                      selectedImageType === type
                        ? "bg-[#8b7355] text-white"
                        : "bg-[#f8f6f0] text-[#8b7355] border-[#e6ddc7] hover:bg-[#f0ebe1]"
                    )}
                  >
                    {getImageTypeLabel(type)}
                  </button>
                )
              )}
            </div>

            {/* Houses Grid */}
            <div className="grid grid-cols-2 gap-4">
              {isLoading
                ? // Show skeletons while loading
                  Array.from({ length: 4 }).map((_, index) => (
                    <HouseSkeleton key={index} />
                  ))
                : filteredHouses.map((h) => (
                    <div
                      className="border border-[#e6ddc7] bg-[#f8f6f0] text-[#8b7355] p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                      key={h.id}
                    >
                      <div className="flex gap-2 mb-2">
                        <Badge>{h.type}</Badge>
                        <Badge>{h.size}</Badge>
                        <Badge>Area: {h.total_area_m2} m2</Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {h.rooms.map((r) => (
                          <Badge
                            key={r}
                            className="bg-transparent border border-gray-400 text-gray-700"
                          >
                            {r}
                          </Badge>
                        ))}
                      </div>

                      <img
                        src={getImagePath(h, selectedImageType)}
                        alt={`${h.type} - ${getImageTypeLabel(
                          selectedImageType
                        )}`}
                        className="w-full h-auto transition-transform duration-300"
                      />
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
