import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import '../styles/product.css';

const PRESET_PRIMARY_COLORS = [
  { name: 'Obsidian Black', value: '#0a0a0f' },
  { name: 'Neon Purple', value: '#a855f7' },
  { name: 'Electric Cyan', value: '#06b6d4' },
  { name: 'Cyber Pink', value: '#ec4899' },
  { name: 'Acid Green', value: '#84cc16' }
];

const PRESET_ACCENT_COLORS = [
  { name: 'Sunset Gold', value: '#eab308' },
  { name: 'Ice White', value: '#ffffff' },
  { name: 'Quantum Purple', value: '#7c3aed' },
  { name: 'Neon Cyan', value: '#06b6d4' },
  { name: 'Magma Red', value: '#ef4444' }
];

const TEXTURES = [
  { id: 'matte', name: 'Premium Matte' },
  { id: 'carbon', name: 'Carbon Fiber' },
  { id: 'holo', name: 'Holographic Glow' },
  { id: 'metal', name: 'Metallic Chrome' }
];

const AuraMatch = () => {
  const dispatch = useDispatch();

  // Customizer State
  const [category, setCategory] = useState('hoodie'); // hoodie, sneakers, watch
  const [primaryColor, setPrimaryColor] = useState('#a855f7');
  const [accentColor, setAccentColor] = useState('#06b6d4');
  const [texture, setTexture] = useState('matte');
  const [decalText, setDecalText] = useState('AURA');

  // Size calculator state
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [fitPref, setFitPref] = useState('regular');
  const [calculatedSize, setCalculatedSize] = useState('M');
  const [comfortScore, setComfortScore] = useState(95);

  // Recommendations state
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // Calculate size whenever height, weight, or fit preference changes
  useEffect(() => {
    let baseVal = height + weight;
    let size = 'M';
    if (baseVal < 210) size = 'S';
    else if (baseVal >= 210 && baseVal < 240) size = 'M';
    else if (baseVal >= 240 && baseVal < 265) size = 'L';
    else if (baseVal >= 265 && baseVal < 290) size = 'XL';
    else size = 'XXL';

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    let idx = sizes.indexOf(size);
    if (fitPref === 'slim' && idx > 0) idx--;
    if (fitPref === 'oversized' && idx < sizes.length - 1) idx++;
    const finalSize = sizes[idx];

    const bmi = weight / ((height / 100) ** 2);
    let dev = Math.abs(bmi - 21.7);
    let score = Math.max(72, Math.round(99 - dev * 1.8));

    setCalculatedSize(finalSize);
    setComfortScore(score);
  }, [height, weight, fitPref]);

  // Load recommended products
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setRecommendedProducts(data.slice(0, 3));
        } else {
          setRecommendedProducts([
            { _id: 'rec1', name: 'Aura Premium Tee', price: 999, imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300' },
            { _id: 'rec2', name: 'Quantum Joggers', price: 1499, imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=300' }
          ]);
        }
      } catch (err) {
        setRecommendedProducts([
          { _id: 'rec1', name: 'Aura Premium Tee', price: 999, imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300' },
          { _id: 'rec2', name: 'Quantum Joggers', price: 1499, imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=300' }
        ]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchRecommendations();
  }, []);

  // Generate customized product preview SVG code
  const getSvgContent = (forCart = false) => {
    const primaryFill = texture === 'holo' ? 'url(#holoGrad)' : (texture === 'metal' ? 'url(#metalGrad)' : primaryColor);
    const textureOverlay = texture === 'carbon' ? 'url(#carbonPat)' : 'none';

    let previewElements = null;

    if (category === 'hoodie') {
      previewElements = (
        <>
          <path d="M 35,26 C 30,10 70,10 65,26 Z" fill={accentColor} opacity="0.8" />
          <path d="M 30,30 L 40,30 L 45,20 L 55,20 L 60,30 L 70,30 L 75,55 L 70,55 L 68,45 L 68,85 L 32,85 L 32,45 L 30,55 Z" fill={primaryFill} />
          {textureOverlay !== 'none' && (
            <path d="M 30,30 L 40,30 L 45,20 L 55,20 L 60,30 L 70,30 L 75,55 L 70,55 L 68,45 L 68,85 L 32,85 L 32,45 L 30,55 Z" fill={textureOverlay} opacity="0.3" />
          )}
          <path d="M 30,30 L 18,52 L 23,55 L 32,42 Z" fill={primaryFill} />
          <path d="M 70,30 L 82,52 L 77,55 L 68,42 Z" fill={primaryFill} />
          <path d="M 43,26 C 43,18 57,18 57,26 Z" fill={accentColor} />
          <path d="M 40,65 L 60,65 L 57,78 L 43,78 Z" fill={accentColor} opacity="0.9" />
          <line x1="47" y1="28" x2="47" y2="42" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
          <line x1="53" y1="28" x2="53" y2="40" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
          {decalText && (
            <text x="65" y="53" fill="#ffffff" fontSize="5.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5" fontFamily="Outfit, sans-serif" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))">
              {decalText.toUpperCase()}
            </text>
          )}
        </>
      );
    } else if (category === 'sneakers') {
      previewElements = (
        <>
          <path d="M 12,58 L 118,58 C 118,63 110,65 105,65 L 15,65 C 10,65 12,58 12,58 Z" fill={accentColor} />
          <path d="M 15,42 C 20,22 58,22 78,35 L 108,44 C 113,45 116,51 116,58 L 14,58 Z" fill={primaryFill} />
          {textureOverlay !== 'none' && (
            <path d="M 15,42 C 20,22 58,22 78,35 L 108,44 C 113,45 116,51 116,58 L 14,58 Z" fill={textureOverlay} opacity="0.3" />
          )}
          <path d="M 45,34 C 55,34 65,48 70,58 L 58,58 Z" fill={accentColor} opacity="0.95" />
          <path d="M 68,30 L 73,38 M 72,28 L 77,36 M 76,26 L 81,34" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
          {decalText && (
            <text x="45" y="52" fill="#ffffff" fontSize="4.5" fontWeight="800" textAnchor="middle" fontFamily="Outfit, sans-serif">
              {decalText.toUpperCase()}
            </text>
          )}
        </>
      );
    } else {
      previewElements = (
        <>
          <path d="M 42,10 L 58,10 L 58,90 L 42,90 Z" fill={primaryFill} />
          {textureOverlay !== 'none' && (
            <path d="M 42,10 L 58,10 L 58,90 L 42,90 Z" fill={textureOverlay} opacity="0.35" />
          )}
          <rect x="41" y="20" width="18" height="4" fill={accentColor} rx="1" />
          <rect x="41" y="76" width="18" height="4" fill={accentColor} rx="1" />
          <rect x="28" y="28" width="44" height="44" rx="12" fill={accentColor} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <rect x="33" y="33" width="34" height="34" rx="8" fill="#0c0b15" />
          <text x="50" y="47" fill={primaryColor} fontSize="7" fontWeight="800" textAnchor="middle" fontFamily="Outfit, sans-serif">10:42</text>
          <circle cx="50" cy="50" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="14" fill="none" stroke={accentColor} strokeWidth="1.5" strokeDasharray="60, 20" />
          {decalText && (
            <text x="50" y="60" fill="var(--text-secondary)" fontSize="4" fontWeight="600" textAnchor="middle" fontFamily="Outfit, sans-serif">
              {decalText.toUpperCase()}
            </text>
          )}
        </>
      );
    }

    return (
      <svg id="aura-customizer-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 100" width="100%" height={forCart ? "80" : "100%"} style={{ background: 'transparent' }}>
        <defs>
          <linearGradient id="holoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="30%" stopColor="#06b6d4" />
            <stop offset="60%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="25%" stopColor="#d1d5db" />
            <stop offset="50%" stopColor="#9ca3af" />
            <stop offset="75%" stopColor="#f3f4f6" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>

          <pattern id="carbonPat" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#18181b" />
            <path d="M 0,0 L 3,3 M 3,3 L 6,0 M 3,6 L 6,3" stroke="#27272a" strokeWidth="1.2" />
          </pattern>

          <filter id="auraGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle cx="65" cy="50" r="38" fill="none" stroke="rgba(168, 85, 247, 0.12)" strokeWidth="0.5" />
        <circle cx="65" cy="50" r="32" fill="none" stroke="url(#holoGrad)" strokeWidth="1.5" opacity="0.35" filter="url(#auraGlow)" />

        {previewElements}
      </svg>
    );
  };

  const handleAddToCart = () => {
    const serializer = new XMLSerializer();
    const svgElement = document.getElementById('aura-customizer-svg');
    if (!svgElement) return;
    const svgString = serializer.serializeToString(svgElement);
    const base64Image = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));

    const selectedTex = TEXTURES.find(t => t.id === texture)?.name || texture;
    const customItemName = `Custom Aura ${category.charAt(0).toUpperCase() + category.slice(1)} (${calculatedSize})`;

    dispatch(addToCart({
      productId: `custom-${category}-${Date.now()}`,
      name: customItemName,
      price: category === 'watch' ? 3499 : (category === 'sneakers' ? 2999 : 2499),
      imageUrl: base64Image,
      qty: 1,
      customMeta: {
        primaryColor,
        accentColor,
        texture: selectedTex,
        decal: decalText,
        size: calculatedSize
      }
    }));

    alert(`${customItemName} added successfully to your shopping cart!`);
  };

  const getWeightUnitLabel = () => `${weight} kg`;
  const getHeightUnitLabel = () => `${height} cm`;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '10px 20px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>AuraMatch AI: Custom Style Lab</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Design bespoke apparel custom-tailored to your style and size fitment.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '40px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN - VISUAL PREVIEW SCREEN */}
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '520px', justifyContent: 'space-between', position: 'sticky', top: '100px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '12px' }}>
            <button 
              onClick={() => setCategory('hoodie')} 
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: category === 'hoodie' ? 'var(--accent-purple)' : 'transparent', color: '#fff', fontWeight: '600', transition: 'var(--transition-smooth)' }}
            >
              👕 Hoodie
            </button>
            <button 
              onClick={() => setCategory('sneakers')} 
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: category === 'sneakers' ? 'var(--accent-purple)' : 'transparent', color: '#fff', fontWeight: '600', transition: 'var(--transition-smooth)' }}
            >
              👟 Sneakers
            </button>
            <button 
              onClick={() => setCategory('watch')} 
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: category === 'watch' ? 'var(--accent-purple)' : 'transparent', color: '#fff', fontWeight: '600', transition: 'var(--transition-smooth)' }}
            >
              ⌚ Smartwatch
            </button>
          </div>

          {/* SVG Canvas Holder */}
          <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(0,0,0,0.15)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
            <div id="aura-customizer-svg-container" style={{ width: '100%', maxWidth: '340px', height: '280px' }}>
              <div style={{ display: 'none' }}></div>
              {getSvgContent()}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <div>Texture: <span style={{ color: '#fff', fontWeight: '600' }}>{TEXTURES.find(t => t.id === texture)?.name}</span></div>
            <div>Decal: <span style={{ color: '#fff', fontWeight: '600' }}>"{decalText || 'None'}"</span></div>
            <div>Bespoke Price: <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>₹{category === 'watch' ? '3,499' : (category === 'sneakers' ? '2,999' : '2,499')}</span></div>
          </div>
        </div>

        {/* RIGHT COLUMN - CONTROLS & FIT MATRIX */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', fontSize: '1.3rem' }}>1. Style Configuration</h3>
            
            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Primary Palette Color</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {PRESET_PRIMARY_COLORS.map(c => (
                  <button 
                    key={c.value} 
                    onClick={() => setPrimaryColor(c.value)} 
                    title={c.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: primaryColor === c.value ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)', background: c.value, cursor: 'pointer', outline: 'none', transition: 'transform 0.2s', transform: primaryColor === c.value ? 'scale(1.15)' : 'none' }}
                  />
                ))}
                <div style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <input 
                    type="color" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)} 
                    style={{ position: 'absolute', top: '-6px', left: '-6px', width: '44px', height: '44px', cursor: 'pointer', border: 'none' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Accent Highlights Color</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {PRESET_ACCENT_COLORS.map(c => (
                  <button 
                    key={c.value} 
                    onClick={() => setAccentColor(c.value)} 
                    title={c.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: accentColor === c.value ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)', background: c.value, cursor: 'pointer', outline: 'none', transition: 'transform 0.2s', transform: accentColor === c.value ? 'scale(1.15)' : 'none' }}
                  />
                ))}
                <div style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <input 
                    type="color" 
                    value={accentColor} 
                    onChange={(e) => setAccentColor(e.target.value)} 
                    style={{ position: 'absolute', top: '-6px', left: '-6px', width: '44px', height: '44px', cursor: 'pointer', border: 'none' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '25px' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Material Finish & Texture</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {TEXTURES.map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setTexture(t.id)}
                    style={{ padding: '12px', borderRadius: '10px', background: texture === t.id ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.02)', border: texture === t.id ? '1px solid var(--accent-purple)' : '1px solid var(--glass-border)', color: '#fff', fontWeight: '500', cursor: 'pointer', textAlign: 'center', transition: 'var(--transition-smooth)' }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '25px' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Bespoke Brand Decal / Lettering</label>
              <input 
                type="text" 
                maxLength="8"
                value={decalText} 
                onChange={(e) => setDecalText(e.target.value)} 
                placeholder="Enter logo lettering (Max 8 letters)" 
                style={{ letterSpacing: '2px', fontWeight: '600' }}
              />
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', fontSize: '1.3rem' }}>2. AuraMatch Fit & Size Index</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '30px', marginTop: '20px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Height</span>
                    <span style={{ color: '#fff', fontWeight: '600' }}>{getHeightUnitLabel()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="140" 
                    max="210" 
                    value={height} 
                    onChange={(e) => setHeight(Number(e.target.value))} 
                    style={{ width: '100%', accentColor: 'var(--accent-cyan)' }} 
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Weight</span>
                    <span style={{ color: '#fff', fontWeight: '600' }}>{getWeightUnitLabel()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="40" 
                    max="130" 
                    value={weight} 
                    onChange={(e) => setWeight(Number(e.target.value))} 
                    style={{ width: '100%', accentColor: 'var(--accent-cyan)' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Cut/Fit Preference</label>
                  <select 
                    value={fitPref} 
                    onChange={(e) => setFitPref(e.target.value)}
                    style={{ padding: '10px 14px' }}
                  >
                    <option value="slim">Slim Athletic Fit</option>
                    <option value="regular">Regular Classic Fit</option>
                    <option value="oversized">Oversized Streetwear Fit</option>
                  </select>
                </div>
              </div>

              {/* Gauge Display */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.1)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.01)' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="url(#holoGrad)" 
                      strokeWidth="8" 
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - comfortScore / 100)}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff', lineHeight: 1 }}>{calculatedSize}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Size</span>
                  </div>
                </div>
                <div style={{ marginTop: '12px', fontSize: '0.85rem', textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>Comfort Index</div>
                  <div style={{ color: 'var(--accent-cyan)', fontWeight: '800', fontSize: '1rem', textShadow: '0 0 10px var(--accent-cyan-glow)' }}>{comfortScore}% Match</div>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="btn" 
            style={{ width: '100%', padding: '18px', borderRadius: '14px', fontSize: '1.1rem', letterSpacing: '0.8px', boxShadow: '0 8px 30px rgba(168, 85, 247, 0.45)' }}
          >
            🛒 Add Bespoke Combo to Cart
          </button>
        </div>
      </div>

      {/* Recommended Items Section */}
      <div style={{ marginTop: '70px', borderTop: '1px solid var(--glass-border)', paddingTop: '40px' }}>
        <h3 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Complete Your Aura Vibe</h3>
        {loadingProducts ? (
          <div>Analyzing catalog...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px' }}>
            {recommendedProducts.map((p) => (
              <div key={p._id} className="glass-panel" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px' }} />
                <h4 style={{ fontSize: '1rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>₹{p.price}</span>
                  <button 
                    onClick={() => {
                      dispatch(addToCart({ productId: p._id, name: p.name, price: p.price, imageUrl: p.imageUrl, qty: 1 }));
                      alert(`${p.name} added to cart!`);
                    }} 
                    className="btn btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px' }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuraMatch;
