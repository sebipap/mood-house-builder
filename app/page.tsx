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
  <div className="border border-amber-200 p-4 rounded-xl flex flex-col gap-2 bg-white shadow-sm animate-pulse">
    <div className="flex gap-2 mb-2">
      <div className="h-5 w-12 bg-gray-200 rounded"></div>
      <div className="h-5 w-8 bg-gray-200 rounded"></div>
      <div className="h-5 w-16 bg-gray-200 rounded"></div>
    </div>
    <div className="flex flex-wrap gap-1 mb-2">
      <div className="h-4 w-16 bg-gray-200 rounded"></div>
      <div className="h-4 w-20 bg-gray-200 rounded"></div>
    </div>
    <div className="w-full h-48 bg-gray-200 rounded animate-pulse"></div>
  </div>
);

const TypingIndicator = () => (
  <div className="flex items-center space-x-1 px-4 py-2">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
    <span className="text-xs text-gray-500 ml-2">Generando respuesta...</span>
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
            text: "# ¡Hola! 🏠\n\nSoy tu asistente de **MOOD**, la solución innovadora para construir tu casa ideal.\n\n## Sobre MOOD\nEn MOOD fabricamos viviendas sostenibles con tecnología **CLT (Madera Laminada Cruzada)** en nuestra fábrica off-site. Nuestras casas son:\n- Modulares\n- Personalizables \n- Respetuosas con el medio ambiente\n\n## ¿Cómo te puedo ayudar?\nTe voy a ayudar a encontrar la configuración perfecta para ti.\n\nPara empezar, contame:\n- ¿Vas a vivir en la casa?\n- ¿Es una vivienda para turismo?\n- ¿Qué capacidad necesitas?\n\n*Haceme todas las preguntas que necesites y te ayudo a armar tu casa perfecta* ✨",
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
    <div className="flex flex-col h-screen bg-white">
      {/* Header with Logo and Stepper */}
      <div className="bg-white shadow-sm border-b border-neutral-300 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/mood/iso.avif"
              alt="MOOD Logo"
              className="w-10 h-10 p-1 rounded-full object-cover bg-white shadow-sm"
            />
            <div>
              <h1 className="text-lg font-semibold text-neutral-800">MOOD</h1>
              <p className="text-xs text-neutral-600">
                House Builder Assistant
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center space-x-8">
            {/* Step 1 */}
            <div className="flex items-center">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold"
                style={{ backgroundColor: "#f5f2ed", color: "#8b7355" }}
              >
                1
              </div>
              <span className="ml-2 text-sm font-medium text-neutral-700">
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
            "w-1/4 flex flex-col bg-white border-r border-neutral-300 shadow-lg",
            filteredHouses.length === 0 && "w-full"
          )}
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === "user"
                      ? "text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                  style={
                    message.role === "user"
                      ? { backgroundColor: "#8b7355" }
                      : {}
                  }
                >
                  {message.role === "user" ? (
                    <div className="text-wrap whitespace-break-spaces">
                      {message.parts
                        .map((p) => (p.type === "text" ? p.text : ""))
                        .join("")}
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-strong:text-gray-800 prose-p:text-gray-800 prose-li:text-gray-800">
                      {message.parts.length === 0 ||
                      (message.parts.filter((p) => p.type === "text").length ===
                        0 &&
                        status === "streaming") ? (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 rounded-lg p-2">
                            <TypingIndicator />
                          </div>
                        </div>
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.parts
                            .map((p) => (p.type === "text" ? p.text : ""))
                            .join("")}
                        </ReactMarkdown>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-neutral-200 p-4">
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
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 text-black bg-white"
                style={{ "--tw-ring-color": "#8b7355" } as React.CSSProperties}
                value={input}
                placeholder="Escribe tu mensaje..."
                onChange={(e) => setInput(e.currentTarget.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={
                  {
                    backgroundColor: "#8b7355",
                    "--tw-ring-color": "#8b7355",
                  } as React.CSSProperties
                }
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#6b5943")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#8b7355")
                }
              >
                Enviar
              </button>
            </form>
          </div>
        </div>

        {/* House Display Panel */}
        {filteredHouses.length > 0 && (
          <div className="w-3/4 bg-gray-50 overflow-y-auto p-6">
            {/* Image Type Selection */}
            <div className="mb-4 flex justify-center gap-2">
              {(["facade", "isometric", "layout"] as ImageType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedImageType(type)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm",
                      selectedImageType === type
                        ? "text-white shadow-md"
                        : "bg-white hover:border border-neutral-200"
                    )}
                    onMouseEnter={(e) => {
                      if (selectedImageType !== type) {
                        e.currentTarget.style.backgroundColor = "#f5f2ed";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedImageType !== type) {
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}
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
                      className="border p-4 rounded-xl flex flex-col gap-2 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                      style={{ borderColor: "#e5ddd1", color: "#8b7355" }}
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
                        className="w-full h-auto rounded transition-transform duration-300 hover:scale-105"
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
