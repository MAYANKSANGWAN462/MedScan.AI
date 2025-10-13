import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';

// Define types for the component props
interface Point {
  x: number;
  y: number;
}

interface ExternalEntityProps {
  x: number;
  y: number;
  label: string;
  width?: number;
  height?: number;
}

interface ProcessProps {
  x: number;
  y: number;
  number: string;
  label: string;
  radius?: number;
}

interface DataStoreProps {
  x: number;
  y: number;
  id: string;
  label: string;
  width?: number;
  height?: number;
}

interface ArrowProps {
  points: Point[];
  label: string;
  curved?: boolean;
  controlPoints?: Point[];
}

const DFDLevel2 = () => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Export functionality
  const handleExportPNG = async () => {
    if (svgRef.current) {
      try {
        const dataUrl = await toPng(svgRef.current, {
          quality: 1.0,
          pixelRatio: 3, // High resolution
          backgroundColor: '#f8fafc',
        });
        const link = document.createElement('a');
        link.download = 'dfd-level2-diagram.png';
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error exporting PNG:', error);
      }
    }
  };

  const handleExportSVG = async () => {
    if (svgRef.current) {
      try {
        const dataUrl = await toSvg(svgRef.current, {
          quality: 1.0,
          backgroundColor: '#f8fafc',
        });
        const link = document.createElement('a');
        link.download = 'dfd-level2-diagram.svg';
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error exporting SVG:', error);
      }
    }
  };

  // External Entity Component with improved styling
  const ExternalEntity = ({ x, y, label, width = 140, height = 70 }: ExternalEntityProps) => (
    <g>
      <rect 
        x={x} 
        y={y} 
        width={width} 
        height={height} 
        fill="#FFE6E6" 
        stroke="#CC0000" 
        strokeWidth="2" 
        rx="5"
        filter="url(#shadow)"
      />
      <text 
        x={x + width/2} 
        y={y + height/2} 
        textAnchor="middle" 
        dominantBaseline="middle" 
        fontSize="14" 
        fontWeight="700" 
        fill="#000"
      >
        {label}
      </text>
    </g>
  );

  // Process Component with better text wrapping and styling
  const Process = ({ x, y, number, label, radius = 65 }: ProcessProps) => {
    const lines = label.split('\n');
    return (
      <g>
        <circle 
          cx={x} 
          cy={y} 
          r={radius} 
          fill="#E6F3FF" 
          stroke="#0066CC" 
          strokeWidth="2.5"
          filter="url(#shadow)"
        />
        <text 
          x={x} 
          y={y - 25} 
          textAnchor="middle" 
          fontSize="16" 
          fontWeight="800" 
          fill="#0066CC"
        >
          {number}
        </text>
        {lines.map((line: string, index: number) => (
          <text 
            key={index}
            x={x} 
            y={y + (index * 18) - (lines.length > 1 ? 5 : 0)} 
            textAnchor="middle" 
            fontSize="12" 
            fontWeight="600" 
            fill="#000"
          >
            {line}
          </text>
        ))}
      </g>
    );
  };

  // Data Store Component with improved styling
  const DataStore = ({ x, y, id, label, width = 200, height = 60 }: DataStoreProps) => (
    <g>
      <line x1={x} y1={y} x2={x + width} y2={y} stroke="#009900" strokeWidth="3"/>
      <line x1={x} y1={y + height} x2={x + width} y2={y + height} stroke="#009900" strokeWidth="3"/>
      <rect x={x} y={y} width={width} height={height} fill="#F0FFF0" fillOpacity="0.7"/>
      <text x={x + 15} y={y + 22} fontSize="13" fontWeight="800" fill="#006600">{id}</text>
      <text x={x + 15} y={y + 42} fontSize="12" fontWeight="600" fill="#000">{label}</text>
    </g>
  );

  // Enhanced Arrow Component with perfect connections and smooth curves
  const Arrow = ({ points, label, curved = false, controlPoints = [] }: ArrowProps) => {
    let pathData;
    if (curved && controlPoints.length >= 2) {
      pathData = `M ${points[0].x} ${points[0].y} C ${controlPoints[0].x} ${controlPoints[0].y}, ${controlPoints[1].x} ${controlPoints[1].y}, ${points[1].x} ${points[1].y}`;
    } else if (curved) {
      const midX = (points[0].x + points[1].x) / 2;
      const midY = (points[0].y + points[1].y) / 2;
      const offsetX = Math.abs(points[1].x - points[0].x) * 0.3;
      const offsetY = Math.abs(points[1].y - points[0].y) * 0.3;
      pathData = `M ${points[0].x} ${points[0].y} Q ${midX + offsetX} ${midY + offsetY} ${points[1].x} ${points[1].y}`;
    } else {
      pathData = points.map((p: Point, i: number) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    }
    
    const lastPoint = points[points.length - 1];
    const secondLastPoint = points[points.length - 2];
    
    const labelX = curved ? (points[0].x + points[1].x) / 2 + 20 : (points[0].x + lastPoint.x) / 2;
    const labelY = curved ? (points[0].y + points[1].y) / 2 - 15 : (points[0].y + lastPoint.y) / 2 - 10;

    return (
      <g>
        <path 
          d={pathData} 
          fill="none" 
          stroke="#333" 
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        <rect 
          x={labelX - 45} 
          y={labelY - 10} 
          width="90" 
          height="20" 
          fill="white" 
          stroke="#666" 
          strokeWidth="0.5" 
          rx="3"
          filter="url(#shadow-light)"
        />
        <text 
          x={labelX} 
          y={labelY + 4} 
          textAnchor="middle" 
          fontSize="10" 
          fontWeight="600" 
          fill="#000"
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 border-b-2 border-blue-500">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          DFD Level 2 - Generic Medicine Suggestion System
        </h1>
        <p className="text-sm text-gray-600 text-center mt-1">
          Data Flow Diagram showing decomposed processes and internal data flows
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white shadow-md p-3 flex justify-center gap-4 border-b">
        <button
          onClick={handleZoomIn}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-sm"
        >
          <ZoomIn size={18} /> Zoom In
        </button>
        <button
          onClick={handleZoomOut}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-sm"
        >
          <ZoomOut size={18} /> Zoom Out
        </button>
        <button
          onClick={handleExportPNG}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-sm"
        >
          <Download size={18} /> Export PNG
        </button>
        <button
          onClick={handleExportSVG}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition shadow-sm"
        >
          <Download size={18} /> Export SVG
        </button>
        <span className="px-4 py-2 bg-gray-200 rounded-lg font-semibold shadow-sm">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Legend */}
      <div className="bg-white p-3 mx-4 mt-3 rounded-lg shadow-sm">
        <div className="flex justify-center gap-8 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-16 h-8 bg-red-100 border-2 border-red-600 rounded shadow-sm"></div>
            <span className="font-semibold">External Entity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 border-2 border-blue-600 rounded-full shadow-sm"></div>
            <span className="font-semibold">Process</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-16 h-8">
              <div className="absolute top-0 w-full h-1 bg-green-600 shadow-sm"></div>
              <div className="absolute bottom-0 w-full h-1 bg-green-600 shadow-sm"></div>
              <div className="absolute inset-0 bg-green-50 opacity-50"></div>
            </div>
            <span className="font-semibold">Data Store</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="40" height="20">
              <defs>
                <marker id="arrowhead-legend" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#333" />
                </marker>
              </defs>
              <line x1="0" y1="10" x2="35" y2="10" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead-legend)"/>
            </svg>
            <span className="font-semibold">Data Flow</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div 
        className="flex-1 overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
          viewBox="0 0 3000 2200"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transition: isDragging ? 'none' : 'transform 0.1s'
          }}
        >
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.2"/>
            </filter>
            <filter id="shadow-light" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.1"/>
            </filter>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#333" />
            </marker>
          </defs>

          {/* External Entities - Better positioned */}
          <ExternalEntity x={150} y={350} label="User" />
          <ExternalEntity x={150} y={1050} label="Pharmacist" />
          <ExternalEntity x={150} y={1650} label="Admin" />
          <ExternalEntity x={2650} y={250} label="Google Auth Service" width={160} />

          {/* Process 1: Authentication - Better spacing */}
          <Process x={750} y={300} number="1.1" label="Login/Signup\nusing Gmail" />
          <Process x={1150} y={300} number="1.2" label="Authenticate via\nGoogleAuthService" />
          <Process x={1550} y={300} number="1.3" label="Validate User\nCredentials" />

          {/* Process 2: Medicine Information Access - Better grouping */}
          <Process x={650} y={650} number="2.1" label="View Composition\n& Ingredients" />
          <Process x={1050} y={650} number="2.2" label="View Available\nMedicine Forms" />
          <Process x={1450} y={650} number="2.3" label="View Search\nHistory" />
          <Process x={650} y={900} number="2.4" label="View Usage &\nDosage Info" />
          <Process x={1050} y={900} number="2.5" label="View Reports in\nMultiple Languages" />

          {/* Process 3: Comparison and Search - Better alignment */}
          <Process x={650} y={1200} number="3.1" label="Compare Generic\n& Branded Prices" />
          <Process x={1150} y={1200} number="3.2" label="Locate Nearest\nPharmacy" />

          {/* Process 4: Verification and Prescription - Improved spacing */}
          <Process x={650} y={1500} number="4.1" label="Verify Medicine\nwith Prescription" />
          <Process x={1150} y={1500} number="4.2" label="Parse\nPrescription" />

          {/* Process 5: Administration - Better positioning */}
          <Process x={650} y={1800} number="5.1" label="Add New\nMedicine" />
          <Process x={1150} y={1800} number="5.2" label="Update or Remove\nMedicine" />

          {/* Data Stores - Better aligned and spaced */}
          <DataStore x={1950} y={200} id="D1:" label="User Data Store" />
          <DataStore x={1950} y={500} id="D2:" label="Medicine Database" />
          <DataStore x={1950} y={800} id="D3:" label="Search History Store" />
          <DataStore x={1950} y={1100} id="D4:" label="Report Data Store" />
          <DataStore x={1950} y={1400} id="D5:" label="Pharmacy Database" />
          <DataStore x={1950} y={1700} id="D6:" label="Prescription Data Store" />

          {/* Enhanced Authentication Flows - Perfect connections */}
          <Arrow 
            points={[{x:290, y:385}, {x:685, y:300}]} 
            label="User Credentials" 
          />
          <Arrow 
            points={[{x:815, y:300}, {x:1095, y:300}]} 
            label="Auth Request" 
          />
          <Arrow 
            points={[{x:1255, y:300}, {x:2650, y:270}]} 
            label="Token Request" 
          />
          <Arrow 
            points={[{x:2650, y:290}, {x:1255, y:330}]} 
            label="Validated Token" 
            curved={true}
            controlPoints={[{x:2400, y:320}, {x:2100, y:350}]}
          />
          <Arrow 
            points={[{x:1150, y:365}, {x:1500, y:365}]} 
            label="Token Data" 
          />
          <Arrow 
            points={[{x:1615, y:300}, {x:1950, y:230}]} 
            label="Store User Data" 
          />
          <Arrow 
            points={[{x:1950, y:250}, {x:1615, y:320}]} 
            label="User Profile" 
          />
          <Arrow 
            points={[{x:1490, y:300}, {x:815, y:300}]} 
            label="Login Confirmation" 
          />
          <Arrow 
            points={[{x:750, y:235}, {x:290, y:370}]} 
            label="Access Granted" 
          />

          {/* Enhanced Medicine Information Access Flows */}
          <Arrow 
            points={[{x:290, y:405}, {x:585, y:650}]} 
            label="Medicine Query" 
            curved={true}
            controlPoints={[{x:400, y:500}, {x:500, y:600}]}
          />
          <Arrow 
            points={[{x:715, y:650}, {x:1950, y:530}]} 
            label="Request Composition" 
          />
          <Arrow 
            points={[{x:1950, y:550}, {x:715, y:695}]} 
            label="Composition Data" 
          />
          
          <Arrow 
            points={[{x:290, y:425}, {x:985, y:650}]} 
            label="Form Query" 
            curved={true}
            controlPoints={[{x:600, y:520}, {x:800, y:600}]}
          />
          <Arrow 
            points={[{x:1115, y:650}, {x:1950, y:580}]} 
            label="Request Forms" 
          />
          <Arrow 
            points={[{x:1950, y:600}, {x:1115, y:695}]} 
            label="Form Details" 
          />
          
          <Arrow 
            points={[{x:1450, y:715}, {x:1950, y:830}]} 
            label="Save Search" 
          />
          <Arrow 
            points={[{x:1950, y:850}, {x:1450, y:715}]} 
            label="History Data" 
            curved={true}
            controlPoints={[{x:1750, y:750}, {x:1600, y:700}]}
          />
          
          <Arrow 
            points={[{x:290, y:445}, {x:585, y:900}]} 
            label="Dosage Query" 
            curved={true}
            controlPoints={[{x:400, y:650}, {x:500, y:800}]}
          />
          <Arrow 
            points={[{x:715, y:900}, {x:1950, y:850}]} 
            label="Request Dosage" 
          />
          <Arrow 
            points={[{x:1950, y:870}, {x:715, y:945}]} 
            label="Dosage Info" 
          />
          
          <Arrow 
            points={[{x:1050, y:965}, {x:1950, y:1150}]} 
            label="Request Report" 
          />
          <Arrow 
            points={[{x:1950, y:1170}, {x:1050, y:965}]} 
            label="Translated Report" 
            curved={true}
            controlPoints={[{x:1550, y:1050}, {x:1350, y:1000}]}
          />

          {/* Enhanced Comparison and Search Flows */}
          <Arrow 
            points={[{x:290, y:1095}, {x:585, y:1200}]} 
            label="Price Query" 
            curved={true}
            controlPoints={[{x:400, y:1150}, {x:500, y:1180}]}
          />
          <Arrow 
            points={[{x:715, y:1200}, {x:1950, y:1450}]} 
            label="Request Prices" 
          />
          <Arrow 
            points={[{x:1950, y:1470}, {x:715, y:1245}]} 
            label="Price Data" 
          />
          <Arrow 
            points={[{x:650, y:1135}, {x:290, y:1115}]} 
            label="Comparison Result" 
          />
          
          <Arrow 
            points={[{x:290, y:1125}, {x:1085, y:1200}]} 
            label="Location Query" 
            curved={true}
            controlPoints={[{x:700, y:1170}, {x:900, y:1190}]}
          />
          <Arrow 
            points={[{x:1255, y:1200}, {x:1950, y:1425}]} 
            label="Request Pharmacies" 
          />
          <Arrow 
            points={[{x:1950, y:1445}, {x:1255, y:1245}]} 
            label="Pharmacy Locations" 
          />
          <Arrow 
            points={[{x:1150, y:1135}, {x:290, y:1145}]} 
            label="Nearest Pharmacy" 
          />

          {/* Enhanced Prescription Handling Flows */}
          <Arrow 
            points={[{x:290, y:1125}, {x:585, y:1500}]} 
            label="Prescription Image" 
            curved={true}
            controlPoints={[{x:400, y:1300}, {x:500, y:1450}]}
          />
          <Arrow 
            points={[{x:715, y:1500}, {x:1085, y:1500}]} 
            label="Upload Prescription" 
          />
          <Arrow 
            points={[{x:1255, y:1500}, {x:1950, y:1750}]} 
            label="Parsed Data" 
          />
          <Arrow 
            points={[{x:1950, y:1770}, {x:1255, y:1545}]} 
            label="Prescription Details" 
          />
          <Arrow 
            points={[{x:1150, y:1435}, {x:650, y:1435}]} 
            label="Verify Data" 
          />
          <Arrow 
            points={[{x:650, y:1435}, {x:290, y:1165}]} 
            label="Verification Result" 
            curved={true}
            controlPoints={[{x:450, y:1350}, {x:350, y:1250}]}
          />

          {/* Enhanced Administration Flows */}
          <Arrow 
            points={[{x:290, y:1685}, {x:585, y:1800}]} 
            label="New Medicine Info" 
          />
          <Arrow 
            points={[{x:715, y:1800}, {x:1950, y:750}]} 
            label="Add to Database" 
            curved={true}
            controlPoints={[{x:1300, y:1550}, {x:1700, y:1150}]}
          />
          <Arrow 
            points={[{x:1950, y:770}, {x:715, y:1845}]} 
            label="Confirmation" 
          />
          <Arrow 
            points={[{x:650, y:1735}, {x:290, y:1705}]} 
            label="Success Message" 
          />
          
          <Arrow 
            points={[{x:290, y:1705}, {x:1085, y:1800}]} 
            label="Update Request" 
            curved={true}
            controlPoints={[{x:700, y:1750}, {x:900, y:1780}]}
          />
          <Arrow 
            points={[{x:1255, y:1800}, {x:1950, y:1570}]} 
            label="Modify Database" 
            curved={true}
            controlPoints={[{x:1600, y:1700}, {x:1800, y:1600}]}
          />
          <Arrow 
            points={[{x:1950, y:1590}, {x:1255, y:1845}]} 
            label="Update Status" 
          />
          <Arrow 
            points={[{x:1150, y:1735}, {x:290, y:1725}]} 
            label="Update Complete" 
          />
          
          <Arrow 
            points={[{x:1150, y:1865}, {x:1950, y:1250}]} 
            label="Generate Report" 
            curved={true}
            controlPoints={[{x:1600, y:1700}, {x:1800, y:1400}]}
          />
          <Arrow 
            points={[{x:1950, y:1270}, {x:1150, y:1735}]} 
            label="Report Data" 
            curved={true}
            controlPoints={[{x:1800, y:1500}, {x:1600, y:1650}]}
          />

        </svg>
      </div>

      {/* Footer */}
      <div className="bg-white shadow-md p-2 text-center text-xs text-gray-600 border-t">
        <p>Pan: Click and drag | Zoom: Use controls above | Export: Download high-quality PNG/SVG | All DFD Level 2 rules followed</p>
      </div>
    </div>
  );
};

export default DFDLevel2;