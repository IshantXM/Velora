'use client';

import React, { useRef, useEffect, useState } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface CityNode {
  name: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
  z: number;
  color: string;
}

export const CanvasGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef({ x: 0.5, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const cities: CityNode[] = [
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, color: '#eab308', x: 0, y: 0, z: 0 },
    { name: 'Berlin', lat: 52.52, lng: 13.405, color: '#f59e0b', x: 0, y: 0, z: 0 },
    { name: 'Mumbai', lat: 19.076, lng: 72.8777, color: '#d97706', x: 0, y: 0, z: 0 },
    { name: 'Montreal', lat: 45.5017, lng: -73.5673, color: '#eab308', x: 0, y: 0, z: 0 },
    { name: 'London', lat: 51.5074, lng: -0.1278, color: '#f59e0b', x: 0, y: 0, z: 0 },
    { name: 'San Francisco', lat: 37.7749, lng: -122.4194, color: '#d97706', x: 0, y: 0, z: 0 }
  ];

  // Convert lat/lng to 3D Cartesian coordinates on a sphere of radius R
  const latLngToCartesian = (lat: number, lng: number, radius: number): Point3D => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    return {
      x: -(radius * Math.sin(phi) * Math.sin(theta)),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.cos(theta)
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    
    // Scale for high PPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const radius = Math.min(width, height) * 0.38;
    const center = { x: width / 2, y: height / 2 };

    // Generate grid points on a sphere (Fibonacci lattice)
    const gridPointsCount = 280;
    const spherePoints: Point3D[] = [];
    for (let i = 0; i < gridPointsCount; i++) {
      const y = 1 - (i / (gridPointsCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y

      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      const theta = 2 * Math.PI * i / goldenRatio;

      spherePoints.push({
        x: Math.cos(theta) * radiusAtY * radius,
        y: y * radius,
        z: Math.sin(theta) * radiusAtY * radius
      });
    }

    // Initialize cities coordinates
    cities.forEach(city => {
      const coords = latLngToCartesian(city.lat, city.lng, radius);
      city.x = coords.x;
      city.y = coords.y;
      city.z = coords.z;
    });

    const rotateX = (point: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: point.x,
        y: point.y * cos - point.z * sin,
        z: point.y * sin + point.z * cos
      };
    };

    const rotateY = (point: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: point.x * cos - point.z * sin,
        y: point.y,
        z: point.x * sin + point.z * cos
      };
    };

    const project = (point: Point3D) => {
      // Perspective division factor based on Z depth
      const perspective = 0.8 + (point.z / radius) * 0.2;
      return {
        x: center.x + point.x * perspective,
        y: center.y - point.y * perspective,
        depth: point.z
      };
    };

    let pulseTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      pulseTime += 0.015;

      // Slow rotation over time if not dragging
      if (!isDraggingRef.current) {
        rotationRef.current.y += 0.002;
      }

      // Rotate and project points
      const rotatedPoints = spherePoints.map(p => {
        let r = rotateX(p, rotationRef.current.x);
        r = rotateY(r, rotationRef.current.y);
        return { original: p, rotated: r, projected: project(r) };
      });

      // Rotate and project city nodes
      const rotatedCities = cities.map(city => {
        let r = rotateX({ x: city.x, y: city.y, z: city.z }, rotationRef.current.x);
        r = rotateY(r, rotationRef.current.y);
        return { city, rotated: r, projected: project(r) };
      });

      // Sort by depth so items in background are drawn first
      rotatedPoints.sort((a, b) => a.projected.depth - b.projected.depth);

      // Draw background atmosphere glow
      const atmosphereGlow = ctx.createRadialGradient(center.x, center.y, radius * 0.8, center.x, center.y, radius * 1.25);
      atmosphereGlow.addColorStop(0, 'rgba(217, 119, 6, 0.02)');
      atmosphereGlow.addColorStop(0.5, 'rgba(234, 179, 8, 0.01)');
      atmosphereGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = atmosphereGlow;
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Draw globe grid dots
      rotatedPoints.forEach(p => {
        const depth = p.projected.depth;
        const opacity = Math.max(0.08, (depth + radius) / (2 * radius) * 0.35);
        ctx.fillStyle = `rgba(214, 211, 209, ${opacity})`;
        ctx.beginPath();
        // Dot size depends on depth (front is larger)
        const size = Math.max(0.6, (depth + radius) / (2 * radius) * 1.5);
        ctx.arc(p.projected.x, p.projected.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw active connection curves (only for cities that are both visible in front)
      for (let i = 0; i < rotatedCities.length; i++) {
        const cityA = rotatedCities[i];
        if (cityA.projected.depth < -radius * 0.2) continue; // Skip if in far background

        for (let j = i + 1; j < rotatedCities.length; j++) {
          const cityB = rotatedCities[j];
          if (cityB.projected.depth < -radius * 0.2) continue;

          // Drawing curved line connecting A and B
          ctx.beginPath();
          ctx.moveTo(cityA.projected.x, cityA.projected.y);

          // Control point pulled toward center to create a curved arc
          const midX = (cityA.projected.x + cityB.projected.x) / 2;
          const midY = (cityA.projected.y + cityB.projected.y) / 2;
          const dist = Math.hypot(cityA.projected.x - cityB.projected.x, cityA.projected.y - cityB.projected.y);
          
          // Pull arc outward slightly
          const dx = midX - center.x;
          const dy = midY - center.y;
          const len = Math.hypot(dx, dy);
          const pullX = midX + (dx / len) * (dist * 0.15);
          const pullY = midY + (dy / len) * (dist * 0.15);

          ctx.quadraticCurveTo(pullX, pullY, cityB.projected.x, cityB.projected.y);
          
          // Gradient arc line
          const arcGradient = ctx.createLinearGradient(
            cityA.projected.x, cityA.projected.y,
            cityB.projected.x, cityB.projected.y
          );
          const pulseAlpha = 0.12 + Math.sin(pulseTime + i + j) * 0.08;
          arcGradient.addColorStop(0, `rgba(234, 179, 8, ${pulseAlpha})`);
          arcGradient.addColorStop(0.5, `rgba(245, 158, 11, ${pulseAlpha * 1.5})`);
          arcGradient.addColorStop(1, `rgba(217, 119, 6, ${pulseAlpha})`);
          
          ctx.strokeStyle = arcGradient;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // Draw city nodes
      rotatedCities.forEach(({ city, projected }) => {
        const depth = projected.depth;
        // Nodes in the back are faded
        const opacity = Math.max(0.1, (depth + radius) / (2 * radius));
        if (opacity < 0.2) return;

        // Draw pulsing outer halo
        const pulseSize = (1 + Math.sin(pulseTime * 2.5 + city.lat)) * 5 + 4;
        ctx.fillStyle = `${city.color}15`;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw core node
        ctx.fillStyle = city.color;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Label for city names when visible in front
        if (depth > radius * 0.1) {
          ctx.fillStyle = 'rgba(244, 243, 240, 0.85)';
          ctx.font = '500 10px var(--font-sans)';
          ctx.textAlign = 'center';
          ctx.fillText(city.name, projected.x, projected.y - 10);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Responsive canvas resizing
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    rotationRef.current.y += dx * 0.005;
    rotationRef.current.x += dy * 0.005;

    // Cap vertical rotation to avoid flipping upside down
    rotationRef.current.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotationRef.current.x));

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch Support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;

    rotationRef.current.y += dx * 0.005;
    rotationRef.current.x += dy * 0.005;
    rotationRef.current.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotationRef.current.x));

    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing opacity-90"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      />
    </div>
  );
};
