/* ============================================
   KingKiosk Marketing Website - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initNavigation();
    initActiveSection();
    initCounters();
    initFeatureTabs();
    initMockClock();
    initDocSearch();
});

/* === Scroll Reveal === */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animations for elements within the same section
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Add stagger delays to grouped elements
    document.querySelectorAll('.problem-grid .reveal, .platform-grid .reveal, .widget-grid .reveal, .server-features .reveal, .security-grid .reveal').forEach((el, i) => {
        el.dataset.delay = (i % 4) * 80;
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* === Navigation === */
function initNavigation() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        nav.classList.toggle('scrolled', scrollY > 50);
        lastScroll = scrollY;
    }, { passive: true });

    // Mobile toggle
    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
        toggle.classList.toggle('active');
    });

    // Close mobile menu on link click
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

/* === Active Section Tracking === */
function initActiveSection() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = [];

    // Build a map of nav links to their target sections
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const section = document.querySelector(href);
            if (section) {
                sections.push({ id: href.slice(1), el: section, link });
            }
        }
    });

    if (sections.length === 0) return;

    // Use IntersectionObserver with a rootMargin that considers the nav height.
    // A section is "active" when its top crosses into the upper portion of the viewport.
    // We track which sections are currently visible and pick the topmost one.
    const visibleSections = new Set();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            if (entry.isIntersecting) {
                visibleSections.add(id);
            } else {
                visibleSections.delete(id);
            }
        });

        // Of all visible sections, pick the one closest to the top of the viewport
        let activeId = null;
        let bestTop = Infinity;

        visibleSections.forEach(id => {
            const section = sections.find(s => s.id === id);
            if (section) {
                const rect = section.el.getBoundingClientRect();
                // Prefer the section whose top is closest to (but above) the viewport center
                const distance = Math.abs(rect.top);
                if (distance < bestTop) {
                    bestTop = distance;
                    activeId = id;
                }
            }
        });

        // Update nav links
        navLinks.forEach(link => link.classList.remove('active'));
        if (activeId) {
            const match = sections.find(s => s.id === activeId);
            if (match) match.link.classList.add('active');
        }
    }, {
        // Trigger when a section enters/leaves the top 30% of the viewport
        rootMargin: '-80px 0px -65% 0px',
        threshold: 0
    });

    sections.forEach(s => observer.observe(s.el));
}

/* === Counter Animation === */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

/* === Feature Tabs === */
function initFeatureTabs() {
    const tabs = document.querySelectorAll('.feature-tab');
    const panels = document.querySelectorAll('.feature-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = `panel-${tab.dataset.tab}`;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            panels.forEach(p => {
                p.classList.remove('active');
                if (p.id === targetId) {
                    p.classList.add('active');
                    // Re-trigger animations for tile boxes
                    p.querySelectorAll('.tile-box').forEach((tile, i) => {
                        tile.style.opacity = '0';
                        tile.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            tile.style.transition = 'all 0.4s ease';
                            tile.style.opacity = '1';
                            tile.style.transform = 'scale(1)';
                        }, i * 80);
                    });
                }
            });
        });
    });
}

/* === Mock Clock === */
function initMockClock() {
    const clockEl = document.getElementById('mockTime');
    if (!clockEl) return;

    function updateClock() {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes().toString().padStart(2, '0');
        const h12 = h % 12 || 12;
        clockEl.textContent = `${h12}:${m}`;
    }

    updateClock();
    setInterval(updateClock, 30000);
}

