"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Box, Triangle, Calculator, Shapes, Hexagon, Sparkles, X, Download } from "lucide-react"

interface ARConcept {
  name: string
  description: string
  icon: React.ReactNode
}

const arConcepts: ARConcept[] = [
  {
    name: "3D Geometry",
    description: "Visualize cubes, spheres, pyramids, and complex 3D shapes in augmented reality",
    icon: <Box className="w-5 h-5" />,
  },
  {
    name: "Trigonometry",
    description: "See sine, cosine, and tangent relationships with interactive angle visualizations",
    icon: <Triangle className="w-5 h-5" />,
  },
  {
    name: "Arithmetic Progression",
    description: "Watch sequences grow and understand patterns with visual AR representations",
    icon: <Calculator className="w-5 h-5" />,
  },
  {
    name: "Factors",
    description: "Explore factor trees and prime factorization with interactive 3D models",
    icon: <Shapes className="w-5 h-5" />,
  },
  {
    name: "Complex Shapes",
    description: "Examine trianguloids, polyhedra, and other advanced geometric forms in AR",
    icon: <Hexagon className="w-5 h-5" />,
  },
]

export function ARConcepts() {
  const [showARModal, setShowARModal] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<string>("");

  // AR Images mapping by concept
  const arImages: Record<string, string> = {
    "3D Geometry": "/image/3d_geometry.jpeg",
    "Trigonometry": "/image/trigonometry.jpeg",
    "Arithmetic Progression": "/image/ap.jpeg",
    "Factors": "/image/factors.jpeg",
    "Complex Shapes": "/image/ar_image.jpeg"
  };

  const currentImage = arImages[selectedConcept] || "/image/ar_image.jpeg";

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          Concepts Available in AR
          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            AR Enhanced
          </Badge>
        </CardTitle>
        <CardDescription>
          These topics support augmented reality visualization for deeper understanding
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {arConcepts.map((concept) => (
            <div
              key={concept.name}
              className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/30 transition-colors">
                {concept.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{concept.name}</p>
                  <Badge variant="outline" className="text-xs text-primary border-primary/30">
                    AR Supported
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{concept.description}</p>
              </div>
              <Button
                size="sm"
                className="gap-1.5 shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("AR button clicked for", concept.name);
                  setSelectedConcept(concept.name);
                  setShowARModal(true);
                }}
              >
                <Eye className="w-3.5 h-3.5" />
                Explore in AR
              </Button>
            </div>
          ))}
        </div>

        {/* AR Modal */}
        {showARModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Explore this concept in AR
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowARModal(false)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Instructions */}
                <div className="space-y-2">
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>Step 1: Download the AR images</li>
                    <li>Step 2: Install the AR app</li>
                    <li>Step 3: Open the app and scan any of the images</li>
                  </ul>
                </div>

                {/* Download All Images Button */}
                <Button
                  variant="outline"
                  onClick={() => {
                    const images = [
                      "/image/ar1.jpeg",
                      "/image/ar2.jpeg",
                      "/image/ar3.jpeg",
                      "/image/ar4.jpeg",
                      "/image/ar5.jpeg"
                    ];

                    images.forEach((img, index) => {
                      const link = document.createElement("a");
                      link.href = img;
                      link.download = `ar_image_${index + 1}.jpeg`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    });
                  }}
                  className="w-full gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download AR Images
                </Button>

                {/* Download AR App */}
                <Button
                  onClick={() => {
                    window.open(
                      "https://drive.google.com/uc?export=download&id=1XmPF7wQuyPaZZ0U1aJ0yn8ajEpbiZPhY",
                      "_blank"
                    );
                  }}
                  className="w-full gap-2 bg-primary hover:bg-primary/90"
                >
                  <Eye className="w-4 h-4" />
                  Download AR App
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setShowARModal(false)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
