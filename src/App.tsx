import React, { useEffect, useState } from "react";
import "./App.css";
import AnalysisViewer from "./AnalysisViewer";

interface ComputedStyle {
  [key: string]: string;
}

interface ElementAnalysis {
  selector: string;
  styles: ComputedStyle;
  count: number;
}

interface ComponentAnalysis {
  name: string;
  elements: ElementAnalysis[];
}

interface AnalysisOutput {
  components: ComponentAnalysis[];
}

// Mock data for demonstration - replace with actual analysis results
const mockData: AnalysisOutput = {
  components: [
    {
      name: "Button",
      elements: [
        {
          selector: ".btn",
          styles: {
            "background-color": "#3498db",
            color: "#ffffff",
            padding: "0.5rem 1rem",
            "border-radius": "4px",
            "font-size": "1rem",
          },
          count: 12,
        },
        {
          selector: ".button",
          styles: {
            "background-color": "#2ecc71",
            color: "#ffffff",
            padding: "0.75rem 1.25rem",
            "border-radius": "6px",
            "font-size": "1.1rem",
          },
          count: 8,
        },
      ],
    },
    {
      name: "Card",
      elements: [
        {
          selector: ".card",
          styles: {
            "background-color": "#ffffff",
            border: "1px solid #e0e0e0",
            "border-radius": "8px",
            padding: "1rem",
            "box-shadow": "0 2px 4px rgba(0,0,0,0.1)",
          },
          count: 15,
        },
      ],
    },
    {
      name: "Navigation",
      elements: [
        {
          selector: "nav",
          styles: {
            "background-color": "#2c3e50",
            color: "#ffffff",
            padding: "1rem",
            display: "flex",
            "justify-content": "space-between",
          },
          count: 3,
        },
      ],
    },
  ],
};

const mockMetrics = {
  totalRules: 1200,
  colors: { totalUnique: 24 },
  fontSizes: { totalUnique: 8 },
  spacing: { totalUnique: 12 },
};

const mockColors = [
  { value: "#3498db", count: 45 },
  { value: "#2ecc71", count: 32 },
  { value: "#e74c3c", count: 28 },
  { value: "#f1c40f", count: 25 },
  { value: "#9b59b6", count: 20 },
  { value: "#1abc9c", count: 18 },
  { value: "#34495e", count: 15 },
  { value: "#e67e22", count: 12 },
];

const mockFontSizes = [
  { value: "1rem", count: 120 },
  { value: "1.25rem", count: 85 },
  { value: "1.5rem", count: 60 },
  { value: "2rem", count: 45 },
  { value: "2.5rem", count: 30 },
  { value: "3rem", count: 20 },
  { value: "0.875rem", count: 95 },
  { value: "0.75rem", count: 70 },
];

const mockSpacing = [
  { value: "0.5rem", count: 150 },
  { value: "1rem", count: 200 },
  { value: "1.5rem", count: 120 },
  { value: "2rem", count: 90 },
  { value: "2.5rem", count: 60 },
  { value: "3rem", count: 40 },
  { value: "4rem", count: 25 },
  { value: "5rem", count: 15 },
];

function App() {
  const [analysisData, setAnalysisData] = useState<AnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalysisData = async () => {
      try {
        console.log("Attempting to load analysis data...");
        const response = await fetch("/computed-styles.json");
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(
            `Failed to load analysis data: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Data loaded successfully:", data);
        // Wrap the array in an object with a components property
        setAnalysisData({ components: data });
      } catch (err) {
        console.error("Error loading analysis data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load analysis data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalysisData();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <h2>Loading Analysis Data...</h2>
        <p>Please wait while we load the design system sniffer.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Analysis</h2>
        <p>{error}</p>
        <p>
          Please make sure the computed-styles.json file exists in the public
          directory.
        </p>
      </div>
    );
  }

  return (
    <div className="App">
      <AnalysisViewer analysisData={analysisData} />
    </div>
  );
}

export default App;