/* === Documentation Search === */
function initDocSearch() {
    const input = document.getElementById('docSearchInput');
    const results = document.getElementById('docSearchResults');
    const kbd = document.getElementById('docSearchKbd');
    if (!input || !results) return;

    // Search index — each entry: { title, description, section, url, tags }
    const index = [
        // -- User Guide --
        { title: 'Getting Started', desc: 'Install KingKiosk, connect to MQTT, and display your first widget.', section: 'User Guide', url: 'https://ajarsm.github.io/kingkiosk/docs/KINGKIOSK_USER_GUIDE.html', tags: 'install setup start begin first configure connection' },
        { title: 'Multi-Window System', desc: 'Floating and tiled window modes, drag/resize, z-index layering.', section: 'User Guide', url: 'https://ajarsm.github.io/kingkiosk/docs/KINGKIOSK_USER_GUIDE.html', tags: 'windows tiling floating layout grid split resize drag drop multi' },
        { title: 'Screen Presets', desc: 'Save, name, and recall entire window layouts with one command.', section: 'User Guide', url: 'https://ajarsm.github.io/kingkiosk/docs/KINGKIOSK_USER_GUIDE.html', tags: 'presets save layout recall snapshot restore screen state morning night' },
        { title: 'Scheduling', desc: 'Automatically switch screen presets by time of day and day of week.', section: 'User Guide', url: 'https://ajarsm.github.io/kingkiosk/docs/KINGKIOSK_USER_GUIDE.html', tags: 'schedule timer time day week automatic cron' },
        { title: 'Kiosk Mode', desc: 'Lock down the display: disable navigation, hide status bar, auto-restart.', section: 'User Guide', url: 'https://ajarsm.github.io/kingkiosk/docs/KINGKIOSK_USER_GUIDE.html', tags: 'kiosk lockdown lock device admin guided access fullscreen' },
        { title: 'Platform Setup — Android', desc: 'Device Owner mode, kiosk lockdown, foreground media service.', section: 'User Guide', url: 'https://ajarsm.github.io/kingkiosk/docs/KINGKIOSK_USER_GUIDE.html', tags: 'android tablet phone samsung fire' },
        { title: 'Platform Setup — iOS / iPadOS', desc: 'Guided Access, WidgetKit home screen widgets, permissions.', section: 'User Guide', url: 'https://ajarsm.github.io/kingkiosk/docs/KINGKIOSK_USER_GUIDE.html', tags: 'ios ipad iphone apple widgetkit guided access' },
        { title: 'Platform Setup — Apple TV', desc: 'Native tvOS app with Siri Remote, Remote Browser for full web.', section: 'User Guide', url: 'https://ajarsm.github.io/kingkiosk/docs/KINGKIOSK_USER_GUIDE.html', tags: 'apple tv tvos siri remote television big screen' },
        { title: 'Platform Setup — Windows', desc: 'MSIX packaging, two-tier kiosk lockdown, InAppWebView.', section: 'User Guide', url: 'https://ajarsm.github.io/kingkiosk/docs/KINGKIOSK_USER_GUIDE.html', tags: 'windows pc desktop msix' },
        { title: 'Platform Setup — macOS', desc: 'Fullscreen kiosk, dock hiding, accessibility permissions.', section: 'User Guide', url: 'https://ajarsm.github.io/kingkiosk/docs/KINGKIOSK_USER_GUIDE.html', tags: 'macos mac desktop osx' },
        { title: 'Platform Setup — Linux', desc: 'Raspberry Pi, Snap, Flatpak, dedicated display hardware.', section: 'User Guide', url: 'https://ajarsm.github.io/kingkiosk/docs/KINGKIOSK_USER_GUIDE.html', tags: 'linux raspberry pi ubuntu snap flatpak embedded' },
        { title: 'Home Assistant Integration', desc: 'Auto-discovery, sensor entities, camera entity, Alarmo panel.', section: 'User Guide', url: 'https://ajarsm.github.io/kingkiosk/docs/KINGKIOSK_USER_GUIDE.html', tags: 'home assistant ha discovery sensors camera alarmo automation' },
        { title: 'MQTT Connection Settings', desc: 'Configure broker host, port, username, password, TLS.', section: 'User Guide', url: 'https://ajarsm.github.io/kingkiosk/docs/KINGKIOSK_USER_GUIDE.html', tags: 'mqtt broker host port username password tls connect settings' },

        // -- MQTT Reference --
        { title: 'Topic Structure', desc: 'kingkiosk/{device_id}/system/cmd, element/{id}/cmd, status, sensors.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'topic structure device id system element cmd status sensors publish subscribe' },
        { title: 'Command Envelope Format', desc: 'JSON envelope with command, payload, timestamp, and HMAC signature.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'envelope json format command payload timestamp signature hmac sha256' },
        { title: 'add_window', desc: 'Add a new widget window: type, url, position, size, config.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'add_window add window create widget new tile type' },
        { title: 'remove_window', desc: 'Remove a window by ID.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'remove_window remove delete close window tile' },
        { title: 'arrange_windows', desc: 'Set layout mode: grid, columns, rows, floating.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'arrange_windows arrange layout grid columns rows mode tiling' },
        { title: 'set_brightness', desc: 'Control screen brightness (0.0–1.0).', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'set_brightness brightness screen dim display' },
        { title: 'set_volume', desc: 'Set audio volume (0.0–1.0).', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'set_volume volume audio sound mute' },
        { title: 'tts (Text-to-Speech)', desc: 'Speak text aloud with configurable voice and language.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'tts text to speech speak voice language piper' },
        { title: 'navigate', desc: 'Navigate the app to a specific route or screen.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'navigate route screen page go' },
        { title: 'screenshot', desc: 'Capture a screenshot and publish it as a camera entity.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'screenshot capture image camera' },
        { title: 'restart / refresh', desc: 'Restart the app or refresh the current view.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'restart refresh reload reboot' },
        { title: 'notification', desc: 'Display an on-screen notification with title and body.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'notification alert toast message popup' },
        { title: 'save_screen_state', desc: 'Save the current layout as a named preset.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'save_screen_state save preset layout snapshot' },
        { title: 'load_screen_state', desc: 'Load and apply a saved screen preset by name.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'load_screen_state load preset apply restore layout' },
        { title: 'set_schedule', desc: 'Configure time-based schedule entries for automatic preset switching.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'set_schedule schedule time automatic preset cron timer' },

        // -- Widget-Specific MQTT Commands --
        { title: 'WebView Commands', desc: 'navigate, refresh, execute_js, zoom, back, forward.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'webview web browser navigate url refresh javascript execute js' },
        { title: 'Media Player Commands', desc: 'play, pause, stop, seek, set_source, set_volume.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'media player play pause stop seek source volume video audio' },
        { title: 'Carousel Commands', desc: 'next, previous, go_to, set_interval, set_images.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'carousel slideshow next previous images interval slides rotate' },
        { title: 'Gauge Commands', desc: 'set_value, set_config, set_range with min/max.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'gauge radial linear semicircle value range min max' },
        { title: 'Chart Commands', desc: 'set_data, add_point, set_config for line, bar, pie charts.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'chart line bar pie graph data point series' },
        { title: 'Camera Widget', desc: 'RTSP, WebRTC, WHEP camera streams with talkback support.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'camera rtsp webrtc whep stream feed video talkback' },
        { title: 'Clock Widget', desc: 'Analog and digital modes, timezone, 12/24-hour format.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'clock analog digital time timezone format' },
        { title: 'Weather Widget', desc: 'OpenWeather data with configurable location and units.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'weather temperature forecast openweather location units' },
        { title: 'Calendar Widget', desc: 'MQTT-synced events with reminders and recurring entries.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'calendar events schedule reminders recurring' },
        { title: 'Intercom Widget', desc: 'WebRTC audio/video intercom with push-to-talk and broadcast.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'intercom webrtc audio video broadcast push to talk mediasoup' },
        { title: 'Canvas Widget', desc: 'Declarative graphics: shapes, text, images, animations via MQTT.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'canvas draw graphics shapes text images animation declarative' },
        { title: 'Animated Text Widget', desc: 'Typewriter, neon, marquee, bounce, fade text effects.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'animated text typewriter neon marquee bounce fade effects' },
        { title: 'Map Widget', desc: 'OpenStreetMap with markers, zoom, and center control.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'map openstreetmap markers zoom location gps' },
        { title: 'Audio Visualizer', desc: 'Real-time FFT visualization of audio input.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'audio visualizer fft music spectrum frequency bars' },
        { title: 'LED Panel Widget', desc: 'Scrolling LED-style text display with color control.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'led panel scrolling text ticker display' },
        { title: 'YouTube Widget', desc: 'Embedded YouTube playback with MQTT transport controls.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'youtube video play embed stream' },
        { title: 'PDF Viewer Widget', desc: 'Display PDF documents with page navigation via MQTT.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'pdf viewer document page navigation' },
        { title: 'DLNA Player Widget', desc: 'Discover and play media from DLNA/UPnP servers.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'dlna upnp media player discover cast stream' },
        { title: 'Alarmo Widget', desc: 'Home Assistant Alarmo security panel with PIN control.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'alarmo alarm security panel pin arm disarm home assistant' },
        { title: 'Game Widget', desc: 'Built-in games: Missile Command, and more.', section: 'MQTT Reference', url: 'https://ajarsm.github.io/kingkiosk/docs/MQTT_WIDGET_REFERENCE.html', tags: 'game games missile command play' },

        // -- Custom Widget SDK --
        { title: 'Custom Widget SDK Overview', desc: 'Build HTML/JS widgets with full KingKiosk platform access.', section: 'Widget SDK', url: 'https://ajarsm.github.io/kingkiosk/docs/CUSTOM_WIDGET_SDK.html', tags: 'custom widget sdk html javascript build create develop' },
        { title: 'window.KingKiosk API', desc: 'The JavaScript bridge: onCommand, sendCommand, publishTelemetry.', section: 'Widget SDK', url: 'https://ajarsm.github.io/kingkiosk/docs/CUSTOM_WIDGET_SDK.html', tags: 'kingkiosk api bridge javascript window oncommand sendcommand' },
        { title: 'onCommand()', desc: 'Receive MQTT commands targeted at your custom widget.', section: 'Widget SDK', url: 'https://ajarsm.github.io/kingkiosk/docs/CUSTOM_WIDGET_SDK.html', tags: 'oncommand receive command handler callback' },
        { title: 'sendCommand()', desc: 'Publish events and control other widgets from your widget.', section: 'Widget SDK', url: 'https://ajarsm.github.io/kingkiosk/docs/CUSTOM_WIDGET_SDK.html', tags: 'sendcommand publish send event control' },
        { title: 'publishTelemetry()', desc: 'Share sensor data with the platform and Home Assistant.', section: 'Widget SDK', url: 'https://ajarsm.github.io/kingkiosk/docs/CUSTOM_WIDGET_SDK.html', tags: 'publishtelemetry telemetry sensor data readings' },
        { title: 'storage.get/set()', desc: 'Persistent key-value storage across app restarts.', section: 'Widget SDK', url: 'https://ajarsm.github.io/kingkiosk/docs/CUSTOM_WIDGET_SDK.html', tags: 'storage get set persistent key value save load' },
        { title: 'getWidgetInfo()', desc: 'Get widget ID, platform, device info, and screen dimensions.', section: 'Widget SDK', url: 'https://ajarsm.github.io/kingkiosk/docs/CUSTOM_WIDGET_SDK.html', tags: 'getwidgetinfo widget id platform device info screen' },

        // -- Feature Server --
        { title: 'Remote Browser', desc: 'Server-side Chromium rendering streamed via WebRTC to any device.', section: 'Feature Server', url: '#server', tags: 'remote browser chromium webrtc server side rendering apple tv' },
        { title: 'WebRTC Intercom', desc: 'MediaSoup SFU for low-latency audio/video broadcast between kiosks.', section: 'Feature Server', url: '#server', tags: 'intercom webrtc mediasoup sfu broadcast audio video' },
        { title: 'AI Vision', desc: 'Real-time object detection, facial recognition, audio classification.', section: 'Feature Server', url: '#server', tags: 'ai vision object detection facial recognition yolo inference camera' },
        { title: 'Speech Services (TTS/STT)', desc: 'Piper TTS (100+ voices), Whisper STT. All local, no cloud.', section: 'Feature Server', url: '#server', tags: 'tts stt speech text voice piper whisper transcription' },
        { title: 'Camera Management', desc: 'RTSP/RTMP/HLS ingest, AI alerts, RTSP export to go2rtc.', section: 'Feature Server', url: '#server', tags: 'camera management rtsp rtmp hls ingest export go2rtc frigate' },
        { title: 'RTSP Camera Export', desc: 'Stream tablet/device cameras to Home Assistant via go2rtc.', section: 'Feature Server', url: '#server', tags: 'rtsp export go2rtc frigate home assistant camera stream' },

        // -- Security --
        { title: 'HMAC-SHA256 Command Signing', desc: 'Cryptographically sign every MQTT command for tamper protection.', section: 'Security', url: '#security', tags: 'hmac sha256 signing security signature crypto' },
        { title: 'TLS / DTLS Encryption', desc: 'MQTT over TLS, WebRTC DTLS-SRTP for all media streams.', section: 'Security', url: '#security', tags: 'tls dtls encryption ssl secure mqtt webrtc' },
        { title: 'Kiosk Lockdown', desc: 'Device Owner (Android), Guided Access (iOS), fullscreen kiosk modes.', section: 'Security', url: '#security', tags: 'kiosk lockdown device owner guided access pin lock' },
    ];

    let activeIndex = -1;
    let filtered = [];
    let isOpen = false;

    // Fuzzy match: all query words must appear in title + desc + tags
    function search(query) {
        const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
        if (words.length === 0) return [];

        const scored = [];
        for (const item of index) {
            const hay = `${item.title} ${item.desc} ${item.tags}`.toLowerCase();
            let match = true;
            let score = 0;
            for (const w of words) {
                if (!hay.includes(w)) { match = false; break; }
                // Boost title matches
                if (item.title.toLowerCase().includes(w)) score += 10;
                // Boost exact tag matches
                if (item.tags.includes(w)) score += 5;
                // Boost description matches
                if (item.desc.toLowerCase().includes(w)) score += 2;
            }
            if (match) scored.push({ item, score });
        }

        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, 12).map(s => s.item);
    }

    function render(items) {
        if (items.length === 0) {
            results.innerHTML = '<div class="doc-search-empty">No results found. Try a different search term.</div>';
            results.classList.add('open');
            isOpen = true;
            return;
        }

        // Group by section
        const groups = {};
        for (const item of items) {
            if (!groups[item.section]) groups[item.section] = [];
            groups[item.section].push(item);
        }

        let html = '';
        for (const [section, entries] of Object.entries(groups)) {
            html += `<div class="doc-result-group"><div class="doc-result-group-label">${section}</div>`;
            for (const entry of entries) {
                const idx = filtered.indexOf(entry);
                html += `<a href="${entry.url}" target="${entry.url.startsWith('#') ? '_self' : '_blank'}" class="doc-result-item${idx === activeIndex ? ' active' : ''}" data-index="${idx}">
                    <div class="doc-result-title">${entry.title}</div>
                    <div class="doc-result-desc">${entry.desc}</div>
                </a>`;
            }
            html += '</div>';
        }

        results.innerHTML = html;
        results.classList.add('open');
        isOpen = true;
    }

    function close() {
        results.classList.remove('open');
        results.innerHTML = '';
        isOpen = false;
        activeIndex = -1;
    }

    function updateActive() {
        results.querySelectorAll('.doc-result-item').forEach((el, i) => {
            el.classList.toggle('active', parseInt(el.dataset.index) === activeIndex);
        });
        // Scroll active into view
        const active = results.querySelector('.doc-result-item.active');
        if (active) active.scrollIntoView({ block: 'nearest' });
    }

    // Input handler
    input.addEventListener('input', () => {
        const q = input.value.trim();
        if (q.length === 0) { close(); return; }
        filtered = search(q);
        activeIndex = -1;
        render(filtered);
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
        if (!isOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
            updateActive();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, -1);
            updateActive();
        } else if (e.key === 'Enter' && activeIndex >= 0 && filtered[activeIndex]) {
            e.preventDefault();
            const entry = filtered[activeIndex];
            if (entry.url.startsWith('#')) {
                const target = document.querySelector(entry.url);
                if (target) {
                    const top = target.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            } else {
                window.open(entry.url, '_blank');
            }
            close();
            input.blur();
        } else if (e.key === 'Escape') {
            close();
            input.blur();
        }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.doc-search-wrap')) {
            close();
        }
    });

    // "/" keyboard shortcut to focus search
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const tag = document.activeElement?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            e.preventDefault();
            input.focus();
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Hide kbd hint when focused
    input.addEventListener('focus', () => { if (kbd) kbd.style.opacity = '0'; });
    input.addEventListener('blur', () => { if (kbd && !input.value) kbd.style.opacity = '1'; });
}

/* === Particle / Ambient Effects === */
(function initAmbient() {
    // Subtle mouse-follow glow on hero
    const hero = document.getElementById('hero');
    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        hero.style.setProperty('--mx', `${x}%`);
        hero.style.setProperty('--my', `${y}%`);
    });
})();
