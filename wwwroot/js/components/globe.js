// Velora 3D Canvas Globe Renderer
// Mapped to Blue-Green-Violet Design System

let globeInterval = null;

function startGlobeRenderer(state) {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear previous animation loop if running
  if (globeInterval) {
    cancelAnimationFrame(globeInterval);
  }

  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const radius = Math.min(width, height) * 0.38;
  const center = { x: width / 2, y: height / 2 };

  // Set city locations
  const cities = [
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, color: '#00e5a3', x: 0, y: 0, z: 0 },
    { name: 'Berlin', lat: 52.52, lng: 13.405, color: '#8a5cf5', x: 0, y: 0, z: 0 },
    { name: 'Mumbai', lat: 19.076, lng: 72.8777, color: '#00b5ff', x: 0, y: 0, z: 0 },
    { name: 'Montreal', lat: 45.5017, lng: -73.5673, color: '#8a5cf5', x: 0, y: 0, z: 0 },
    { name: 'London', lat: 51.5074, lng: -0.1278, color: '#8a5cf5', x: 0, y: 0, z: 0 },
    { name: 'San Francisco', lat: 37.7749, lng: -122.4194, color: '#00b5ff', x: 0, y: 0, z: 0 }
  ];

  // Helper lat/lng to sphere coords
  function latLngToCartesian(lat, lng, r) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return {
      x: -(r * Math.sin(phi) * Math.sin(theta)),
      y: r * Math.cos(phi),
      z: r * Math.sin(phi) * Math.cos(theta)
    };
  }

  // Pre-calculate city spatial coords
  cities.forEach(city => {
    const pt = latLngToCartesian(city.lat, city.lng, radius);
    city.x = pt.x;
    city.y = pt.y;
    city.z = pt.z;
  });

  // Fibonacci lattice dots
  const gridPointsCount = 280;
  const spherePoints = [];
  for (let i = 0; i < gridPointsCount; i++) {
    const y = 1 - (i / (gridPointsCount - 1)) * 2;
    const rAtY = Math.sqrt(1 - y * y);
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const theta = 2 * Math.PI * i / goldenRatio;
    spherePoints.push({
      x: Math.cos(theta) * rAtY * radius,
      y: y * radius,
      z: Math.sin(theta) * rAtY * radius
    });
  }

  // State handles for rotation
  const rotation = { x: 0.5, y: 0 };
  let isDragging = false;
  let startX = 0, startY = 0;

  // Rotation matrices
  function rotateX(pt, angle) {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    return { x: pt.x, y: pt.y * cos - pt.z * sin, z: pt.y * sin + pt.z * cos };
  }
  function rotateY(pt, angle) {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    return { x: pt.x * cos - pt.z * sin, y: pt.y, z: pt.x * sin + pt.z * cos };
  }
  function project(pt) {
    const perspective = 0.8 + (pt.z / radius) * 0.2;
    return { x: center.x + pt.x * perspective, y: center.y - pt.y * perspective, depth: pt.z };
  }

  // Drag interaction attachers
  canvas.onmousedown = (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
  };
  window.onmousemove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    rotation.y += dx * 0.005;
    rotation.x += dy * 0.005;
    rotation.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotation.x));
    startX = e.clientX;
    startY = e.clientY;
  };
  window.onmouseup = () => { isDragging = false; };

  // Touch Support
  canvas.ontouchstart = (e) => {
    if (e.touches.length !== 1) return;
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  };
  canvas.ontouchmove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    rotation.y += dx * 0.005;
    rotation.x += dy * 0.005;
    rotation.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotation.x));
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  };
  canvas.ontouchend = () => { isDragging = false; };

  let pulseTime = 0;

  function drawFrame() {
    if (state.currentView !== 'landing') return; // Pause when not on landing hero

    ctx.clearRect(0, 0, width, height);
    pulseTime += 0.015;

    // Standard slow spin
    if (!isDragging) {
      rotation.y += 0.002;
    }

    // Map spatial nodes
    const rotatedPoints = spherePoints.map(pt => {
      let r = rotateX(pt, rotation.x);
      r = rotateY(r, rotation.y);
      return { r, proj: project(r) };
    });

    const rotatedCities = cities.map(city => {
      let r = rotateX(city, rotation.x);
      r = rotateY(r, rotation.y);
      return { city, proj: project(r) };
    });

    // Draw background aura bulb behind the globe (Blue-Green-Violet theme!)
    const bulbGradient = ctx.createRadialGradient(center.x, center.y, radius * 0.8, center.x, center.y, radius * 1.3);
    bulbGradient.addColorStop(0, 'rgba(0, 181, 255, 0.02)');
    bulbGradient.addColorStop(0.5, 'rgba(138, 92, 245, 0.01)');
    bulbGradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bulbGradient;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Sort grid dots by depth
    rotatedPoints.sort((a, b) => a.proj.depth - b.proj.depth);

    // Draw grid points
    rotatedPoints.forEach(pt => {
      const opacity = Math.max(0.08, (pt.proj.depth + radius) / (2 * radius) * 0.35);
      ctx.fillStyle = `rgba(214, 211, 209, ${opacity})`;
      ctx.beginPath();
      const dotSize = Math.max(0.6, (pt.proj.depth + radius) / (2 * radius) * 1.5);
      ctx.arc(pt.proj.x, pt.proj.y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw connection lines between front cities (Blue-Violet-Green gradients!)
    for (let i = 0; i < rotatedCities.length; i++) {
      const cityA = rotatedCities[i];
      if (cityA.proj.depth < -radius * 0.2) continue;

      for (let j = i + 1; j < rotatedCities.length; j++) {
        const cityB = rotatedCities[j];
        if (cityB.proj.depth < -radius * 0.2) continue;

        ctx.beginPath();
        ctx.moveTo(cityA.proj.x, cityA.proj.y);

        const midX = (cityA.proj.x + cityB.proj.x) / 2;
        const midY = (cityA.proj.y + cityB.proj.y) / 2;
        const dist = Math.hypot(cityA.proj.x - cityB.proj.x, cityA.proj.y - cityB.proj.y);

        const dx = midX - center.x;
        const dy = midY - center.y;
        const len = Math.hypot(dx, dy);
        const pullX = midX + (dx / len) * (dist * 0.15);
        const pullY = midY + (dy / len) * (dist * 0.15);

        ctx.quadraticCurveTo(pullX, pullY, cityB.proj.x, cityB.proj.y);

        const lineGrad = ctx.createLinearGradient(cityA.proj.x, cityA.proj.y, cityB.proj.x, cityB.proj.y);
        const alphaVal = 0.12 + Math.sin(pulseTime + i + j) * 0.08;
        lineGrad.addColorStop(0, `rgba(0, 229, 163, ${alphaVal})`);     // Mint green
        lineGrad.addColorStop(0.5, `rgba(0, 181, 255, ${alphaVal * 1.5})`); // Electric Blue
        lineGrad.addColorStop(1, `rgba(138, 92, 245, ${alphaVal})`);     // Violet
        
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }

    // Draw City nodes
    rotatedCities.forEach(({ city, proj }) => {
      if (proj.depth < -radius * 0.3) return;

      const scale = Math.max(0.2, (proj.depth + radius) / (2 * radius));
      
      // Pulse ring
      const pulseSize = (1 + Math.sin(pulseTime * 2.5 + city.lat)) * 5 + 4;
      ctx.fillStyle = `${city.color}15`;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, pulseSize * scale, 0, Math.PI * 2);
      ctx.fill();

      // Core point
      ctx.fillStyle = city.color;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 4 * scale, 0, Math.PI * 2);
      ctx.fill();

      // City Text label
      if (proj.depth > radius * 0.1) {
        ctx.fillStyle = 'rgba(244, 243, 240, 0.85)';
        ctx.font = '500 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(city.name, proj.x, proj.y - 10);
      }
    });

    globeInterval = requestAnimationFrame(drawFrame);
  }

  // Handle Resize events
  const resizeHandler = () => {
    if (!canvas) return;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  };
  window.addEventListener('resize', resizeHandler);

  drawFrame();
}
