import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'strict',
});

interface MermaidProps {
  chart: string;
}

export const MermaidRenderer: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

    const renderChart = async () => {
      try {
        setError(null);
        const { svg } = await mermaid.render(id, chart);
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err: any) {
        if (isMounted) {
          setError('Unable to render this diagram. Check the Mermaid syntax.');
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
      const element = document.getElementById(id);
      if (element) element.remove();
    };
  }, [chart]);

  if (error) {
    return (
      <div className="p-3 my-2 border border-red-300 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-md text-sm font-mono">
        {error}
      </div>
    );
  }

  return <div ref={containerRef} className="my-4 flex justify-center overflow-x-auto" />;
};