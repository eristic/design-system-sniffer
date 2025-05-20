import React, { useState, useEffect } from "react";
import "./AnalysisViewer.css";

interface ComputedStyle {
  [key: string]: string;
}

interface ElementAnalysis {
  selector: string;
  styles: ComputedStyle;
}

interface ComponentAnalysis {
  name: string;
  elements: ElementAnalysis[];
}

interface AnalysisOutput {
  components: ComponentAnalysis[];
}

interface AnalysisViewerProps {
  analysisData: AnalysisOutput | null;
}

const AnalysisViewer = ({ analysisData }: AnalysisViewerProps) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatStyleValue = (value: string) => {
    if (!value || value === "none" || value === "0px") return null;
    return value;
  };

  const processStyles = (styles: ComputedStyle) => {
    return Object.entries(styles)
      .filter(([_, value]) => formatStyleValue(value))
      .reduce((acc, [key, value]) => {
        const camelCaseKey = key.replace(/-([a-z])/g, (g) =>
          g[1].toUpperCase()
        );
        return { ...acc, [camelCaseKey]: value };
      }, {});
  };

  const renderStylesGrid = (styles: ComputedStyle) => {
    return (
      <div className="styles-grid">
        {Object.entries(styles)
          .filter(([_, value]) => formatStyleValue(value))
          .map(([property, value]) => (
            <div key={property} className="style-property">
              <span className="property-name">{property}:</span>
              <span className="property-value">{value}</span>
            </div>
          ))}
      </div>
    );
  };

  const renderComponent = (component: ComponentAnalysis) => {
    switch (component.name.toLowerCase()) {
      case "button":
        return component.elements.map((element, index) => {
          const styles = processStyles(element.styles);

          return (
            <div
              key={`${element.selector}-${index}`}
              className="component-demo"
            >
              <h3>Button Variant {index + 1}</h3>
              <p>Selector: {element.selector}</p>
              <button style={styles} className="button-demo component-object">
                {element.selector.includes("button") ? "Button" : "Click Me"}
              </button>
              {renderStylesGrid(element.styles)}
            </div>
          );
        });

      case "input":
        return component.elements.map((element, index) => {
          const styles = processStyles(element.styles);

          return (
            <div
              key={`${element.selector}-${index}`}
              className="component-demo"
            >
              <h3>Input Variant {index + 1}</h3>
              <p>Selector: {element.selector}</p>
              <input
                style={styles}
                type="text"
                placeholder="Type something..."
                className="component-object"
              />
              {renderStylesGrid(element.styles)}
            </div>
          );
        });

      case "modal":
        return component.elements.map((element, index) => {
          const styles = processStyles(element.styles);

          return (
            <div
              key={`${element.selector}-${index}`}
              className="component-demo"
            >
              <h3>Modal Variant {index + 1}</h3>
              <p>Selector: {element.selector}</p>
              <div className="modal-preview component-object" style={styles}>
                <div className="modal-content">
                  <h4>Modal Title</h4>
                  <p>This is a modal dialog</p>
                </div>
              </div>
              {renderStylesGrid(element.styles)}
            </div>
          );
        });

      case "navigation":
        return component.elements.map((element, index) => {
          const styles = processStyles(element.styles);

          return (
            <div
              key={`${element.selector}-${index}`}
              className="component-demo"
            >
              <h3>Navigation Variant {index + 1}</h3>
              <p>Selector: {element.selector}</p>
              <nav className="component-object" style={styles}>
                Nav
              </nav>
              {renderStylesGrid(element.styles)}
            </div>
          );
        });
      case "link":
        return component.elements.map((element, index) => {
          const styles = processStyles(element.styles);

          return (
            <div
              key={`${element.selector}-${index}`}
              className="component-demo"
            >
              <h3>Link Variant {index + 1}</h3>
              <p>Selector: {element.selector}</p>
              <a className="component-object" style={styles}>
                Link
              </a>
              {renderStylesGrid(element.styles)}
            </div>
          );
        });
      case "text":
        return component.elements.map((element, index) => {
          const styles = processStyles(element.styles);

          return (
            <div
              key={`${element.selector}-${index}`}
              className="component-demo"
            >
              <h3>Text Variant {index + 1}</h3>
              <p>Selector: {element.selector}</p>
              <p className="component-object" style={styles}>
                Text
              </p>
              {renderStylesGrid(element.styles)}
            </div>
          );
        });
      case "card":
        return component.elements.map((element, index) => {
          const styles = processStyles(element.styles);

          return (
            <div
              key={`${element.selector}-${index}`}
              className="component-demo"
            >
              <h3>Card Variant {index + 1}</h3>
              <p>Selector: {element.selector}</p>
              <div className="card-preview component-object" style={styles}>
                <div className="card-content">
                  <h4>Card Title</h4>
                  <p>This is a card</p>
                </div>
              </div>
              {renderStylesGrid(element.styles)}
            </div>
          );
        });
      case "checkbox":
        return component.elements.map((element, index) => {
          const styles = processStyles(element.styles);

          return (
            <div
              key={`${element.selector}-${index}`}
              className="component-demo"
            >
              <h3>Checkbox Variant {index + 1}</h3>
              <p>Selector: {element.selector}</p>
              <input
                type="checkbox"
                style={styles}
                className="component-object"
              />
              {renderStylesGrid(element.styles)}
            </div>
          );
        });
      case "switch":
        return component.elements.map((element, index) => {
          const styles = processStyles(element.styles);

          return (
            <div
              key={`${element.selector}-${index}`}
              className="component-demo"
            >
              <h3>Switch Variant {index + 1}</h3>
              <p>Selector: {element.selector}</p>
              <input
                type="checkbox"
                style={styles}
                className="component-object"
              />
              {renderStylesGrid(element.styles)}
            </div>
          );
        });
      case "tooltip":
        return component.elements.map((element, index) => {
          const styles = processStyles(element.styles);

          return (
            <div
              key={`${element.selector}-${index}`}
              className="component-demo"
            >
              <h3>Tooltip Variant {index + 1}</h3>
              <p>Selector: {element.selector}</p>
              <div className="tooltip-preview component-object" style={styles}>
                <div className="tooltip-content">Tooltip Content</div>
              </div>
              {renderStylesGrid(element.styles)}
            </div>
          );
        });
      case "radio":
        return component.elements.map((element, index) => {
          const styles = processStyles(element.styles);

          return (
            <div
              key={`${element.selector}-${index}`}
              className="component-demo"
            >
              <h3>Radio Variant {index + 1}</h3>
              <p>Selector: {element.selector}</p>
              <input type="radio" style={styles} className="component-object" />
              {renderStylesGrid(element.styles)}
            </div>
          );
        });
      default:
        return null;
    }
  };

  if (!analysisData || !analysisData.components) {
    return (
      <div className="analysis-viewer">
        <h1>No Analysis Data Available</h1>
        <p>Please run the analysis script to generate data.</p>
      </div>
    );
  }

  return (
    <div className="analysis-viewer">
      <h1>Design System Sniffer</h1>

      <nav className="component-navigation">
        {analysisData.components.map((component) => (
          <a
            key={component.name}
            href={`#${component.name.toLowerCase()}`}
            className="nav-link"
          >
            {component.name}: {component.elements.length} variants
          </a>
        ))}
      </nav>

      {analysisData.components.map((component) => (
        <div
          key={component.name}
          id={component.name.toLowerCase()}
          className="component-section"
        >
          <h2>{component.name}</h2>
          <h3 className="total-unique">
            Total Unique Elements: {component.elements.length}
          </h3>
          <div className="component-demos">{renderComponent(component)}</div>
        </div>
      ))}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top"
          aria-label="Return to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default AnalysisViewer;
